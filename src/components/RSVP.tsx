"use client";
import { useRef, useState } from "react";
import { postSubmit } from "@/_services/form";
import { RsvpStatus, FormState, rsvpStatusLabels } from "@/_types/rsvp";
import GroupRsvpDialog from "@/components/GroupRsvpDialog";
import Image from "next/image";

type FieldErrors = { name?: string; email?: string; contact?: boolean };

const errorsClearedBy = {
  name: ["name"],
  email: ["email", "contact"],
  phone: ["contact"],
} as const;

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [group, setGroup] = useState<{ token: string; count: number } | null>(null);
  const [groupUpdated, setGroupUpdated] = useState(0);
  const isSubmittingRef = useRef(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    status: RsvpStatus.accepted,
    notes: "",
    dietary: ""
  });

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));

    const cleared = errorsClearedBy[key as keyof typeof errorsClearedBy];
    if (cleared) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        cleared.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    } else if (!email && !phone) {
      errors.contact = true;
    }

    return errors;
  };

  const firstName = form.name.trim().split(" ")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(null);
      const first = errors.name ? "rsvp-name" : errors.email ? "rsvp-email" : "rsvp-phone";
      document.getElementById(first)?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const results = await postSubmit(form);

      if (results.success && results.group) {
        setGroup(results.group);
      } else if (results.success) {
        setSubmitted(true);
      } else {
        setError(results.message);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-28 px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto text-center">
        <div className="grid md:grid-cols-11 gap-5">
          <div className="md:col-span-5 text-left">
            <p className="font-lato text-[11px] tracking-[0.35em] uppercase text-(--color-pink) mb-4">
              RSVP
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Tell us if you&apos;ll be there.</h2>
            <p className="font-lato text-sm text-[#2C2C2C]/60 mb-5">
              While we wish we can accommodate everyone, we kindly ask that only the guests listed on the invitation attend.<br/>
              <br/>
              Please confirm your attendance by <b>October 30, 2026</b>. 
            </p>

            {submitted ? (
              <div className="py-20">
                <p className="font-serif text-4xl font-light text-[#2C2C2C] mb-4">
                  {form.status === RsvpStatus.declined
                    ? "We'll miss you!"
                    : firstName
                    ? `Thank you, ${firstName}!`
                    : "Thank you!"}
                </p>
                <p className="font-lato text-sm text-[#2C2C2C]/60">
                  {form.status === RsvpStatus.declined
                    ? "Thank you for letting us know — you'll be in our thoughts on the big day."
                    : "We can't wait to celebrate with you on January 20, 2027."}
                </p>
                {groupUpdated > 0 && (
                  <p className="font-lato text-sm text-[#2C2C2C]/60 mt-3">
                    We&apos;ve also recorded {groupUpdated} other{" "}
                    {groupUpdated === 1 ? "response" : "responses"} for your party.
                  </p>
                )}
              </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
                  <div>
                    <label htmlFor="rsvp-name" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>Full Name</label>
                    <input
                      id="rsvp-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set("name")}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "rsvp-name-error" : undefined}
                      className={fieldErrors.name ? `w-full border border-[#C97B7B] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-[#9A3B3B] transition-colors` : `w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors`}
                    />
                    {fieldErrors.name && (
                      <p id="rsvp-name-error" className={`font-lato text-xs text-[#9A3B3B] mt-2`}>{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rsvp-email" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>Email</label>
                    <input
                      id="rsvp-email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={set("email")}
                      aria-invalid={!!(fieldErrors.email || fieldErrors.contact)}
                      aria-describedby={fieldErrors.email ? "rsvp-email-error" : "rsvp-contact-hint"}
                      className={fieldErrors.email || fieldErrors.contact ? `w-full border border-[#C97B7B] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-[#9A3B3B] transition-colors` : `w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors`}
                    />
                    {fieldErrors.email && (
                      <p id="rsvp-email-error" className={`font-lato text-xs text-[#9A3B3B] mt-2`}>{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rsvp-phone" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>Contact Number</label>
                    <input
                      id="rsvp-phone"
                      type="tel"
                      placeholder="+00 123 456 7890"
                      value={form.phone}
                      onChange={set("phone")}
                      aria-invalid={!!fieldErrors.contact}
                      aria-describedby="rsvp-contact-hint"
                      className={fieldErrors.contact ? `w-full border border-[#C97B7B] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-[#9A3B3B] transition-colors` : `w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors`}
                    />
                    <p
                      id="rsvp-contact-hint"
                      className={fieldErrors.contact ? `font-lato text-xs text-[#9A3B3B] mt-2` : `font-lato text-xs text-[#2C2C2C]/50 mt-2`}
                    >
                      Please provide at least an email or a contact number.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="rsvp-status" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>Will you attend?</label>
                    <select id="rsvp-status" value={form.status} onChange={set("status")} className={`w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors`}>
                      <option value={RsvpStatus.accepted}>{rsvpStatusLabels[RsvpStatus.accepted]}</option>
                      <option value={RsvpStatus.declined}>{rsvpStatusLabels[RsvpStatus.declined]}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rsvp-dietary" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>
                      Dietary Restrictions{" "}
                      <span className="normal-case tracking-normal text-[#2C2C2C]/50">(optional)</span>
                    </label>
                    <textarea
                      id="rsvp-dietary"
                      placeholder="None, vegetarian, gluten-free, etc."
                      value={form.dietary}
                      onChange={set("dietary")}
                      rows={3}
                      className="w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="rsvp-notes" className={`block font-lato text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2`}>
                      Any additional notes or questions?{" "}
                      <span className="normal-case tracking-normal text-[#2C2C2C]/50">(optional)</span>
                    </label>
                    <textarea
                      id="rsvp-notes"
                      placeholder="e.g., Song requests, travel questions, or just a sweet note for us!"
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      className="w-full border border-[#E8D8CC] bg-white px-4 py-3 font-lato text-sm text-[#2C2C2C] focus:outline-none focus:border-(--color-pink) transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="font-lato text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-(--color-pink) text-white font-lato text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#B8966E]"
                  >
                    {isSubmitting ? "Sending..." : "Send RSVP"}
                  </button>
                </form>
            )}
          </div>
          <div className="md:sticky md:top-24 md:col-span-6 md:self-start">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/couple/couple4.jpg"
                alt="Miguel and Ina"
                fill
                loading='lazy'
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {group && (
        <GroupRsvpDialog
          form={form}
          group={group}
          onBack={() => setGroup(null)}
          onDone={(updatedOthers) => {
            setGroupUpdated(updatedOthers);
            setGroup(null);
            setSubmitted(true);
          }}
        />
      )}
    </section>
  );
}
