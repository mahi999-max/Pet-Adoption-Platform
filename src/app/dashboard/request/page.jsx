"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
// import { myAdoptRequests } from "@/lib/getUser";
import { myRequests } from "@/lib/getUser"; // your lib file

/* Save as: src/app/dashboard/my-requests/page.jsx */

const statusStyles = {
  pending: { label: "Pending", cls: "bg-[#FFB320] text-[#231B4D]" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-800" },
  canceled: { label: "Canceled", cls: "bg-red-100 text-red-700" },
};
// accept other spellings your backend might use
const alias = { cancelled: "canceled", rejected: "canceled", cancel: "canceled", accept: "approved" };

function getStatus(raw) {
  const key = String(raw ?? "pending").toLowerCase();
  return statusStyles[alias[key] ?? key] ?? { label: raw, cls: "bg-[#F1EDFF] text-[#231B4D]" };
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";

const cols = "md:grid-cols-[2.2fr_1fr_1.8fr_1fr_1fr]";

export default function MyRequestsPage() {
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    let active = true;
    myRequests(email)
      .then((data) => active && setRequests(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Could not load your requests."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [email]);

  const count = (s) => requests.filter((r) => getStatus(r.status).label.toLowerCase() === s).length;

  return (
    <div>
      <h1
        className="text-3xl font-extrabold text-[#231B4D]"
        style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      >
        My requests
      </h1>
      <p className="mt-1 text-[#231B4D]/70">
        {loading
          ? "Loading..."
          : `${requests.length} total · ${count("pending")} pending · ${count("approved")} approved · ${count("canceled")} canceled`}
      </p>

      {!loading && requests.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)]">
          <p className="text-lg font-semibold text-[#231B4D]">You have not sent any adoption requests yet.</p>
          <Link
            href="/pets"
            className={`${buttonVariants({ variant: "primary" })} mt-4 rounded-full bg-[#6C4CF1] px-6 py-2.5 font-semibold text-white hover:bg-[#5638D6]`}
          >
            Browse pets
          </Link>
        </div>
      )}

      {requests.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_-20px_rgba(35,27,77,0.6)]">
          {/* header row (desktop only) */}
          <div
            className={`hidden gap-4 bg-[#231B4D] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#F1EDFF] md:grid ${cols}`}
          >
            <span>Pet</span>
            <span>Species</span>
            <span>Owner</span>
            <span>Requested on</span>
            <span>Status</span>
          </div>

          {requests.map((r, i) => {
            const st = getStatus(r.status);
            return (
              <motion.div
                key={r._id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.05, duration: 0.35 }}
                className={`grid items-center gap-3 border-t border-[#231B4D]/10 px-5 py-4 first:border-t-0 md:gap-4 ${cols}`}
              >
                {/* Pet */}
                <Link href={`/pets/${r.petId}`} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.petImage || "/logo.jpg"}
                    alt={r.petName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/logo.jpg";
                    }}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                  />
                  <span className="font-bold text-[#231B4D] hover:text-[#6C4CF1]">{r.petName}</span>
                </Link>

                <p className="text-[#231B4D]/80">
                  <span className="mr-1 text-xs font-bold uppercase text-[#6C4CF1] md:hidden">Species:</span>
                  {r.petSpecies}
                </p>

                <p className="break-all text-sm text-[#231B4D]/80">
                  <span className="mr-1 text-xs font-bold uppercase text-[#6C4CF1] md:hidden">Owner:</span>
                  {r.ownerEmail}
                </p>

                <p className="text-sm text-[#231B4D]/80">
                  <span className="mr-1 text-xs font-bold uppercase text-[#6C4CF1] md:hidden">Date:</span>
                  {formatDate(r.requestDate)}
                </p>

                <div>
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${st.cls}`}>{st.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}