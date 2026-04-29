import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import Travel from "@/components/Travel";
import Registry from "@/components/Registry";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurStory />
      <Events />
      <Gallery />
      <Travel />
      <Registry />
      <RSVP />
      <Footer />
    </main>
  );
}
