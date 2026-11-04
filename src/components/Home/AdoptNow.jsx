"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";

/* Same lilac as the Banner so the two sections look like one. */

export default function AdoptNow() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#F1EDFF] px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-20">
      <p className="mx-auto max-w-xl text-lg text-[#231B4D]/80">
        Ready to meet your new best friend?
      </p>

      <div className="relative mt-6 inline-flex">
        {/* soft pulse ring behind the button */}
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#FFB320]"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* continuous zoom in / zoom out */}
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/pets"
            className={`${buttonVariants({ variant: "primary" })} relative rounded-full bg-[#FFB320]! px-10 py-4 text-lg font-extrabold text-[#231B4D]! shadow-[0_10px_24px_-10px_rgba(35,27,77,0.6)]`}
          >
            Adopt Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}