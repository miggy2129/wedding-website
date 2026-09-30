"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loadGroupMembers, postGroupSubmit } from "@/_services/form";
import { FormState, GroupMember, GroupUpdate, RsvpResult, RsvpStatus, rsvpStatusLabels } from "@/_types/rsvp";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Row = Omit<GroupUpdate, "id">;

type Props = {
  onBack: () => void;
};

const toggleOptions = [
  { value: RsvpStatus.accepted, label: rsvpStatusLabels[RsvpStatus.accepted] },
  { value: RsvpStatus.declined, label: rsvpStatusLabels[RsvpStatus.declined] },
] as const;

export default function GroupRsvpDialog({ onBack }: Props) {
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

    // const key = `${group.token}:${loadAttempt}`;
    // if (loadRequest.current?.key !== key) {
    //   loadRequest.current = { key, promise: loadGroupMembers(group.token) };
    // }

    const testMembers: GroupMember[] = [
        {
            id: "1",
            name: "Litz Mercado",
            status: null,
        },
        {
            id: "2",
            name: "Gene Mercado",
            status: null,
        },
        {
            id: "3",
            name: "Joaquin Mercado",
            status: null,
        }
    ];

    setMembers(testMembers);

    setRows(
      Object.fromEntries(
        testMembers.map((member) => [
          member.id,
          { status: member.status, email: "", phone: "", dietary: "" },
        ])
      )
    );

    // loadRequest.current.promise
    //   .then((result) => {
    //     if (cancelled) return;

    //     if (result.success && result.members) {
    //       setRows(
    //         Object.fromEntries(
    //           result.members.map((m) => [m.id, { status: m.status, email: "", phone: "", dietary: "" }])
    //         )
    //       );
    //       setMembers(result.members);
    //     } else {
    //       setLoadError(result.message);
    //     }
    //   })
    //   .catch(() => {
    //     if (!cancelled) setLoadError("We couldn't load your party. Please try again.");
    //   });

//     return () => {
//       cancelled = true;
//     };
  }, []);

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
//     if (isSubmittingRef.current || !members) return;

//     const errors: Record<string, string> = {};
//     members.forEach((m) => {
//       const email = rows[m.id].email.trim();
//       if (rows[m.id].status && email && !EMAIL_PATTERN.test(email)) {
//         errors[m.id] = "Please enter a valid email address.";
//       }
//     });
//     setEmailErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       setError(null);
//       return;
//     }

//     isSubmittingRef.current = true;
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const updates: GroupUpdate[] = members.map((m) => ({ id: m.id, ...rows[m.id] }));
//       const results = await postGroupSubmit({ form, token: group.token, updates });

//       if (results.success) {
//         onDone(results.updatedOthers ?? 0);
//       } else {
//         setError(results.message);
//       }
//     } finally {
//       isSubmittingRef.current = false;
//       setIsSubmitting(false);
//     }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="group-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!isSubmittingRef.current) onBack();
      }}
      className="relative m-auto w-[calc(100%-2rem)] max-w-xl max-h-[88vh] overflow-x-hidden overflow-y-auto bg-(--color-cream) text-left text-(--color-brown) backdrop:bg-black/60"
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
      <div className="relative z-10 mb-3 px-8 pt-8">
        <h3 id="group-dialog-title" className="pr-24 font-serif text-3xl">
          Is anyone coming with you?
        </h3>
        <p className="max-w-[65%] text-sm text-(--color-charcoal)/60 mb-6 pt-3">
          We’ve linked your response <b className="text-(--color-pink) capitalize">(attending)</b> with your group below.<br/><br/>
          Simply let us know who else will be joining or missing the celebration, or leave them as-is if they're responding separately.
        </p>
      </div>

      <ul className="space-y-5 px-8">
        {(members ?? []).map((member, memberIndex, memberList) => {
          const row = rows[member.id];
          const isLastMember = memberIndex === memberList.length - 1;

          return (
            <li
              key={member.id}
              className={`border border-(--color-muted) bg-white p-5`}
            >
              <div className="relative z-10 flex flex-col gap-3">
                <p className="min-w-0 break-words font-serif text-2xl">
                    {member.name}
                </p>
                <div className="flex flex-col md:flex-row md:place-content-between items-start md:items-center gap-2">
                  <div
                    role="group"
                    aria-label={`Response for ${member.name}`}
                    className="flex flex-wrap"
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
                  {row.status && (
                    <button
                      type="button"
                      onClick={() => updateRow(member.id, { status: null })}
                      aria-label={`Clear response for ${member.name}`}
                      className="text-xs py-2 tracking-[0.15em] uppercase text-(--color-charcoal)/90 underline underline-offset-2 hover:text-(--color-red) transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {row.status === RsvpStatus.accepted && (
                <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`email-${member.id}`} className={`block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1`}>
                      Email
                    </label>
                    <input
                      id={`email-${member.id}`}
                      type="email"
                      placeholder="Same as yours if blank"
                      value={row.email}
                      onChange={(e) => updateRow(member.id, { email: e.target.value })}
                      aria-invalid={!!emailErrors[member.id]}
                      className={emailErrors[member.id] ? `w-full border border-[#C97B7B] bg-white px-3 py-2 text-sm text-(--color-charcoal) focus:outline-none focus:border-[#9A3B3B] transition-colors` : `w-full border border-(--color-green) bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-orange) transition-colors`}
                    />
                    {emailErrors[member.id] && (
                      <p className="text-xs text-[#9A3B3B] mt-1">
                        {emailErrors[member.id]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`phone-${member.id}`} className={`block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1`}>
                      Phone
                    </label>
                    <input
                      id={`phone-${member.id}`}
                      type="tel"
                      placeholder="Same as yours if blank"
                      value={row.phone}
                      onChange={(e) => updateRow(member.id, { phone: e.target.value })}
                      className={`w-full border border-(--color-green) bg-white px-3 py-2 text-sm text-(--color-charcoal) focus:outline-none focus:border-(--color-orange) transition-colors`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`dietary-${member.id}`} className={`block text-[10px] tracking-[0.2em] uppercase text-(--color-charcoal)/90 mb-1`}>
                      Dietary restrictions{" "}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id={`dietary-${member.id}`}
                      type="text"
                      placeholder="None, vegetarian, gluten-free, etc."
                      value={row.dietary}
                      onChange={(e) => updateRow(member.id, { dietary: e.target.value })}
                      className={`w-full border border-(--color-green) bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-orange) transition-colors`}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3 mt-5">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-5 pb-8 px-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting || !members}
          className="flex-1 w-full bg-(--color-pink) text-white text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-(--color-pink)"
        >
          {isSubmitting ? "Saving..." : "Send Our RSVPs"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C]/60 hover:text-(--color-pink) transition-colors cursor-pointer disabled:opacity-60 hover:underline underline-offset-4"
        >
          Back
        </button>
      </div>
    </dialog>
  );
}