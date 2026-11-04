"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@heroui/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { authClient } from "@/lib/auth-client";

/* Save as: src/app/register/page.jsx
   Needs in .env.local:  NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key   (restart the dev server after adding) */

/* ---------- 1) Plug your real sign-up here (Firebase, Better Auth, your API...) ---------- */
async function registerUser({ name, email, password, photoURL }) {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
    image: photoURL,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* ---------- 2) Upload the chosen photo to ImgBB and get its URL ---------- */
async function uploadToImgbb(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json?.error?.message || "Image upload failed.");
  return json.data.url;
}

const inputClass =
  "w-full rounded-xl border border-[#231B4D]/20 bg-white px-4 py-3 text-[#231B4D] outline-none transition placeholder:text-[#231B4D]/40 focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/30";

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#231B4D]">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Rule({ ok, children }) {
  return (
    <li className={`flex items-center gap-2 text-sm transition-colors ${ok ? "text-green-700" : "text-[#231B4D]/60"}`}>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
          ok ? "bg-green-600" : "bg-[#231B4D]/25"
        }`}
        aria-hidden="true"
      >
        {ok ? "✓" : ""}
      </span>
      {children}
    </li>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // live password rules
  const rules = {
    length: form.password.length >= 6,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    match: form.password !== "" && form.password === form.confirm,
  };

  async function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrors((er) => ({ ...er, photo: "" }));

    if (!file.type.startsWith("image/")) return setErrors((er) => ({ ...er, photo: "Please choose an image file." }));
    if (file.size > 5 * 1024 * 1024) return setErrors((er) => ({ ...er, photo: "Image must be under 5 MB." }));

    setPreview(URL.createObjectURL(file));
    setPhotoURL("");
    setUploading(true);
    try {
      setPhotoURL(await uploadToImgbb(file));
    } catch (err) {
      setPreview("");
      setErrors((er) => ({ ...er, photo: err.message }));
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const er = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Please enter a valid email address.";
    if (!photoURL) er.photo = uploading ? "Please wait for the photo to finish uploading." : "Please upload a photo.";
    if (!rules.length) er.password = "Password must be at least 6 characters.";
    else if (!rules.upper) er.password = "Password must have at least one uppercase letter.";
    else if (!rules.lower) er.password = "Password must have at least one lowercase letter.";
    if (!rules.match) er.confirm = "Passwords do not match.";
    return er;
  }

 async function onSubmit(e) {
  e.preventDefault();

  setFormError("");

  const er = validate();
  setErrors(er);

  if (Object.keys(er).length > 0) {
    return;
  }

  setSubmitting(true);

  try {
    await registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      photoURL,
    });

    router.push("/");
  } catch (err) {
    console.error("Registration Error:", err);

    setFormError(err?.message || "Registration failed.");
    setSubmitting(false);
  }
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
          Create your account
        </h1>
        <p className="mt-1 text-[#231B4D]/70">Join Furever Home and find your new best friend.</p>

        <AnimatePresence>
          {formError && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 overflow-hidden rounded-xl bg-red-50 text-sm font-medium text-red-700"
            >
              <p className="border border-red-200 px-4 py-3">{formError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <Field label="Name" id="name" error={errors.name}>
            <input id="name" type="text" autoComplete="name" placeholder="Your full name" value={form.name} onChange={set("name")} className={inputClass} />
          </Field>

          <Field label="Email" id="email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className={inputClass} />
          </Field>

          <Field label="Photo" id="photo" error={errors.photo}>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1EDFF] text-xs text-[#231B4D]/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {preview ? <img src={preview} alt="Selected photo preview" className="h-full w-full object-cover" /> : "No photo"}
              </div>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={onPickPhoto}
                className="w-full text-sm text-[#231B4D] file:mr-3 file:rounded-full file:border-0 file:bg-[#FFB320] file:px-4 file:py-2 file:font-semibold file:text-[#231B4D] hover:file:bg-[#FFA400]"
              />
            </div>
            <input
              type="text"
              readOnly
              aria-label="Photo URL"
              value={uploading ? "Uploading to ImgBB..." : photoURL}
              placeholder="Photo URL will appear here"
              className={`${inputClass} mt-2 bg-[#F1EDFF]/60 text-sm`}
            />
          </Field>

          <Field label="Password" id="password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
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
            <ul className="mt-2 space-y-1">
              <Rule ok={rules.length}>At least 6 characters</Rule>
              <Rule ok={rules.upper}>One uppercase letter</Rule>
              <Rule ok={rules.lower}>One lowercase letter</Rule>
            </ul>
          </Field>

          <Field label="Confirm password" id="confirm" error={errors.confirm}>
            <input
              id="confirm"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={set("confirm")}
              className={inputClass}
            />
            {form.confirm && (
              <ul className="mt-2">
                <Rule ok={rules.match}>Passwords match</Rule>
              </ul>
            )}
          </Field>

          <button
            type="submit"
            disabled={submitting || uploading}
            className={`${buttonVariants({ variant: "primary" })} w-full rounded-full bg-[#6C4CF1] py-3 font-semibold text-white hover:bg-[#5638D6] disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {submitting ? "Creating account..." : uploading ? "Uploading photo..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#231B4D]/80">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#6C4CF1] underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}