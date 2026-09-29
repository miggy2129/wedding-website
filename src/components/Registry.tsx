import Image from 'next/image'

const registries = [
  {
    name: "GoTyme",
    url: "/images/payment/gotyme2.png",
    width: 280,
    height: 280,
  },
  {
    name: "BPI",
    url: "/images/payment/bpi2.png",
    width: 280,
    height: 280,
  },
];

export default function Registry() {
  return (
    <section id="registry" className="py-15 px-6 bg-(--color-yellow)/65">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-6">
          Gifts
        </h2>
        <div className="w-10 h-px bg-(--color-green) mx-auto mb-8" />
        <p className="font-lato text-base text-[#2C2C2C]/65 mb-14 leading-relaxed">
          Your presence is the best gift of all, and all that we ask! Our home is currently overseas and we are not able to carry physical gifts back with us.<br/>
          <br/>
          If you wish to bless us with a gift, a contribution toward building our life and home abroad would be warmly appreciated.

        </p>

        <div className="grid md:grid-cols-4 gap-4 justify-center">
          <div></div>
          {registries.map((r, i) => (
            <div key={i}
              className="flex flex-col border border-[#E8D8CC] bg-[#FAF8F5] p-5 md:p-3 hover:bg-white transition-colors group"
            >
              <Image
                src={r.url}
                alt={r.name}
                width={r.width}
                height={r.height}
                loading='lazy'
                className="h-auto w-full"
              />
              <div className="text-center">
                <p className="font-serif text-xl font-light text-[#2C2C2C] group-hover:text-(--color-pink) transition-colors mb-1">
                  {r.name}
                </p>
              </div>
            </div>
          ))}
          <div></div>

        </div>
      </div>
    </section>
  );
}
