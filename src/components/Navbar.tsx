"use client";
import { useState, useEffect } from "react";

const links = [
  { label: "Our Story", href: "#our-story" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Travel", href: "#travel" },
  { label: "Registry", href: "#registry" },
  { label: "RSVP", href: "#rsvp" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAF8F5]/95 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="font-serif text-xl tracking-widest text-[#2C2C2C]">
          M & I
        </a>

        <ul className="hidden md:flex gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] hover:text-[#B8966E] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)}>
          <span className="sr-only">Menu</span>
          <span
            className={`block w-6 h-px bg-[#2C2C2C] transition-transform origin-center ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span className={`block w-6 h-px bg-[#2C2C2C] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`block w-6 h-px bg-[#2C2C2C] transition-transform origin-center ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#FAF8F5] border-t border-[#E8D8CC] px-6 py-6">
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] hover:text-[#B8966E]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
