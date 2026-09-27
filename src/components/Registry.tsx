import Image from 'next/image'

const registries = [
  {
    name: "GoTyme",
    url: "/images/payment/gotyme2.png"
  },
  {
    name: "BPI",
    url: "/images/payment/bpi2.png"
  },
];

export default function Registry() {
  return (
    <section id="registry" className="py-15 px-6 bg-(--color-yellow)/65">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-(--color-green) mb-4">
          A Gift for Us
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">Registry</h2>
        <div className="w-10 h-px bg-(--color-green) mx-auto mb-8" />
        <p className="font-sans text-base text-[#2C2C2C]/65 mb-14 leading-relaxed">
          Your presence is the best gift of all, and all that we ask! Our home is currently overseas and we are not able to carry physical gifts back with us.<br/>
          <br/>
          If you wish to bless us with a gift, a contribution toward building our life and home abroad would be warmly appreciated.

        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {registries.map((r, i) => (
            <div key={i}
              className="flex flex-col border border-[#E8D8CC] bg-[#FAF8F5] p-5 md:p-7 hover:bg-white transition-colors group"
            >
              <Image
                src={r.url}
                alt={r.name}
                width={272}
                height={338}
                loading='lazy'
                className="aspect-square w-full object-cover object-bottom"
              />
              <div className="text-center">
                <p className="font-serif text-xl font-light text-[#2C2C2C] group-hover:text-(--color-pink) transition-colors mb-1">
                  {r.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
