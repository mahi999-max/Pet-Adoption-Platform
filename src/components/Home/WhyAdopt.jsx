"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/* Put your image at public/why-adopt.jpg (any size works, it is cropped to fit). */

const reasons = [
  { title: "Save a life", text: "Every adoption frees up a shelter space for another animal in need." },
  { title: "Healthy and checked", text: "Our pets are vaccinated and health-checked before they come home." },
  { title: "Lower cost", text: "Adoption fees are a fraction of buying, and often include the basics." },
  { title: "A friend for life", text: "Rescued pets bond deeply and give back more love than you expect." },
];

export default function WhyAdopt() {
  const reduce = useReducedMotion();
  const rise = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  });

  return (
    <section className="bg-[#F1EDFF] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] bg-[#FFB320]" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white">
            <Image
              src="/why-adopt.jpg"
              alt="A happy adopted pet with its family"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Text */}
        <div>
          <motion.p {...rise(0)} className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">
            Why adopt pets
          </motion.p>
          <motion.h2
            {...rise(1)}
            className="mt-2 text-3xl font-extrabold leading-tight text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Adopt a pet and change two lives: theirs and yours.
          </motion.h2>

          <ul className="mt-8 space-y-4">
            {reasons.map((r, i) => (
              <motion.li
                key={r.title}
                {...rise(i + 2)}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_20px_-14px_rgba(35,27,77,0.5)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C4CF1] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-[#231B4D]">{r.title}</h3>
                  <p className="text-[#231B4D]/70">{r.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}