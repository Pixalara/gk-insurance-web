"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden">

      {/* Background Element */}
      <div className="absolute right-[-5%] bottom-[10%] text-[40vw] font-black text-slate-50 -z-10 select-none hidden md:block">
        GK
      </div>

      {/* Header */}
      <header className="px-[6%] py-10">
        <div className="text-[1.8rem] md:text-[1.8rem] font-black uppercase tracking-tight text-[#004aad]">
          GK Insurance Solutions
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center px-[6%] py-5 md:py-10">
        <motion.h1
          className="uppercase font-black leading-[0.85] tracking-[-0.04em] text-[14vw] md:text-[12vw] mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Launching <br />
          <span className="block text-[#004aad]">Very Soon.</span>
        </motion.h1>

        {/* Content */}
        <motion.div
          className="max-w-[1200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >

          <p className="text-slate-500 text-base md:text-xl font-medium max-w-[600px] mb-8 leading-relaxed">
            We are crafting a premium digital experience to help you secure your assets.
            Reliable general insurance solutions are just around the corner.
          </p>

          {/* Products */}
          <div className="flex flex-wrap gap-3 md:gap-4">

            {[
              { label: 'Motor', iconClass: 'fa-solid fa-car' },
              { label: 'Health', iconClass: 'fa-solid fa-heart-pulse' },
              { label: 'Home', iconClass: 'fa-solid fa-house-chimney' },
              { label: 'Travel', iconClass: 'fa-solid fa-plane-departure' },
              { label: 'Business', iconClass: 'fa-solid fa-briefcase' },
            ].map((item) => (
              <div
                key={item.label}
                className="
                  group  flex items-center gap-3 px-7 py-3 rounded-full bg-slate-100 text-slate-700
                  font-bold text-sm uppercase tracking-wide
                  transition-all duration-300
                  border border-transparent
                  cursor-default
                  hover:bg-[#004aad]
                  hover:text-white
                  hover:-translate-y-[5px]
                  hover:shadow-xl hover:shadow-[rgba(0,74,173,0.2)]
                "
              >
                <i className={`${item.iconClass} text-[#004aad] text-[1.1rem] transition-colors duration-300 group-hover:text-white`}></i>
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-[6%] py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-5 text-xs text-slate-400">
        <div>
          <p>© 2026 GK Insurance Solutions. All rights reserved.</p>
          <p>Insurance is the subject matter of solicitation.</p>
        </div>

        <div className="font-semibold">
          Powered by{' '}
          <a
            href="https://pixalara.com"
            target="_blank"
            className="text-[#004aad] hover:underline"
          >
            pixalara.com
          </a>
        </div>
      </footer>
    </main>
  )
}

