"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/* Save as: src/app/login/page.jsx
   Needs:  npm i sonner   and   <Toaster position="top-center" richColors />  once in your root layout.
   Redirect: /login?redirect=/pets/3  sends the user there after login, otherwise to home. */

const inputClass =
  "w-full rounded-xl border border-[#231B4D]/20 bg-white px-4 py-3 text-[#231B4D] outline-none transition placeholder:text-[#231B4D]/40 focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/30";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();

  // only allow internal paths, so nobody can redirect users to another site
  const requested = params.get("redirect");
  const redirectTo = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();

    const er = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Please enter a valid email address.";
    if (!form.password) er.password = "Please enter your password.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });

    if (error) {
      toast.error(error.message || "Login failed. Please check your email and password.");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F1EDFF] px-4 py-12">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(35,27,77,0.5)] sm:p-8"
      >
        <h1
          className="text-3xl font-extrabold text-[#231B4D]"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Welcome back
        </h1>
        <p className="mt-1 text-[#231B4D]/70">Log in to continue your adoption journey.</p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#231B4D]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              className={inputClass}
            />
            {errors.email && (
              <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#231B4D]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={set("password")}
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6C4CF1]"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${buttonVariants({ variant: "primary" })} w-full rounded-full bg-[#6C4CF1] py-3 font-semibold text-white hover:bg-[#5638D6] disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#231B4D]/80">
          New to Furever Home?{" "}
          <Link href="/register" className="font-bold text-[#6C4CF1] underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

// useSearchParams needs a Suspense boundary in Next.js
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}