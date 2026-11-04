"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";

/* Put your images at public/pet-1.jpg ... pet-4.jpg.
   The pet details below are samples, replace them with real pets (or load them from your database). */

const pets = [
  { id: 1, img: "/pet-1.jpg", name: "Bruno", breed: "Labrador Mix", age: "2 years", gender: "Male" },
  { id: 2, img: "/pet-2.jpg", name: "Luna", breed: "Persian Cat", age: "1 year", gender: "Female" },
  { id: 3, img: "/pet-3.jpg", name: "Coco", breed: "Golden Retriever", age: "3 years", gender: "Female" },
  { id: 4, img: "/pet-4.jpg", name: "Milo", breed: "Tabby Cat", age: "8 months", gender: "Male" },
];

export default function FeaturedPets() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#F1EDFF] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">Meet our pets</p>
          <h2
            className="mt-2 text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Friends waiting for you
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pets.map((p, i) => (
            <motion.article
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={reduce ? undefined : { y: -8 }}
              className="group overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_-18px_rgba(35,27,77,0.6)]"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={p.img}
                  alt={`${p.name}, ${p.breed}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#FFB320] px-3 py-1 text-xs font-bold text-[#231B4D]">
                  {p.gender}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#231B4D]">{p.name}</h3>
                <p className="text-[#231B4D]/70">
                  {p.breed} · {p.age}
                </p>
                <Link
                  href={`/pets/${p.id}`}
                  className={`${buttonVariants({ variant: "primary" })} mt-4 w-full rounded-full bg-[#6C4CF1] font-semibold text-white hover:bg-[#5638D6]`}
                >
                  Adopt {p.name}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pets"
            className={`${buttonVariants({ variant: "outline" })} rounded-full border-[#231B4D]/30 px-6 py-3 font-semibold text-[#231B4D]`}
          >
            View all pets
          </Link>
        </div>
      </div>
    </section>
  );
}