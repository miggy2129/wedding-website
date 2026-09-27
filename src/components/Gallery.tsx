import Image from 'next/image'

const IMAGES = [
  '/images/couple/couple1.jpg',
  '/images/couple/couple8.jpg',
  '/images/couple/couple2.jpg',
  '/images/couple/couple5.jpg',
  '/images/couple/couple6.jpg',
  '/images/couple/couple3.jpg',
]

export default function Gallery() {

  return (
    <section id="gallery" className="relative z-10 py-28 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-(--color-pink) mb-4">
          Memories
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Gallery</h2>
        <div className="w-10 h-px bg-(--color-pink) mx-auto mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {IMAGES.map((image, i) => (
            <Image
              key={i}
              src={image}
              alt={`Miguel and Ina - ${i + 1}`}
              width={600}
              height={600}
              loading='lazy'
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
