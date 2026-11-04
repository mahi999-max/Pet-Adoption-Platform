"use client";

import { motion, useReducedMotion } from "motion/react";

const steps = [
  { title: "Browse pets", text: "Explore dogs and cats and find the one that fits your life." },
  { title: "Create an account", text: "Register for free so you can save favourites and send requests." },
  { title: "Meet and talk", text: "Our team connects you with the pet and answers all your questions." },
  { title: "Take them home", text: "Complete the adoption and welcome your new family member." },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#F1EDFF] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">How it works</p>
          <h2
            className="mt-2 text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Adopting is easy in four steps
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line that draws itself (desktop only) */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ originX: 0 }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-1 rounded-full bg-[#6C4CF1]/30 lg:block"
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              className="relative text-center"
            >
              <span
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold shadow-[0_10px_20px_-10px_rgba(35,27,77,0.6)] ${
                  i % 2 === 0 ? "bg-[#6C4CF1] text-white" : "bg-[#FFB320] text-[#231B4D]"
                }`}
              >
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#231B4D]">{s.title}</h3>
              <p className="mx-auto mt-1 max-w-xs leading-relaxed text-[#231B4D]/70">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}