"use client";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  attending: string;
  guests: string;
  dietary: string;
};

const inputClass =
  "w-full border border-[#E8D8CC] bg-white px-4 py-3 font-sans text-sm text-[#2C2C2C] focus:outline-none focus:border-[#B8966E] transition-colors";

const labelClass =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] mb-2";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    attending: "yes",
    guests: "1",
    dietary: "",
  });

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to a form backend (e.g. Resend, Supabase, Formspree)
    setSubmitted(true);
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
            <p className="font-serif text-4xl font-light text-[#2C2C2C] mb-4">Thank you!</p>
            <p className="font-sans text-sm text-[#2C2C2C]/60">
              We can&apos;t wait to celebrate with you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
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
              <label className={labelClass}>Will you attend?</label>
              <select value={form.attending} onChange={set("attending")} className={inputClass}>
                <option value="yes">Joyfully accepts</option>
                <option value="no">Regretfully declines</option>
              </select>
            </div>

            {form.attending === "yes" && (
              <div>
                <label className={labelClass}>Number of Guests</label>
                <select value={form.guests} onChange={set("guests")} className={inputClass}>
                  {["1", "2", "3", "4"].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            <button
              type="submit"
              className="w-full bg-[#B8966E] text-white font-sans text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-[#2C2C2C] transition-colors cursor-pointer"
            >
              Send RSVP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
