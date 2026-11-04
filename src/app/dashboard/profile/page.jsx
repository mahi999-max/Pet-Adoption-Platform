"use client";

import { authClient } from "@/lib/auth-client";

/* Save as: src/app/dashboard/profile/page.jsx */

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className="max-w-xl rounded-3xl bg-white p-6 shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)] sm:p-8">
      <h1
        className="text-2xl font-extrabold text-[#231B4D]"
        style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      >
        My profile
      </h1>

      <div className="mt-6 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image || "/logo.jpg"} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
        <div>
          <p className="text-lg font-bold text-[#231B4D]">{user.name}</p>
          <p className="text-[#231B4D]/70">{user.email}</p>
        </div>
      </div>
    </div>
  );
}