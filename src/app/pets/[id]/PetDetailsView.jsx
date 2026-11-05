"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";

/* Save as: src/components/PetDetailsView.jsx */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F1EDFF] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#6C4CF1]">{label}</p>
      <p className="mt-1 font-semibold text-[#231B4D]">{value || "Not provided"}</p>
    </div>
  );
}

export default function PetDetailsView({ pet, id }) {
  const reduce = useReducedMotion();
  const fee = Number(pet.adoptionFee) > 0 ? `৳${Number(pet.adoptionFee).toLocaleString()}` : "Free";

  const rise = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + i * 0.08, duration: 0.45, ease: "easeOut" },
  });

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-[#F1EDFF] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div {...rise(0)}>
          <Link href="/pets" className="inline-flex items-center gap-1 font-semibold text-[#6C4CF1] hover:underline">
            ← Back to all pets
          </Link>
        </motion.div>

        <div className="mt-6 grid items-start gap-10 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] bg-[#FFB320]" aria-hidden="true" />
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pet.imageUrl || "/logo.jpg"}
                alt={`${pet.petName}, ${pet.breed || pet.species}`}
                className="h-full w-full object-contain"
              />
            </div>
          </motion.div>

          {/* Details */}
          <div>
            <motion.div {...rise(1)} className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFB320] px-3 py-1 text-sm font-bold text-[#231B4D]">{pet.species}</span>
              <span className="rounded-full bg-[#231B4D] px-3 py-1 text-sm font-bold text-white">{fee}</span>
            </motion.div>

            <motion.h1
              {...rise(2)}
              className="mt-3 text-4xl font-extrabold text-[#231B4D] sm:text-5xl"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              {pet.petName}
            </motion.h1>
            <motion.p {...rise(3)} className="mt-1 text-lg text-[#231B4D]/70">
              {pet.breed} · {pet.gender}
            </motion.p>

            <motion.p {...rise(4)} className="mt-5 leading-relaxed text-[#231B4D]/80">
              {pet.description}
            </motion.p>

            <motion.div {...rise(5)} className="mt-6 grid grid-cols-2 gap-3">
              <InfoItem label="Age" value={pet.age} />
              <InfoItem label="Gender" value={pet.gender} />
              <InfoItem label="Health status" value={pet.healthStatus} />
              <InfoItem label="Vaccination" value={pet.vaccinationStatus} />
              <InfoItem label="Location" value={pet.location} />
              <InfoItem label="Adoption fee" value={fee} />
            </motion.div>

            {pet.ownerEmail && (
              <motion.p {...rise(6)} className="mt-4 text-sm text-[#231B4D]/70">
                Listed by{" "}
                <a href={`mailto:${pet.ownerEmail}`} className="font-semibold text-[#6C4CF1] hover:underline">
                  {pet.ownerEmail}
                </a>
              </motion.p>
            )}

            <motion.div {...rise(7)} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/pets/${id}/adopt`}
                className={`${buttonVariants({ variant: "primary" })} rounded-full bg-[#6C4CF1] px-8 py-3 text-lg font-bold text-white hover:bg-[#5638D6]`}
              >
                Adopt now
              </Link>
              <Link
                href="/pets"
                className={`${buttonVariants({ variant: "outline" })} rounded-full border-[#231B4D]/30 px-6 py-3 font-semibold text-[#231B4D]`}
              >
                See more pets
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}