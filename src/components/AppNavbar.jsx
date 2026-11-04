"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@heroui/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "All pets", href: "/pets" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav
      aria-label="Main"
      className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${scrolled
        ? "bg-[#F1EDFF]/85 border-b border-[#6C4CF1]/15 shadow-[0_8px_24px_-16px_rgba(35,27,77,0.5)]"
        : "bg-[#F1EDFF]"
        }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-300 ${scrolled ? "h-24" : "h-28"
          }`}
      >
        {/* Logo + website name */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <div className="flex-col">
            <Image src="/logo.jpg" width={70} height={70} className="rounded-4xl" alt="logo" />
            <span
              className="text-xl font-extrabold tracking-tight text-[#231B4D]"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              PetNest
            </span>
          </div>
        </Link>

        {/* Desktop links with sliding highlight */}
        <ul className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="relative block rounded-full px-4 py-2 text-[15px] font-medium text-[#231B4D] outline-none focus-visible:ring-2 focus-visible:ring-[#6C4CF1]"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#FFB320]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Login + Register (or user photo + Log out) */}
        <div className="flex items-center gap-2">
          {isPending ? null : session?.user ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={session.user.image || "/logo.jpg"}
                alt={session.user.name}
                title={session.user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <button
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/");
                        router.refresh();
                      },
                    },
                  })
                }
                className={`${buttonVariants({ variant: "ghost" })} rounded-full px-3 py-2 text-sm font-semibold text-[#231B4D] sm:p-3 sm:text-base`}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                aria-current={isActive("/auth/login") ? "page" : undefined}
                className={`${buttonVariants({ variant: "ghost" })} rounded-full px-3 py-2 text-sm font-semibold text-[#231B4D] sm:p-3 sm:text-base ${isActive("/auth/login") ? "bg-[#FFB320]!" : ""
                  }`}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                aria-current={isActive("/auth/register") ? "page" : undefined}
                className={`${buttonVariants({ variant: "ghost" })} rounded-full px-3 py-2 text-sm font-semibold sm:p-3 sm:text-base ${isActive("/auth/register")
                  ? "bg-[#FFB320]! text-[#231B4D]! hover:bg-[#FFB320]!"
                  : ""
                  }`}
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <Button
            isIconOnly
            variant="ghost"
            className="sm:hidden text-[#231B4D]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onPress={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            key="mobile-menu"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-4 pb-4 sm:hidden"
          >
            {links.map((item, i) => (
              <motion.li
                key={item.href}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.25 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-lg font-semibold text-[#231B4D] ${isActive(item.href) ? "bg-[#FFB320]" : "hover:bg-[#6C4CF1]/10"
                    }`}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}