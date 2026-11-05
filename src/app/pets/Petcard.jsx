"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";

/* Save as: src/components/PetCard.jsx
   Usage: <PetCard pet={pet} index={i} /> */

export default function PetCard({ pet, index = 0 }) {
  const reduce = useReducedMotion();
  const fee = Number(pet.adoptionFee) > 0 ? `৳${Number(pet.adoptionFee).toLocaleString()}` : "Free";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.45, ease: "easeOut" }}
      whileHover={reduce ? undefined : { y: -8 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_-18px_rgba(35,27,77,0.6)]"
    >
      {/* Image */}
      <div className="h-64 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pet.imageUrl || "/logo.jpg"}
          alt={`${pet.petName}, ${pet.breed || pet.species}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/logo.jpg";
          }}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#FFB320] px-3 py-1 text-xs font-bold text-[#231B4D]">
          {pet.species}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-[#231B4D] px-3 py-1 text-xs font-bold text-white">
          {fee}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-[#231B4D]">{pet.petName}</h3>

        <ul className="mt-2 space-y-1 text-sm text-[#231B4D]/75">
          <li>
            <span className="font-semibold text-[#231B4D]">Species:</span> {pet.species}
          </li>
          <li>
            <span className="font-semibold text-[#231B4D]">Age:</span> {pet.age}
          </li>
          <li>
            <span className="font-semibold text-[#231B4D]">Location:</span> {pet.location}
          </li>
          <li>
            <span className="font-semibold text-[#231B4D]">Price:</span> {fee}
          </li>
        </ul>

        {/* Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <Link
            href={`/pets/${pet._id}`}
            className={`${buttonVariants({ variant: "outline" })} justify-center rounded-full border-[#231B4D]/30 px-3 py-2.5 text-sm font-semibold text-[#231B4D]`}
          >
            View details
          </Link>
          <Link
            href={`/pets/${pet._id}/adopt`}
            className={`${buttonVariants({ variant: "primary" })} justify-center rounded-full bg-[#6C4CF1] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#5638D6]`}
          >
            Adopt now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}