"use client";
import { useEffect, useRef, useState } from "react";
import { loadGroupMembers, postGroupSubmit } from "@/_services/form";
import { FormState, GroupMember, GroupUpdate, RsvpResult, RsvpStatus } from "@/_types/rsvp";

const inputClass =
  "w-full border border-[#E8D8CC] bg-white px-3 py-2 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-[#B8966E] transition-colors";

const invalidInputClass =
  "w-full border border-[#C97B7B] bg-white px-3 py-2 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-[#9A3B3B] transition-colors";

const smallLabelClass =
  "block font-lato text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/70 mb-1";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Row = Omit<GroupUpdate, "id">;

type Props = {
  form: FormState;
  group: { token: string; count: number };
  onBack: () => void;
  onDone: (updatedOthers: number) => void;
};

const toggleOptions = [
  { value: RsvpStatus.accepted, label: "Accepts" },
  { value: RsvpStatus.declined, label: "Declines" },
] as const;

export default function GroupRsvpDialog({ form, group, onBack, onDone }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [rows, setRows] = useState<Record<string, Row>>({});

  // Strict Mode runs effects twice in development; sharing one request per
  // attempt avoids a wasted (and queued) duplicate server call.
  const loadRequest = useRef<{ key: string; promise: Promise<RsvpResult> } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const key = `${group.token}:${loadAttempt}`;
    if (loadRequest.current?.key !== key) {
      loadRequest.current = { key, promise: loadGroupMembers(group.token) };
    }

    loadRequest.current.promise
      .then((result) => {
        if (cancelled) return;

        if (result.success && result.members) {
          setRows(
            Object.fromEntries(
              result.members.map((m) => [m.id, { status: m.status, email: "", phone: "", dietary: "" }])
            )
          );
          setMembers(result.members);
        } else {
          setLoadError(result.message);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("We couldn't load your party. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [group.token, loadAttempt]);

  const retryLoad = () => {
    setLoadError(null);
    setLoadAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      dialog.close();
    };
  }, []);

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    if ("email" in patch) {
      setEmailErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (isSubmittingRef.current || !members) return;

    const errors: Record<string, string> = {};
    members.forEach((m) => {
      const email = rows[m.id].email.trim();
      if (rows[m.id].status && email && !EMAIL_PATTERN.test(email)) {
        errors[m.id] = "Please enter a valid email address.";
      }
    });
    setEmailErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(null);
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const updates: GroupUpdate[] = members.map((m) => ({ id: m.id, ...rows[m.id] }));
      const results = await postGroupSubmit({ form, token: group.token, updates });

      if (results.success) {
        onDone(results.updatedOthers ?? 0);
      } else {
        setError(results.message);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="group-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!isSubmittingRef.current) onBack();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[88vh] overflow-y-auto bg-[#FAF8F5] p-8 text-left text-[#2C2C2C] backdrop:bg-black/50"
    >
      <h3 id="group-dialog-title" className="font-serif text-3xl font-light mb-3">
        Anyone else in your party?
      </h3>
      <p className="font-lato text-sm text-[#2C2C2C]/60 mb-6">
        Your response ({form.status === RsvpStatus.declined ? "declines" : "accepts"}) is saved
        together with anyone you answer for below. Leave someone unset to skip them.
      </p>

      {members === null && !loadError && (
        <>
          <p role="status" className="font-lato text-sm text-[#2C2C2C]/60 mb-4">
            Finding everyone in your party…
          </p>
          <ul aria-hidden="true" className="space-y-5">
            {Array.from({ length: group.count }, (_, i) => (
              <li key={i} className="border border-[#E8D8CC] bg-white p-5 animate-pulse">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="h-7 w-40 bg-[#E8D8CC]" />
                  <div className="flex">
                    <div className="h-9 w-24 bg-[#F0E6DF]" />
                    <div className="h-9 w-24 bg-[#F0E6DF]" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {loadError && (
        <div className="font-lato text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={retryLoad}
            className="mt-2 underline underline-offset-2 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      <ul className="space-y-5">
        {(members ?? []).map((member) => {
          const row = rows[member.id];

          return (
            <li key={member.id} className="border border-[#E8D8CC] bg-white p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="font-serif text-2xl font-light">
                  {member.name}{" "}
                  <span className="font-sans text-xs font-normal tracking-normal text-[#2C2C2C]/40">
                    (optional)
                  </span>
                </p>
                <div
                  role="group"
                  aria-label={`Response for ${member.name}`}
                  className="flex"
                >
                  {toggleOptions.map((option) => {
                    const active = row.status === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          updateRow(member.id, { status: active ? null : option.value })
                        }
                        className={`font-lato text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer ${
                          active
                            ? "bg-[#B8966E] border-[#B8966E] text-white"
                            : "bg-white border-[#E8D8CC] text-[#2C2C2C] hover:border-[#B8966E]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {row.status === RsvpStatus.accepted && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`email-${member.id}`} className={smallLabelClass}>
                      Email
                    </label>
                    <input
                      id={`email-${member.id}`}
                      type="email"
                      placeholder="Same as yours if blank"
                      value={row.email}
                      onChange={(e) => updateRow(member.id, { email: e.target.value })}
                      aria-invalid={!!emailErrors[member.id]}
                      className={emailErrors[member.id] ? invalidInputClass : inputClass}
                    />
                    {emailErrors[member.id] && (
                      <p className="font-lato text-xs text-[#9A3B3B] mt-1">
                        {emailErrors[member.id]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`phone-${member.id}`} className={smallLabelClass}>
                      Phone
                    </label>
                    <input
                      id={`phone-${member.id}`}
                      type="tel"
                      placeholder="Same as yours if blank"
                      value={row.phone}
                      onChange={(e) => updateRow(member.id, { phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`dietary-${member.id}`} className={smallLabelClass}>
                      Dietary restrictions{" "}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id={`dietary-${member.id}`}
                      type="text"
                      placeholder="None, vegetarian, gluten-free, etc."
                      value={row.dietary}
                      onChange={(e) => updateRow(member.id, { dietary: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="font-lato text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3 mt-5">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting || !members}
          className="flex-1 bg-[#B8966E] text-white font-lato text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#B8966E]"
        >
          {isSubmitting ? "Saving..." : "Save RSVP"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C]/60 hover:text-[#B8966E] transition-colors cursor-pointer disabled:opacity-60"
        >
          Back
        </button>
      </div>
    </dialog>
  );
}
