import Image from 'next/image'

const LOCATIONS = [
  {
    title: "The Ceremony",
    time: "3:00 PM",
    venue: "Caleruega Chapel of Transfiguration",
    address: "Nasugbu, Batangas",
    note: "Guests are kindly asked to be seated by 2:45 PM.",
    image: '/images/locations/caleruega_church.webp',
    maps: 'https://maps.app.goo.gl/8445pkFakrAZDwhR9'
  },
  {
    title: "The Reception",
    time: "5:30 PM",
    venue: "Asador Alfonso",
    address: "Alfonso, Cavite",
    note: "Dinner, dancing, and celebrating until midnight.",
    image: '/images/locations/asador_alfonso.jpg',
    maps: 'https://maps.app.goo.gl/JauJCdYDPY6vjQF48'
  }
];

const EVENTS = [
  {
    title: "The Ceremony",
    time: "3:00 PM",
    venue: "Caleruega Chapel of Transfiguration",
    address: "Nasugbu, Batangas",
    note: "Guests are kindly asked to be seated by 2:45 PM."
  },
  {
    title: "Cocktails",
    time: "5:00 PM",
    venue: "Asador Alfonso",
    address: "Alfonso, Cavite"
  },
  {
    title: "The Reception & Dinner",
    time: "6:30 PM",
    venue: "Asador Alfonso",
    address: "Alfonso, Cavite"
  },
  {
    title: "After-Party",
    time: "9:00 PM",
    venue: "Asador Alfonso",
    address: "Alfonso, Cavite",
    note: "Dinner, dancing, and celebrating until midnight."
  }
];

export default function Events() {
  return (
    <>
      <section id="locations" className="grid grid-cols-1 md:grid-cols-2">
        {LOCATIONS.map((location) => (
          <div
            key={location.title}
            className="relative isolate flex min-h-[28rem] items-center justify-center overflow-hidden bg-cover bg-top px-6 py-16 text-center text-white md:min-h-[25rem]"
            style={{ backgroundImage: `url("${location.image}")` }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-black/65" />
            <div className="relative z-10 max-w-xl">
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-white/80">
                {location.venue}
              </p>
              <h2 className="font-serif text-5xl font-light md:text-6xl">
                {location.title}
              </h2>
              <p className="mt-4 font-sans text-sm text-white/85">
                {location.address}
              </p>
              <p className="mx-auto mt-6 max-w-sm font-sans text-xs leading-relaxed tracking-wide text-white/90">
                {location.note}
              </p>
              <a
                href={location.maps}
                target="_blank"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 font-sans text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
              >
                Check on Google Maps <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
        
      </section>
      <section id="schedule" className="py-28 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-(--color-pink) mb-4">
            Mark Your Calendar
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-3">
            The Itinerary
          </h2>
          <p className="font-sans text-sm tracking-[0.15em] text-[#2C2C2C]/50 mb-6">
            January 20, 2027
          </p>
          <div className="w-10 h-px bg-(--color-pink) mx-auto mb-16" />


          <div className="grid items-start gap-10 text-left md:grid-cols-[minmax(0,350px)_minmax(0,1fr)]">
            <Image
              src='/images/couple/couple10.jpeg'
              alt="Miguel and Ina"
              width={350}
              height={500}
              loading='lazy'
              className="w-full object-cover"
            />

            <ol className="flex flex-col gap-8">
              {EVENTS.map((event) => (
                <li key={event.title} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4">
                  <time className="pt-1 font-serif text-base text-(--color-red)">
                    {event.time}
                  </time>
                  <div>
                    <h3 className="mb-2 font-serif text-2xl font-light text-(--color-red)">
                      {event.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-[#2C2C2C]/70">
                      {event.venue}, {event.address}<br/>
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-[#2C2C2C]/70">
                      <i>{event.note ? `${event.note}` : ""}</i>
                    </p>
                  </div>
                  <div className="w-full md:w-100 h-px bg-(--color-pink) mx-auto mt-3" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
