"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import AdoptNow from "./Home/AdoptNow";
import WhyAdopt from "./Home/WhyAdopt";
import SuccessStories from "./Home/SuccessStories";
import CareTips from "./Home/CareTips ";
import HowItWorks from "./Home/HowItWorks";

/* Palette: Blueberry ink #231B4D · Violet #6C4CF1 · Marigold #FFB320 · Lilac #F1EDFF */

export default function Banner() {
    const reduce = useReducedMotion();

    const line = (i) => ({
        initial: reduce ? false : { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 + i * 0.15, duration: 0.55, ease: "easeOut" },
    });

    return (
        <div>
        <section className="relative overflow-hidden bg-[#F1EDFF]">
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 text-center sm:px-6 sm:pt-16">
                <motion.p
                    {...line(0)}
                    className="rounded-full bg-[#FFB320] px-4 py-1.5 text-sm font-semibold text-[#231B4D]"
                >
                    PetNest · Pet adoption
                </motion.p>

                <h1
                    className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#231B4D] sm:text-6xl"
                    style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
                >
                    <motion.span {...line(1)} className="block">
                        Every pet deserves a home.
                    </motion.span>
                    <motion.span {...line(2)} className="block text-[#6C4CF1]">
                        Every home deserves a friend.
                    </motion.span>
                </h1>

                <motion.p {...line(3)} className="mt-5 max-w-xl text-base leading-relaxed text-[#231B4D]/75 sm:text-lg">
                    Meet dogs and cats waiting for a family. Browse, choose and adopt your new best friend today.
                </motion.p>

                <motion.div {...line(4)} className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/pets"
                        className={`${buttonVariants({ variant: "primary" })} rounded-full bg-[#6C4CF1] px-6 py-3 font-semibold text-white hover:bg-[#5638D6]`}
                    >
                        Meet our pets
                    </Link>
                    <Link
                        href="/register"
                        className={`${buttonVariants({ variant: "outline" })} rounded-full border-[#231B4D]/30 px-6 py-3 font-semibold text-[#231B4D]`}
                    >
                        Create an account
                    </Link>
                </motion.div>
            </div>

            {/* No z-index here, so multiply can blend the white into the section colour */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
                className="pointer-events-none relative mx-auto -mt-14 max-w-4xl px-4 sm:-mt-36 sm:px-6 md:-mt-52"
            >
                <Image
                    src="/banner.png"
                    width={474}
                    height={284}
                    alt="Dogs and cats sitting together"
                    priority
                    className="h-auto w-full mix-blend-multiply"
                />
            </motion.div>
        </section>
        <AdoptNow></AdoptNow>

         {/* FeaturedPets */}
         
        <WhyAdopt></WhyAdopt>
        <HowItWorks></HowItWorks>
        <SuccessStories></SuccessStories>
        <CareTips></CareTips>
        </div>
    );
}