"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TOP_FLOWERS = [
  "/images/design/top/flower-pink-5.png",
  "/images/design/top/flower-yellow-1.png",
];

const TOP_RIGHT_FLOWERS = [
  "/images/design/top/leaves.png",
  "/images/design/top/flower-pink-5.png",
  "/images/design/top/leaves.png"
];


const FLOWERS_BOTTOM = [
  "/images/design/bottom/flower-orange-2.png",
  "/images/design/bottom/flower-yellow-2.png",
  "/images/design/bottom/flower-orange-2.png",
  "/images/design/bottom/flower-pink-4.png",
  "/images/design/bottom/flower-orange-2.png"
]

const SECTION_IDS = [
  "home",
  "gallery",
  "locations",
  "schedule",
  "dress-code",
  "entourage",
  "registry",
  "rsvp",
];

export default function SideBorderFlowers({
  side,
}: {
  side: "left" | "right";
}) {
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateFlower = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const marker = window.innerHeight * 0.45;
        let visibleSectionIndex = 0;

        SECTION_IDS.forEach((id, index) => {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= marker) {
            visibleSectionIndex = index;
          }
        });

        setSectionIndex((currentIndex) =>
          currentIndex === visibleSectionIndex
            ? currentIndex
            : visibleSectionIndex,
        );
      });
    };

    window.addEventListener("scroll", updateFlower, { passive: true });
    window.addEventListener("resize", updateFlower);
    updateFlower();

    return () => {
      window.removeEventListener("scroll", updateFlower);
      window.removeEventListener("resize", updateFlower);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const sideOffset = side === "right" ? 1 : 0;
  const topFlowerSet = side === "right" ? TOP_RIGHT_FLOWERS : TOP_FLOWERS;
  const topFlower =
    topFlowerSet[(sectionIndex + sideOffset) % topFlowerSet.length];
  const bottomFlower =
    FLOWERS_BOTTOM[(sectionIndex + sideOffset) % FLOWERS_BOTTOM.length];

  return (
    <div
      aria-hidden="true"
      className={`side-border-flowers side-border-flowers--${side}`}
    >
      <Image
        key={topFlower}
        src={topFlower}
        alt=""
        width={160}
        height={160}
        loading="eager"
        className="side-border-flower side-border-flower--top"
      />
      <Image
        key={bottomFlower}
        src={bottomFlower}
        alt=""
        width={160}
        height={160}
        loading="eager"
        className="side-border-flower side-border-flower--bottom"
      />
    </div>
  );
}