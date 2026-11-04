"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { authClient } from "@/lib/auth-client";

/* Save as: src/app/dashboard/page.jsx
   The numbers below are samples, replace them with real data from your database. */

const stats = [
  { label: "Saved pets", value: 0 },
  { label: "Adoption requests", value: 0 },
  { label: "Approved", value: 0 },
  { label: "Messages", value: 0 },
];

export default function DashboardHome() {
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(" ")[0] ?? "friend";

  return (
    <div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1
          className="text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Welcome back, {name}!
        </h1>
        <p className="mt-1 text-[#231B4D]/70">Here is what is happening with your adoption journey.</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
            className="rounded-3xl bg-white p-5 shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)]"
          >
            <p className="text-sm font-semibold text-[#231B4D]/65">{s.label}</p>
            <p className={`mt-2 text-4xl font-extrabold ${i % 2 === 0 ? "text-[#6C4CF1]" : "text-[#231B4D]"}`}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45 }}
        className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#231B4D] p-6 text-[#F1EDFF] sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Ready to meet someone new?</h2>
          <p className="text-[#F1EDFF]/75">Browse pets waiting for a home and send an adoption request.</p>
        </div>
        <Link
          href="/pets"
          className={`${buttonVariants({ variant: "primary" })} rounded-full bg-[#FFB320]! px-6 py-3 font-bold text-[#231B4D]!`}
        >
          Browse pets
        </Link>
      </motion.div>
    </div>
  );
}