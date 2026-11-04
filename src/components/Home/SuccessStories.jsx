"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/* Put your images at public/story-1.jpg, story-2.jpg, story-3.jpg.
   The names and quotes below are samples, replace them with real stories. */

const stories = [
  {
    img: "/story-1.jpg",
    pet: "Bruno",
    family: "Adopted by the Rahman family",
    quote: "Bruno was shy at first. Now he greets us at the door every single evening.",
  },
  {
    img: "/story-2.jpg",
    pet: "Luna",
    family: "Adopted by Nusrat",
    quote: "Luna turned my quiet flat into a home. I cannot imagine life without her.",
  },
  {
    img: "/story-3.jpg",
    pet: "Coco",
    family: "Adopted by the Hasan family",
    quote: "The kids learned so much about care and love since Coco joined us.",
  },
];

export default function SuccessStories() {
  const reduce = useReducedMotion();

  return (
    /* a slightly deeper lilac than the sections around it, from the same family */
    <section className="bg-[#E6DEFF] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">Success stories</p>
          <h2
            className="mt-2 text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Happy tails, happy homes
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stories.map((s, i) => (
            <motion.article
              key={s.pet}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              whileHover={reduce ? undefined : { y: -8 }}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_-18px_rgba(35,27,77,0.6)]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={s.img}
                  alt={`${s.pet} with their new family`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#231B4D]">{s.pet}</h3>
                <p className="text-sm font-semibold text-[#6C4CF1]">{s.family}</p>
                <p className="mt-3 leading-relaxed text-[#231B4D]/75">“{s.quote}”</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}