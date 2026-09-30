"use client";
import { useRef, useState } from "react";
import { Check, Copy, ExternalLink, X } from "lucide-react";

type Props = {
  venue: string;
  address: string;
  maps: string;
};

const iconButtonClass =
  "flex size-9 items-center justify-center rounded-full text-brown/70 transition-colors hover:bg-brown/10 hover:text-pink";

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
      // Clipboard unavailable (e.g. insecure context); the open-in-new-tab button still works.
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
        <div className="flex items-start justify-between gap-4 px-5 py-3">
          <div>
            <p className="font-serif text-xl">{venue}</p>
            <p className="font-lato text-xs text-brown/70">{address}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy Google Maps link"
              title={copied ? "Copied!" : "Copy link"}
              className={iconButtonClass}
            >
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            </button>
            <span role="status" className="sr-only">
              {copied ? "Link copied" : ""}
            </span>
            <button
              type="button"
              onClick={() => window.open(maps, "_blank", "noopener,noreferrer")}
              aria-label="Open in Google Maps (new tab)"
              title="Open in new tab"
              className={iconButtonClass}
            >
              <ExternalLink size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close map"
              title="Close"
              className={iconButtonClass}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <iframe
          src={embedSrc}
          title={`Map of ${venue}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[60vh] w-full border-0"
        />
      </dialog>
    </>
  );
}
