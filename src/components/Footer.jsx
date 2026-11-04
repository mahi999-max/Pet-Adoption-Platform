"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/* Palette: Blueberry ink #231B4D · Violet #6C4CF1 · Marigold #FFB320 · Lilac #F1EDFF */

const explore = [
  { label: "Home", href: "/" },
  { label: "All pets", href: "/pets" },
];

const account = [
  { label: "Log in", href: "/login" },
  { label: "Register", href: "/register" },
];

// const marqueeWords = ["Adopt", "Don't shop", "Give a home", "Find your best friend", "Every pet deserves love"];

// function Marquee() {
//   const reduce = useReducedMotion();
//   const row = (
//     <div className="flex shrink-0 items-center" aria-hidden="true">
//       {marqueeWords.map((w) => (
//         <span key={w} className="flex items-center whitespace-nowrap text-lg font-bold text-[#231B4D] sm:text-xl">
//           <span className="px-6">{w}</span>
//           <svg width="18" height="18" viewBox="0 0 48 48" fill="#231B4D">
//             <ellipse cx="14.5" cy="21" rx="4" ry="5" transform="rotate(-18 14.5 21)" />
//             <ellipse cx="22" cy="14.5" rx="4" ry="5.2" transform="rotate(-6 22 14.5)" />
//             <ellipse cx="30.5" cy="14.5" rx="4" ry="5.2" transform="rotate(6 30.5 14.5)" />
//             <ellipse cx="37.5" cy="21" rx="4" ry="5" transform="rotate(18 37.5 21)" />
//             <path d="M26 24c-5.2 0-10.5 5.6-10.5 10.2 0 3.4 2.6 4.8 5.4 4.8 2 0 3.3-.8 5.1-.8s3.1.8 5.1.8c2.8 0 5.4-1.4 5.4-4.8C36.5 29.6 31.2 24 26 24z" />
//           </svg>
//         </span>
//       ))}
//     </div>
//   );

//   return (
//     <div className="overflow-hidden bg-[#FFB320] py-3" role="presentation">
//       <motion.div
//         className="flex w-max"
//         animate={reduce ? undefined : { x: ["0%", "-50%"] }}
//         transition={{ duration: 28, ease: "linear", repeat: Infinity }}
//       >
//         {row}
//         {row}
//       </motion.div>
//     </div>
//   );
// }

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group relative inline-block py-1 text-[#F1EDFF]/80 outline-none transition-colors hover:text-white focus-visible:text-white"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-[#FFB320] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
    </Link>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="bg-[#231B4D] text-[#F1EDFF]">
      {/* <Marquee /> */}

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]"
      >
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image src="/logo.jpg" width={44} height={44} alt="Furever Home logo" className="rounded-xl" />
            <span
              className="text-xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
             PetNest
            </span>
          </Link>
          <p className="mt-4 max-w-xs leading-relaxed text-[#F1EDFF]/75">
            We connect loving families with pets waiting for a home. Browse, meet and adopt your new best friend.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Explore">
          <h2 className="mb-3 text-base font-bold text-white">Explore</h2>
          <ul>
            {explore.map((l) => (
              <li key={l.href}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Account */}
        <nav aria-label="Account">
          <h2 className="mb-3 text-base font-bold text-white">Account</h2>
          <ul>
            {account.map((l) => (
              <li key={l.href}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="mb-3 text-base font-bold text-white">Contact us</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="mailto:hello@fureverhome.com"
                className="inline-block py-1 text-[#F1EDFF]/80 transition-colors hover:text-[#FFB320]"
              >
                hello@fureverhome.com
              </a>
            </li>
            <li>
              <a
                href="tel:+8801000000000"
                className="inline-block py-1 text-[#F1EDFF]/80 transition-colors hover:text-[#FFB320]"
              >
                +880 1000 000000
              </a>
            </li>
            <li className="py-1 text-[#F1EDFF]/80">Dhaka, Bangladesh</li>
          </ul>
        </div>
      </motion.div>

      <div className="border-t border-[#F1EDFF]/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-[#F1EDFF]/65 sm:flex-row sm:px-6">
          <p>© 2026 Furever Home. All rights reserved.</p>
          <p>Made with love for every pet.</p>
        </div>
      </div>
    </footer>
  );
}