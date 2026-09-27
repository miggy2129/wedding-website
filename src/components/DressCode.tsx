"use client";
import SocialPost from '@/components/ui/instagram-embed'

const LADIES = [
    'https://www.instagram.com/reel/DYz28o8NnZK/',
    'https://www.instagram.com/p/DYCk3vXjEKx/',
    'https://www.instagram.com/p/DXuckgTjLku/',
    'https://www.instagram.com/reel/DXzg2v1xIgb/', 
    'https://www.instagram.com/p/DW7OxqciGrS/', 
    'https://www.instagram.com/reel/DWgFYdpCNXs/', 
    'https://www.instagram.com/reel/DXeJVjhgl48/', 
    'https://www.instagram.com/reel/DVeY607jQ4i/'
];

const MEN = [
    'https://www.instagram.com/p/DUNoA03kskF/',
    'https://www.instagram.com/p/DZdz4kmkm6s/',
    'https://www.instagram.com/p/DasFDT7yeCu/',
    'https://www.instagram.com/p/Dc9QdPSybLt/',
    'https://www.instagram.com/p/DVhhW08khQX/'
]

export default function DressCode() {
    return (
        <section id="dress-code" className="bg-(--color-red) text-white">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <h2 className="text-(--color-yellow)">Dress Code</h2>
                <div className="text-center mx-auto mt-2 mb-5">
                    <h3 className="text-xl text-(--color-yellow)">Color palette</h3>
                    <p className="text-sm">
                        Any bold and bright color will do.<br/>
                        Dress to celebrate in bold, beautiful colors, patterns, and textures!
                    </p>
                </div>

                {/* Ladies */}
                <div className="grid md:grid-cols-4 gap-3 pt-5 mb-5">
                    <div className="my-auto">
                        <h3 className="text-xl mb-2 text-(--color-yellow)">For the Ladies</h3>
                        <p className="text-xs text-pretty">
                            <b className="uppercase">Garden Formal</b><br/>
                            <i>Long or midi-length dresses, tailored jumpsuits or wide-leg trousers in vibrant colors and playful silhouettes would be beautiful.</i>
                        </p>
                    </div>
                    <div className="min-w-0 overflow-hidden md:col-span-3">
                        <div className="instagram-marquee">
                            <div className="instagram-marquee__track">
                                <div className="instagram-marquee__group">
                                    {LADIES.map((image, i) => (
                                        <SocialPost key={i} postUrl={image} />
                                    ))}
                                </div>
                                <div
                                    className="instagram-marquee__group"
                                    aria-hidden="true"
                                    inert
                                >
                                    {LADIES.map((image, i) => (
                                        <SocialPost key={i} postUrl={image} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Men */}
                <div className="grid md:grid-cols-4 gap-3 mt-0 mb-5 md:my-5">
                    <div className="min-w-0 overflow-hidden md:col-span-3 md:order-1 order-2">
                        <div className="instagram-marquee">
                            <div className="instagram-marquee__track">
                                <div className="instagram-marquee__group">
                                    {MEN.map((image, i) => (
                                        <SocialPost key={i} postUrl={image} />
                                    ))}
                                </div>
                                <div
                                    className="instagram-marquee__group"
                                    aria-hidden="true"
                                    inert
                                >
                                    {MEN.map((image, i) => (
                                        <SocialPost key={i} postUrl={image} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 text-left md:order-2 md:text-right my-auto">
                        <h3 className="text-xl mb-2 text-(--color-yellow)">For the Men</h3>
                        <p className="text-xs">
                            <b className="uppercase">Barong and Slacks</b>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}