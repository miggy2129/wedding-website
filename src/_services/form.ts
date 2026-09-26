"use server"
import { FormState, RsvpStatus } from "@/_types/rsvp";

type FormError = Error & { status?: number };

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const NOT_FOUND_MESSAGE = "We can't seem to find you in the list.";
const SAVE_FAILED_MESSAGE = "We couldn't save your RSVP right now. Please try again in a moment.";

// Airtable column names (case-sensitive); must match the table's headers.
const FIELDS = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    status: "RSVP status",
    notes: "Notes",
    dietary: "Dietary Restrictions"
} as const;

function formError(message: string, status: number): FormError {
    return Object.assign(new Error(message), { status });
}

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        console.error(`Missing required ENV variable: ${name}`);
        throw new Error("Missing required ENV variable.");
    }

    return value;
}

// Airtable formula strings are double-quoted; escape backslashes and quotes.
function escapeFormulaString(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function readAirtableResponse(response: Response, action: string) {
    const body = await response.json().catch(() => null);

    if (!response.ok) {
        console.error(`Airtable ${action} failed`, response.status, JSON.stringify(body));
        throw formError(SAVE_FAILED_MESSAGE, response.status);
    }

    return body;
}

export async function postSubmit(formData: FormState) {
    try {
        const apiKey = requireEnv("AIRTABLE_KEY");
        const baseId = requireEnv("AIRTABLE_BASE_ID");
        const tableName = requireEnv("AIRTABLE_TABLE_NAME");

        const name = String(formData?.name ?? "").trim();
        const status = formData?.status;

        if (!name) {
            throw formError("Please enter your name.", 400);
        }

        if (status !== RsvpStatus.accepted && status !== RsvpStatus.declined) {
            throw formError("Please let us know if you can attend.", 400);
        }

        const tableUrl = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`;
        const headers = {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        };

        // Case-insensitive match on the guest's name, returning only the record id.
        const lookupParams = new URLSearchParams({
            maxRecords: "1",
            filterByFormula: `LOWER(TRIM({${FIELDS.name}}))="${escapeFormulaString(name.toLowerCase())}"`
        });
        lookupParams.append("fields[]", FIELDS.name);

        const lookup = await readAirtableResponse(
            await fetch(`${tableUrl}?${lookupParams}`, { headers }),
            "lookup"
        );
        const record = lookup?.records?.[0];

        if (!record) {
            throw formError(NOT_FOUND_MESSAGE, 404);
        }

        // PATCH only touches the fields sent, so columns like "group" are left alone.
        await readAirtableResponse(
            await fetch(`${tableUrl}/${record.id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    fields: {
                        [FIELDS.email]: formData.email,
                        [FIELDS.phone]: formData.phone,
                        [FIELDS.status]: status,
                        [FIELDS.notes]: formData.notes,
                        [FIELDS.dietary]: formData.dietary
                    },
                    typecast: true
                })
            }),
            "update"
        );

        return {
            success: true,
            status: 200,
            message: "Successfully updated user details"
        };
    } catch(error) {
        return {
            success: false,
            status: error instanceof Error && "status" in error ? (error as FormError).status : undefined,
            message: error instanceof Error ? error.message : String(error)
        };
    }
}
