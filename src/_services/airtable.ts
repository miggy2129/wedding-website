import { RsvpStatus } from "@/_types/rsvp";

// Server-only helpers. Only import this from server actions ("use server" files).

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const GROUPS_TABLE = "Groups";
const BATCH_SIZE = 10;

export const NOT_FOUND_MESSAGE = "We can't seem to find you in the list.";
export const SAVE_FAILED_MESSAGE = "We couldn't save your RSVP right now. Please try again in a moment.";

// Airtable column names (case-sensitive); must match the table's headers.
export const FIELDS = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    status: "RSVP status",
    notes: "Notes",
    dietary: "Dietary Restrictions",
    group: "Group"
} as const;
const GROUP_GUESTS_FIELD = "Guests in Group";

export type FormError = Error & { status?: number };

export function formError(message: string, status: number): FormError {
    return Object.assign(new Error(message), { status });
}

export type Guest = {
    id: string;
    name: string;
    status: RsvpStatus | null;
    email: string;
    phone: string;
    groupId: string | null;
};

export type AirtableConfig = {
    signingSecret: string;
    headers: Record<string, string>;
    guestsUrl: string;
    groupsUrl: string;
};

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        console.error(`Missing required ENV variable: ${name}`);
        throw new Error("Missing required ENV variable.");
    }

    return value;
}

export function getConfig(): AirtableConfig {
    const apiKey = requireEnv("AIRTABLE_KEY");
    const baseId = requireEnv("AIRTABLE_BASE_ID");
    const tableName = requireEnv("AIRTABLE_TABLE_NAME");

    return {
        signingSecret: apiKey,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        guestsUrl: `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`,
        groupsUrl: `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(GROUPS_TABLE)}`
    };
}

// Airtable formula strings are double-quoted; escape backslashes and quotes.
function escapeFormulaString(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function request(config: AirtableConfig, url: string, init: RequestInit, action: string) {
    const response = await fetch(url, { ...init, headers: config.headers });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
        console.error(`Airtable ${action} failed`, response.status, JSON.stringify(body));
        throw formError(SAVE_FAILED_MESSAGE, response.status);
    }

    return body;
}

export function toStatus(value: unknown): RsvpStatus | null {
    return value === RsvpStatus.accepted || value === RsvpStatus.declined ? value : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toGuest(record: any): Guest {
    const fields = record.fields ?? {};

    return {
        id: record.id,
        name: String(fields[FIELDS.name] ?? ""),
        status: toStatus(fields[FIELDS.status]),
        email: String(fields[FIELDS.email] ?? "").trim(),
        phone: String(fields[FIELDS.phone] ?? "").trim(),
        groupId: fields[FIELDS.group]?.[0] ?? null
    };
}

// Case-insensitive match on the guest's name.
export async function findGuestByName(config: AirtableConfig, name: string): Promise<Guest | null> {
    const params = new URLSearchParams({
        maxRecords: "1",
        filterByFormula: `LOWER(TRIM({${FIELDS.name}}))="${escapeFormulaString(name.toLowerCase())}"`
    });
    [FIELDS.name, FIELDS.group].forEach((field) => params.append("fields[]", field));

    const body = await request(config, `${config.guestsUrl}?${params}`, {}, "lookup");

    return body?.records?.[0] ? toGuest(body.records[0]) : null;
}

const RECORD_ID_PATTERN = /^rec[A-Za-z0-9]+$/;

// Call 2 of 3: ids of everyone else linked to the guest's Group record.
export async function findGroupMateIds(config: AirtableConfig, guest: Guest): Promise<string[]> {
    if (!guest.groupId || !RECORD_ID_PATTERN.test(guest.groupId)) return [];

    // The single-record endpoint can't limit fields, so filter the list endpoint by id.
    const params = new URLSearchParams({
        maxRecords: "1",
        filterByFormula: `RECORD_ID()="${guest.groupId}"`
    });
    params.append("fields[]", GROUP_GUESTS_FIELD);
    const group = await request(config, `${config.groupsUrl}?${params}`, {}, "group lookup");

    return (group?.records?.[0]?.fields?.[GROUP_GUESTS_FIELD] ?? []).filter(
        (id: unknown): id is string => typeof id === "string" && RECORD_ID_PATTERN.test(id) && id !== guest.id
    );
}

// Call 3 of 3: details for those guests, in one request however many there are.
export async function findGuestsByIds(config: AirtableConfig, ids: string[]): Promise<Guest[]> {
    const valid = ids.filter((id) => RECORD_ID_PATTERN.test(id));
    if (valid.length === 0) return [];

    const params = new URLSearchParams({
        filterByFormula: `OR(${valid.map((id) => `RECORD_ID()="${id}"`).join(",")})`
    });
    [FIELDS.name, FIELDS.status, FIELDS.email, FIELDS.phone].forEach((field) => params.append("fields[]", field));

    const body = await request(config, `${config.guestsUrl}?${params}`, {}, "group members lookup");
    const byId = new Map<string, Guest>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (body?.records ?? []).map((record: any) => [record.id, toGuest(record)])
    );

    return valid.map((id) => byId.get(id)).filter((guest): guest is Guest => !!guest);
}

export type RecordUpdate = { id: string; fields: Record<string, string> };

// PATCH only touches the fields sent, so columns like "Group" are left alone.
export async function updateRecords(config: AirtableConfig, records: RecordUpdate[]) {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        await request(
            config,
            config.guestsUrl,
            {
                method: "PATCH",
                body: JSON.stringify({ records: records.slice(i, i + BATCH_SIZE), typecast: true })
            },
            "update"
        );
    }
}

// Blank inputs are skipped so they don't wipe existing values (e.g. a "Pending" note).
export function buildRsvpFields(input: {
    status: RsvpStatus;
    email?: string;
    phone?: string;
    notes?: string;
    dietary?: string;
}): Record<string, string> {
    const fields: Record<string, string> = { [FIELDS.status]: input.status };
    const optional = {
        [FIELDS.email]: input.email,
        [FIELDS.phone]: input.phone,
        [FIELDS.notes]: input.notes,
        [FIELDS.dietary]: input.dietary
    };

    for (const [field, value] of Object.entries(optional)) {
        const trimmed = String(value ?? "").trim();
        if (trimmed) fields[field] = trimmed;
    }

    return fields;
}
