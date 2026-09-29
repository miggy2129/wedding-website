function getInstagramEmbedUrl(postUrl: string) {
  const url = new URL(postUrl);
  const [type, shortcode] = url.pathname.split("/").filter(Boolean);

  if ((type !== "p" && type !== "reel") || !shortcode) return postUrl;

  return `https://www.instagram.com/${type}/${shortcode}/embed/`;
}

export default function SocialPost({ postUrl }: { postUrl: string }) {
  return (
    <div
      className="my-4 flex shrink-0 justify-center"
      style={{ width: "min(328px, calc(100vw - 2rem))" }}
    >
      <iframe
        src={getInstagramEmbedUrl(postUrl)}
        title="Instagram post"
        width="100%"
        height={450}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="border-0"
      />
    </div>
  );
}