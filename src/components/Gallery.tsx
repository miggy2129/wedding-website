export default function Gallery() {
  const placeholders = Array.from({ length: 6 });

  return (
    <section id="gallery" className="py-28 px-6 bg-[#F0E6DF]">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#B8966E] mb-4">
          Memories
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Gallery</h2>
        <div className="w-10 h-px bg-[#B8966E] mx-auto mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {placeholders.map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[#E8D8CC] flex items-center justify-center"
            >
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-[#B8966E]/50">
                Photo {i + 1}
              </p>
            </div>
          ))}
        </div>

        <p className="font-sans text-sm text-[#2C2C2C]/45 mt-8 italic">Photos coming soon</p>
      </div>
    </section>
  );
}
