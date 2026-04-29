const milestones = [
  {
    label: "How We Met",
    text: "Tell your story here — where you first crossed paths and what made that moment special.",
  },
  {
    label: "The Proposal",
    text: "Share how the proposal happened — the setting, the words, the moment that changed everything.",
  },
  {
    label: "What's Next",
    text: "Looking forward to spending forever together with everyone we love by our side.",
  },
];

export default function OurStory() {
  return (
    <section id="our-story" className="py-28 px-6 bg-[#F0E6DF]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          Chapter One
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Our Story</h2>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-14" />

        <div className="space-y-10 text-left">
          {milestones.map(({ label, text }) => (
            <div key={label} className="flex gap-6">
              <div className="w-px bg-[#B8966E] shrink-0" />
              <div>
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#B8966E] mb-2">
                  {label}
                </p>
                <p className="font-sans text-base text-[#2C2C2C]/80 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
