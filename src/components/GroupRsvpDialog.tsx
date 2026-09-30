"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { loadGroupMembers, postGroupSubmit } from "@/_services/form";
import { FormState, GroupMember, GroupUpdate, RsvpResult, RsvpStatus } from "@/_types/rsvp";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const toggleOptions = [
  { value: RsvpStatus.accepted, label: "Attending" },
  { value: RsvpStatus.declined, label: "Not Attending" },
] as const;

type Row = Omit<GroupUpdate, "id">;

type Props = {
  form: FormState;
  group: { token: string; count: number };
  onBack: () => void;
  onDone: (updatedOthers: number) => void;
};

export default function GroupRsvpDialog({ form, group, onBack, onDone }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollTopRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const pressStartedOnBackdropRef = useRef(false);
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

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.scrollTop !== scrollTopRef.current) {
      dialog.scrollTop = scrollTopRef.current;
    }
  });

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
      // Only treat it as an outside click when the press both started and ended on
      // the backdrop, so dragging a text selection out of an input doesn't close it.
      onMouseDown={(e) => {
        pressStartedOnBackdropRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (
          e.target === e.currentTarget &&
          pressStartedOnBackdropRef.current &&
          !isSubmittingRef.current
        ) {
          onBack();
        }
      }}
      onScroll={(e) => {
        scrollTopRef.current = e.currentTarget.scrollTop;
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[88vh] overflow-x-hidden overflow-y-auto bg-(--color-cream) text-left text-(--color-brown) backdrop:bg-black/60"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 z-0">
        <Image
          src="/images/design/bottom/flower-orange-2.png"
          alt=""
          width={256}
          height={256}
          className="h-64 w-64 rotate-180 object-contain"
        />
      </div>
      <div className="sticky top-0 z-20 h-0">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          aria-label="Close"
          title="Close"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-(--color-brown)/70 transition-colors hover:bg-(--color-brown)/10 hover:text-(--color-pink) disabled:opacity-60 cursor-pointer"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="relative z-10 mb-3 px-8 pt-8">
        <h3 id="group-dialog-title" className="pr-24 font-serif text-3xl">
        Anyone else in your party?
        </h3>
      <p className="max-w-[65%] text-sm text-(--color-charcoal)/60 mb-6 pt-3">
        Your response ({form.status === RsvpStatus.declined ? "not attending" : "attending"})
        is saved together with anyone you answer for below. Anyone you leave unanswered is skipped.
      </p>
      </div>

      {members === null && !loadError && (
        <>
          <p role="status" className="text-sm text-(--color-charcoal)/60 mb-4">
            Finding everyone in your party…
          </p>
          <ul aria-hidden="true" className="space-y-5">
            {Array.from({ length: group.count }, (_, i) => (
              <li key={i} className="border border-[#E8D8CC] bg-white p-5 animate-pulse">
                <div className="flex flex-col gap-3">
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
        <div className="text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3">
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

      <ul className="space-y-5 px-8">
        {(members ?? []).map((member) => {
          const row = rows[member.id];

          return (
            <li key={member.id} className="border border-(--color-muted) bg-white p-5">
              <div className="relative z-10 flex md:flex-row flex-col justify-between gap-3">
                <p className="min-w-0 break-words font-serif text-2xl">
                  {member.name}
                </p>
                <div className="flex flex-col md:flex-row md:place-content-between items-start md:items-center gap-2">
                  {row.status && (
                    <button
                      type="button"
                      onClick={() => updateRow(member.id, { status: null })}
                      aria-label={`Clear response for ${member.name}`}
                      className="md:order-1 order-2 ml-auto md:mr-4 text-[10px] md:py-2 px-1 mt-4 md:mt-0 tracking-[0.15em] uppercase text-(--color-charcoal)/90 underline underline-offset-2 hover:text-(--color-red-600) hover:font-semibold transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <div
                    role="group"
                    aria-label={`Response for ${member.name}`}
                    className="md:order-2 order-1 flex flex-wrap"
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
                          className={`text-xs tracking-[0.15em] capitalize px-4 py-2 border transition-colors cursor-pointer ${
                            active
                              ? "bg-(--color-pink) border-(--color-pink) text-white"
                              : "bg-white border-(--color-pink) text-(--color-brown) hover:border-(--color-pink) hover:bg-(--color-pink)/40"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {row.status === RsvpStatus.accepted && (
                <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`email-${member.id}`} className={"block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1"}>
                      Email
                    </label>
                    <input
                      id={`email-${member.id}`}
                      type="email"
                      placeholder="Same as yours if blank"
                      value={row.email}
                      onChange={(e) => updateRow(member.id, { email: e.target.value })}
                      aria-invalid={!!emailErrors[member.id]}
                      className={emailErrors[member.id] ? "w-full border border-[#C97B7B] bg-white px-3 py-2 text-sm text-(--color-charcoal) focus:outline-none focus:border-(--color-yellow) focus:bg-(--color-yellow)/20 transition-colors" : "w-full border border-(--color-orange)/40 bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-yellow) focus:bg-(--color-yellow)/20 transition-colors"}
                    />
                    {emailErrors[member.id] && (
                      <p className="text-xs text-[#9A3B3B] mt-1">
                        {emailErrors[member.id]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`phone-${member.id}`} className={"block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1"}>
                      Phone
                    </label>
                    <input
                      id={`phone-${member.id}`}
                      type="tel"
                      placeholder="Same as yours if blank"
                      value={row.phone}
                      onChange={(e) => updateRow(member.id, { phone: e.target.value })}
                      className={"w-full border border-(--color-orange)/40 bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-yellow) focus:bg-(--color-yellow)/20 transition-colors"}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`dietary-${member.id}`} className={"block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1"}>
                      Dietary restrictions{" "}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id={`dietary-${member.id}`}
                      type="text"
                      placeholder="None, vegetarian, gluten-free, etc."
                      value={row.dietary}
                      onChange={(e) => updateRow(member.id, { dietary: e.target.value })}
                      className={"w-full border border-(--color-orange)/40 bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-yellow) focus:bg-(--color-yellow)/20 transition-colors"}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="mx-8 font-medium text-sm text-(--color-red-600) bg-(--color-red-600)/10 border border-(--color-red-600)/40 px-4 py-3 mt-5">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 pb-8 px-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting || !members}
          className="flex-1 w-full bg-(--color-pink) text-white text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-(--color-pink)"
        >
          {isSubmitting ? "Saving..." : "Save RSVP"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="p-2 text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C]/60 hover:text-(--color-pink) transition-colors cursor-pointer disabled:opacity-60 hover:underline underline-offset-4"
        >
          Back
        </button>
      </div>
    </dialog>
  );
}