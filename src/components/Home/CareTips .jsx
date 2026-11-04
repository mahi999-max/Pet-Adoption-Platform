"use client";

import { motion, useReducedMotion } from "motion/react";

const tips = [
  { title: "Balanced food", text: "Feed age-appropriate food in set portions and keep fresh water available all day." },
  { title: "Daily exercise", text: "Walks and play keep pets fit, calm and happy. Dogs need more, cats love short bursts." },
  { title: "Regular vet visits", text: "Yearly check-ups, vaccines and parasite control prevent most serious problems." },
  { title: "Grooming", text: "Brush the coat, trim nails and clean ears regularly to avoid skin and ear trouble." },
  { title: "Training with kindness", text: "Reward good behaviour with treats and praise. Patience works better than punishment." },
  { title: "Love and attention", text: "Time together matters most. A pet left alone too long can become stressed or sad." },
];

export default function CareTips() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#F1EDFF] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">Pet care tips</p>
          <h2
            className="mt-2 text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Keep your new friend healthy and happy
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t, i) => (
            <motion.div
              key={t.title}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="rounded-3xl bg-white p-6 shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)]"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-extrabold ${
                  i % 2 === 0 ? "bg-[#FFB320] text-[#231B4D]" : "bg-[#6C4CF1] text-white"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-[#231B4D]">{t.title}</h3>
              <p className="mt-1 leading-relaxed text-[#231B4D]/70">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}