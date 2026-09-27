import Hero, { HeroBackground } from "@/components/Hero";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import Entourage from "@/components/Entourage";
import Registry from "@/components/Registry";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";
import DressCode from "@/components/DressCode";

export default function Home() {
  return (
    <main>
      <div className="relative isolate">
        <HeroBackground />
        <div className="relative z-10">
          <Hero />
          <Gallery />
          <Entourage />
          <Events />
          <DressCode />
        </div>
      </div>
      <div className="relative z-10">
        <Registry />
        <RSVP />
        <Footer />
      </div>
    </main>
  );
}
