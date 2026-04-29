const registries = [
  {
    name: "Registry Name",
    url: "#",
    note: "Home essentials and everything for our new chapter together.",
  },
  {
    name: "Honeymoon Fund",
    url: "#",
    note: "Contributions toward our honeymoon are deeply appreciated.",
  },
];

export default function Registry() {
  return (
    <section id="registry" className="py-28 px-6 bg-[#F0E6DF]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          A Gift for Us
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Registry</h2>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-8" />
        <p className="font-sans text-base text-[#2C2C2C]/65 mb-14 leading-relaxed">
          Your presence is the greatest gift. If you&apos;d like to give something, here are a few
          options.
        </p>

        <div className="space-y-4">
          {registries.map((r) => (
            <a
              key={r.name}
              href={r.url}
              className="flex items-center justify-between border border-[#E8D8CC] bg-[#FAF8F5] p-7 hover:bg-white transition-colors group"
            >
              <div className="text-left">
                <p className="font-serif text-xl font-light text-[#2C2C2C] group-hover:text-[#B8966E] transition-colors mb-1">
                  {r.name}
                </p>
                <p className="font-sans text-sm text-[#2C2C2C]/55">{r.note}</p>
              </div>
              <span className="font-sans text-[#B8966E] text-xl ml-6">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
