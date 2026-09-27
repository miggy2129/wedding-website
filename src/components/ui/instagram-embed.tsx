"use client";

import { InstagramEmbed } from "react-social-media-embed";

export default function SocialPost({ postUrl }: { postUrl: string }) {
  return (
    <div
      className="my-4 flex shrink-0 justify-center"
      style={{ width: "min(328px, calc(100vw - 2rem))" }}
    >
      <InstagramEmbed url={postUrl} width="100%" height={450} />
    </div>
  );
}