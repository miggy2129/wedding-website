"use server"
import { FormState, GroupUpdate, RsvpResult, RsvpStatus } from "@/_types/rsvp";
import {
    FormError,
    NOT_FOUND_MESSAGE,
    RecordUpdate,
    SAVE_FAILED_MESSAGE,
    buildRsvpFields,
    findGroupMateIds,
    findGuestByName,
    findGuestsByIds,
    formError,
    getConfig,
    toStatus,
    updateRecords
} from "./airtable";
import { createGroupToken, verifyGroupToken } from "./groupToken";

const SUCCESS_MESSAGE = "Successfully updated user details";
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

function failure(error: unknown): RsvpResult {
    return {
        success: false,
        status: error instanceof Error && "status" in error ? (error as FormError).status : undefined,
        message: error instanceof Error ? error.message : String(error)
    };
}

function clean(value: unknown): string {
    return String(value ?? "").trim();
}

function assertEmail(email: string) {
    if (email && !EMAIL_PATTERN.test(email)) {
        throw formError("Please enter a valid email address.", 400);
    }
}

// Server actions are publicly callable, so re-validate everything the form checks.
function validateForm(formData: FormState) {
    const name = clean(formData?.name);
    const email = clean(formData?.email);
    const phone = clean(formData?.phone);
    const status = formData?.status;

    if (!name) {
        throw formError("Please enter your name.", 400);
    }

    if (status !== RsvpStatus.accepted && status !== RsvpStatus.declined) {
        throw formError("Please let us know if you can attend.", 400);
    }

    if (!email && !phone) {
        throw formError("Please provide an email or a phone number.", 400);
    }

    assertEmail(email);

    return { name, status, email, phone, notes: clean(formData.notes), dietary: clean(formData.dietary) };
}

function openGroupToken(config: ReturnType<typeof getConfig>, token: unknown) {
    const group = verifyGroupToken(token, config.signingSecret);

    if (!group) {
        throw formError("This has expired. Please submit your details again.", 401);
    }

    return group;
}

// Step 1 (2 lookups): find the guest and whether they have group-mates. If so,
// return a signed token right away (nothing is written yet) so the modal can
// open while the members load; anyone else is saved immediately.
export async function postSubmit(formData: FormState): Promise<RsvpResult> {
    try {
        const config = getConfig();
        const primary = validateForm(formData);

        const guest = await findGuestByName(config, primary.name);
        if (!guest) {
            throw formError(NOT_FOUND_MESSAGE, 404);
        }

        const mateIds = await findGroupMateIds(config, guest);
        if (mateIds.length > 0) {
            return {
                success: true,
                status: 200,
                message: "Group found",
                group: {
                    token: createGroupToken({ guestId: guest.id, mateIds }, config.signingSecret),
                    count: mateIds.length
                }
            };
        }

        await updateRecords(config, [
            { id: guest.id, fields: buildRsvpFields({ ...primary, submittedBy: primary.name }) }
        ]);

        return { success: true, status: 200, message: SUCCESS_MESSAGE };
    } catch (error) {
        return failure(error);
    }
}

// Step 2 (1 lookup): names and current answers for the group-mates.
export async function loadGroupMembers(token: string): Promise<RsvpResult> {
    try {
        const config = getConfig();
        const group = openGroupToken(config, token);
        const mates = await findGuestsByIds(config, group.mateIds);

        return {
            success: true,
            status: 200,
            message: "Members loaded",
            members: mates.map(({ id, name, status }) => ({ id, name, status }))
        };
    } catch (error) {
        const result = failure(error);

        // Keep the "expired" message; anything else is a failure to load.
        return result.status === 401
            ? result
            : { ...result, message: "We couldn't load your party right now. Please try again." };
    }
}

// Step 3: save the first guest and their group-mates in one batch. The token
// fixes who they may answer for, so only the members are re-read (for the
// contact details already on file) before the write.
export async function postGroupSubmit(payload: {
    form: FormState;
    token: string;
    updates: GroupUpdate[];
}): Promise<RsvpResult> {
    try {
        const config = getConfig();
        const primary = validateForm(payload?.form);
        const group = openGroupToken(config, payload?.token);

        // Only people who really share this guest's group may be updated.
        const mates = new Map((await findGuestsByIds(config, group.mateIds)).map((mate) => [mate.id, mate]));
        const records: RecordUpdate[] = [
            { id: group.guestId, fields: buildRsvpFields({ ...primary, submittedBy: primary.name }) }
        ];
        const seen = new Set<string>();

        for (const update of Array.isArray(payload.updates) ? payload.updates : []) {
            const mate = mates.get(update?.id);
            if (!mate || seen.has(mate.id)) {
                throw formError(SAVE_FAILED_MESSAGE, 400);
            }
            seen.add(mate.id);

            const status = toStatus(update.status);
            if (!status) continue;

            const email = clean(update.email);
            const phone = clean(update.phone);
            assertEmail(email);

            // Without their own details, borrow the first guest's, but never
            // overwrite contact info that's already on file.
            records.push({
                id: mate.id,
                fields: buildRsvpFields({
                    status,
                    submittedBy: primary.name,
                    email: email || (mate.email ? "" : primary.email),
                    phone: phone || (mate.phone ? "" : primary.phone),
                    dietary: clean(update.dietary)
                })
            });
        }

        await updateRecords(config, records);

        return { success: true, status: 200, message: SUCCESS_MESSAGE, updatedOthers: records.length - 1 };
    } catch (error) {
        return failure(error);
    }
}
