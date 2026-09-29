"use client";
import { useRef, useState } from "react";

type Props = {
  venue: string;
  address: string;
  maps: string;
};

export default function MapDialog({ venue, address, maps }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const query = encodeURIComponent(`${venue}, ${address}`);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(maps);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); the "Open" link still works.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 font-lato text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
      >
        Check on Google Maps <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Map of ${venue}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[min(92vw,56rem)] max-w-none bg-cream p-0 text-left text-brown backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <div>
            <p className="font-serif text-xl">{venue}</p>
            <p className="font-lato text-xs text-brown/70">{address}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close map"
            className="px-2 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <iframe
          src={embedSrc}
          title={`Map of ${venue}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[60vh] w-full border-0"
        />
        <div className="flex items-center justify-end gap-6 px-5 py-3">
          <button
            type="button"
            onClick={copyLink}
            aria-live="polite"
            className="font-lato text-xs uppercase tracking-widest text-pink underline"
          >
            {copied ? "Link copied!" : "Copy link"}
          </button>
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="font-lato text-xs uppercase tracking-widest text-pink underline"
          >
            Open in Google Maps app
          </a>
        </div>
      </dialog>
    </>
  );
}
