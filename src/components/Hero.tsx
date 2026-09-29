import Countdown from "@/components/Countdown";
import Image from "next/image";
import SideBorderFlowers from "@/components/SideBorderFlowers";
import { ChevronDown } from "lucide-react";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none sticky top-0 z-0 h-screen -mb-[100vh]"
    >
      <div className="page-container flex h-full">
        <div className="wave-border wave-left"></div>
        <div className="content"></div>
        <div className="wave-border wave-right"></div>
        <SideBorderFlowers side="left" />
        <SideBorderFlowers side="right" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-lato text-[11px] tracking-[0.35em] uppercase text-(--color-pink) mb-5">
            We&apos;re getting married (again!)
          </p>

          <h1 className="font-serif text-7xl md:text-9xl font-light text-[#2C2C2C] leading-none">
            Miguel<br/>
            <span className="flex justify-end">
              <Image
                src='/images/design/and1.png'
                alt="and"
                width={120}
                height={143}
                loading='lazy'
                className="h-auto w-[80px] shrink-0 md:w-[120px]"
              />
              <span>Ina</span>
            </span>
          </h1>

          <p className="font-lato text-xs flex flex-col md:flex-row md:text-sm tracking-[0.25em] uppercase text-[#2C2C2C]/60 mb-14">
            <span>January 20, 2027 &nbsp;·&nbsp;</span> <span>Batangas, Philippines</span>
          </p>

          <Countdown targetDate="2027-01-20T15:00:00" />

          <a
            href="#rsvp"
            className="cursor-hover absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-center text-(--color-pink)"
          >
            <span className="cursor-hover mb-0">confirm attendance</span>
            <ChevronDown aria-hidden="true" size={35} strokeWidth={1} className="cursor-hover -mt-0 motion-safe:animate-bounce" />
            <ChevronDown aria-hidden="true" size={25} strokeWidth={1} className="cursor-hover -mt-5 motion-safe:animate-bounce" />
          </a>
    </section>
  );
}
