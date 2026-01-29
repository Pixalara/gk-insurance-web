'use client';

import { motion } from 'framer-motion';

const partners = [
    { name: "Bajaj Allianz", logo: "/logos/bajaj.png" },
    { name: "Tata AIG", logo: "/logos/tata.png" },
    { name: "ICICI Lombard", logo: "/logos/icici.png" },
    { name: "Digit", logo: "/logos/digit.png" },
    { name: "Liberty", logo: "/logos/liberty.png" },
    { name: "Star Health", logo: "/logos/star.png" },
];

export default function PartnerScroll() {
    return (
        <section className="py-16 bg-white overflow-hidden border-t border-slate-50">
            <div className="container-custom mb-10 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Our Trusted Partners
                </p>
            </div>
            
            {/* Masking Gradient for Fade Effect */}
            <div className="relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex animate-scroll whitespace-nowrap items-center gap-20 py-4">
                    {/* Render set twice for seamless loop */}
                    {[...partners, ...partners].map((partner, index) => (
                        <div key={index} className="flex-shrink-0">
                            <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}