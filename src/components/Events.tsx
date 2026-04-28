const events = [
  {
    title: "Ceremony",
    time: "4:00 PM",
    venue: "Venue Name",
    address: "123 Wedding Lane, Manila, Philippines",
    note: "Guests are kindly asked to be seated by 3:45 PM.",
  },
  {
    title: "Reception",
    time: "6:00 PM",
    venue: "Venue Name",
    address: "123 Wedding Lane, Manila, Philippines",
    note: "Dinner, dancing, and celebrating until midnight.",
  },
];

export default function Events() {
  return (
    <section id="events" className="py-28 px-6 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          Mark Your Calendar
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-3">Events</h2>
        <p className="font-sans text-sm tracking-[0.15em] text-[#2C2C2C]/50 mb-6">
          September 20, 2026
        </p>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-16" />

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((e) => (
            <div key={e.title} className="border border-[#E8D8CC] p-10 text-left">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#B8966E] mb-4">
                {e.time}
              </p>
              <h3 className="font-serif text-3xl font-light text-[#2C2C2C] mb-4">{e.title}</h3>
              <div className="w-8 h-px bg-[#B8966E] mb-6" />
              <p className="font-sans text-sm font-bold text-[#2C2C2C] mb-1">{e.venue}</p>
              <p className="font-sans text-sm text-[#2C2C2C]/55 mb-5">{e.address}</p>
              <p className="font-sans text-sm text-[#2C2C2C]/65 italic">{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
