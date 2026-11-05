"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars, Bell, CirclePlus, CodePullRequest, Envelope, Gear, House, Magnifier, Person, SquareListUl } from "@gravity-ui/icons";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { authClient } from "@/lib/auth-client";

/* Save as: src/app/dashboard/layout.jsx
   Needs:  npm i @gravity-ui/icons
   Big screens: the menu is always visible on the left.
   Small screens: only a menu icon is shown; tapping it opens the Drawer. */

const navItems = [
  { icon: House, label: "Overview", href: "/dashboard" },
  { icon: CodePullRequest, label: "My Request", href: "/dashboard/request" },
  { icon: CirclePlus, label: "Add Pet", href: "/dashboard/add-pet" },
  { icon: SquareListUl, label: "My Listings", href: "/dashboard/my-listings" },
  
];

function NavList({ pathname, onNavigate, pillId }) {
  const reduce = useReducedMotion();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#231B4D] outline-none transition-colors hover:bg-[#6C4CF1]/10 focus-visible:ring-2 focus-visible:ring-[#6C4CF1]"
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-xl bg-[#FFB320]"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <item.icon className="relative z-10 size-5" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard({ user }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[#F1EDFF] p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={user.image || "/logo.jpg"} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="truncate font-bold text-[#231B4D]">{user.name}</p>
        <p className="truncate text-xs text-[#231B4D]/65">{user.email}</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const drawer = useOverlayState();
  const { data: session, isPending } = authClient.useSession();

  // dashboard is for logged-in users only
  useEffect(() => {
    if (!isPending && !session) router.replace("/auth/login?redirect=/dashboard");
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F1EDFF] text-[#231B4D]/70">
        Loading your dashboard...
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-[#F1EDFF]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Big screens: menu always visible */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32 rounded-3xl bg-white p-3 shadow-[0_14px_30px_-20px_rgba(35,27,77,0.6)]">
            <UserCard user={user} />
            <NavList pathname={pathname} pillId="pill-desktop" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Small screens: just an icon that opens the drawer */}
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <Button isIconOnly variant="secondary" aria-label="Open dashboard menu" onPress={drawer.open}>
              <Bars />
            </Button>
            <span className="font-bold text-[#231B4D]">Dashboard</span>
          </div>

          {children}
        </div>
      </div>

      <Drawer>
        <Drawer.Backdrop isOpen={drawer.isOpen} onOpenChange={drawer.setOpen}>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Dashboard</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <UserCard user={user} />
                <NavList pathname={pathname} onNavigate={drawer.close} pillId="pill-drawer" />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  );
}