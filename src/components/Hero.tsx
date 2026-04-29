import Countdown from "@/components/Countdown";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-center px-6"
    >
      <div className="w-px h-20 bg-[#B8966E] mx-auto mb-10" />

      <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-5">
        We&apos;re getting married
      </p>

      <h1 className="font-serif text-7xl md:text-9xl font-light text-[#2C2C2C] leading-none">
        Miguel
      </h1>
      <p className="font-serif text-3xl md:text-4xl font-light text-[#B8966E] italic my-3">&amp;</p>
      <h1 className="font-serif text-7xl md:text-9xl font-light text-[#2C2C2C] leading-none mb-8">
        Ina
      </h1>

      <p className="font-sans text-sm tracking-[0.25em] uppercase text-[#2C2C2C]/60 mb-14">
        January 20, 2027 &nbsp;·&nbsp; Batangas, Philippines
      </p>

      <Countdown targetDate="2027-01-20T15:00:00" />

      <div className="w-px h-20 bg-[#B8966E] mx-auto mt-14" />
    </section>
  );
}
