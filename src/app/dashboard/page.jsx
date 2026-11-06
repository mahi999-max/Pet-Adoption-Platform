"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { myListings, myRequests } from "@/lib/getUser"; // your lib file

/* Save as: src/app/dashboard/page.jsx
   Numbers come from your database:
   - My pets          -> myListings(email)
   - Requests sent    -> myRequests(email) (all of them)
   - Approved / Canceled -> counted from the status of those requests */

// understand the different spellings the status might have
function normalizeStatus(raw) {
  const v = String(raw ?? "pending").toLowerCase();
  if (v === "approved" || v === "accepted") return "approved";
  if (v === "canceled" || v === "cancelled" || v === "rejected") return "canceled";
  return "pending";
}

export default function DashboardHome() {
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const name = session?.user?.name?.split(" ")[0] ?? "friend";

  const [counts, setCounts] = useState({ pets: 0, requests: 0, approved: 0, canceled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    let active = true;

    Promise.all([myListings(email), myRequests(email)])
      .then(([pets, requests]) => {
        if (!active) return;
        const petList = Array.isArray(pets) ? pets : [];
        const reqList = Array.isArray(requests) ? requests : [];
        const statuses = reqList.map((r) => normalizeStatus(r.status));

        setCounts({
          pets: petList.length,
          requests: reqList.length,
          approved: statuses.filter((s) => s === "approved").length,
          canceled: statuses.filter((s) => s === "canceled").length,
        });
      })
      .catch(() => toast.error("Could not load your dashboard numbers."))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [email]);

  const stats = [
    { label: "My pets", value: counts.pets, href: "/dashboard/my-listings", color: "text-[#6C4CF1]" },
    { label: "Requests sent", value: counts.requests, href: "/dashboard/my-requests", color: "text-[#231B4D]" },
    { label: "Approved", value: counts.approved, href: "/dashboard/my-requests", color: "text-green-700" },
    { label: "Canceled", value: counts.canceled, href: "/dashboard/my-requests", color: "text-red-600" },
  ];

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
            whileHover={reduce ? undefined : { y: -4 }}
          >
            <Link
              href={s.href}
              className="block rounded-3xl bg-white p-5 shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-[#6C4CF1]"
            >
              <p className="text-sm font-semibold text-[#231B4D]/65">{s.label}</p>
              <p className={`mt-2 text-4xl font-extrabold ${s.color}`}>{loading ? "-" : s.value}</p>
            </Link>
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