"use client";
import { useEffect, useState } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex gap-8 md:gap-12">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C]">
            {String(value).padStart(2, "0")}
          </div>
          <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#B8966E] mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
