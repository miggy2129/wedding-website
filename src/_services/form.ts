"use server"
import { FormState, GroupUpdate, RsvpResult, RsvpStatus } from "@/_types/rsvp";
import {
    FormError,
    NOT_FOUND_MESSAGE,
    RecordUpdate,
    SAVE_FAILED_MESSAGE,
    buildRsvpFields,
    findGroupMates,
    findGuestByName,
    formError,
    getConfig,
    toStatus,
    updateRecords
} from "./airtable";

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

// Step 1: look the guest up. A guest with group-mates gets the group back
// to answer for (nothing is written yet); anyone else is saved right away.
export async function postSubmit(formData: FormState): Promise<RsvpResult> {
    try {
        const config = getConfig();
        const primary = validateForm(formData);

        const guest = await findGuestByName(config, primary.name);
        if (!guest) {
            throw formError(NOT_FOUND_MESSAGE, 404);
        }

        const mates = await findGroupMates(config, guest);
        if (mates.length > 0) {
            return {
                success: true,
                status: 200,
                message: "Group found",
                members: mates.map(({ id, name, status }) => ({ id, name, status }))
            };
        }

        await updateRecords(config, [{ id: guest.id, fields: buildRsvpFields(primary) }]);

        return { success: true, status: 200, message: SUCCESS_MESSAGE };
    } catch (error) {
        return failure(error);
    }
}

// Step 2: save the first guest and their group-mates in one batch.
export async function postGroupSubmit(payload: {
    form: FormState;
    updates: GroupUpdate[];
}): Promise<RsvpResult> {
    try {
        const config = getConfig();
        const primary = validateForm(payload?.form);

        const guest = await findGuestByName(config, primary.name);
        if (!guest) {
            throw formError(NOT_FOUND_MESSAGE, 404);
        }

        // Only people who really share this guest's group may be updated.
        const mates = new Map((await findGroupMates(config, guest)).map((mate) => [mate.id, mate]));
        const records: RecordUpdate[] = [{ id: guest.id, fields: buildRsvpFields(primary) }];
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
