"use client";
import { useRef, useState } from "react";
import { postSubmit } from "@/_services/form";
import { RsvpStatus, FormState } from "@/_types/rsvp";

const inputClass =
  "w-full border border-[#E8D8CC] bg-white px-4 py-3 font-sans text-sm text-[#2C2C2C] focus:outline-none focus:border-[#B8966E] transition-colors";

const labelClass =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const firstName = form.name.trim().split(" ")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const results = await postSubmit(form);

      if (results.success) {
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
      <div className="max-w-lg mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          Join Us
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">RSVP</h2>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-8" />
        <p className="font-sans text-sm text-[#2C2C2C]/60 mb-14">
          Kindly respond by August 1, 2026.
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
            <p className="font-sans text-sm text-[#2C2C2C]/60">
              {form.status === RsvpStatus.declined
                ? "Thank you for letting us know — you'll be in our thoughts on the big day."
                : "We can't wait to celebrate with you on January 20, 2027."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {error && (
              <p className="font-sans text-sm text-[#9A3B3B] bg-[#FBEDED] border border-[#F0D3D3] px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={set("email")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                type="phone"
                required
                placeholder="+00 123 456 7890"
                value={form.phone}
                onChange={set("phone")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Will you attend?</label>
              <select value={form.status} onChange={set("status")} required className={inputClass}>
                <option value={RsvpStatus.accepted}>Joyfully accepts</option>
                <option value={RsvpStatus.declined}>Regretfully declines</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Dietary Restrictions</label>
              <textarea
                placeholder="None, vegetarian, gluten-free, etc."
                value={form.dietary}
                onChange={set("dietary")}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Any additional notes or questions?</label>
              <textarea
                placeholder="e.g., Song requests, travel questions, or just a sweet note for us!"
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B8966E] text-white font-sans text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#B8966E]"
            >
              {isSubmitting ? "Sending..." : "Send RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
