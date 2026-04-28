const hotels = [
  {
    name: "Hotel Name",
    category: "Luxury",
    distance: "0.5 km from venue",
    code: "MIGUELINA2026",
  },
  {
    name: "Hotel Name",
    category: "Mid-range",
    distance: "1.2 km from venue",
    code: "MIGUELINA2026",
  },
];

export default function Travel() {
  return (
    <section id="travel" className="py-28 px-6 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          Getting Here
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">
          Travel & Stay
        </h2>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-8" />
        <p className="font-sans text-base text-[#2C2C2C]/65 mb-16 max-w-xl mx-auto leading-relaxed">
          We have reserved room blocks at the following hotels. Mention our names or use the booking
          code when reserving.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {hotels.map((h, i) => (
            <div key={i} className="border border-[#E8D8CC] p-8 text-left">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#B8966E] mb-2">
                {h.category}
              </p>
              <h3 className="font-serif text-2xl font-light text-[#2C2C2C] mb-2">{h.name}</h3>
              <p className="font-sans text-sm text-[#2C2C2C]/55 mb-5">{h.distance}</p>
              <p className="font-sans text-xs text-[#2C2C2C]/50">
                Booking code:{" "}
                <span className="font-bold text-[#2C2C2C] tracking-wider">{h.code}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#F0E6DF] p-10 text-left">
          <h3 className="font-serif text-2xl font-light text-[#2C2C2C] mb-4">
            Getting to the Venue
          </h3>
          <p className="font-sans text-sm text-[#2C2C2C]/70 leading-relaxed">
            The venue is easily accessible by taxi or ride-share from most hotels in the area.
            Parking is available on-site. For airport transfers, we recommend booking in advance.
          </p>
        </div>
      </div>
    </section>
  );
}
