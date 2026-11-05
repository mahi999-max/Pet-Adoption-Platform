"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AddPet } from "@/lib/getUser"; // your existing function

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

const speciesOptions = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Other"];
const genderOptions = ["Male", "Female"];
const healthOptions = ["Healthy", "Under treatment", "Special needs"];
const vaccinationOptions = ["Fully vaccinated", "Partially vaccinated", "Not vaccinated", "Not required"];

function Field({ label, id, error, className = "", children }) {
  return (
    <div className={className}>
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

function Select({ id, value, onChange, options }) {
  return (
    <select id={id} value={value} onChange={onChange} className={inputClass}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export default function AddPetPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const ownerEmail = session?.user?.email ?? ""; // auto-filled, read only

  const [form, setForm] = useState({
    petName: "",
    species: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    healthStatus: "Healthy",
    vaccinationStatus: "Fully vaccinated",
    location: "",
    adoptionFee: "",
    description: "",
  });
  const [photoURL, setPhotoURL] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
      toast.error(err.message);
      setErrors((er) => ({ ...er, photo: err.message }));
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const er = {};
    if (!form.petName.trim()) er.petName = "Please enter the pet's name.";
    if (!form.breed.trim()) er.breed = "Please enter the breed.";
    if (!form.age.trim()) er.age = "Please enter the age (for example 2 years).";
    if (!form.location.trim()) er.location = "Please enter the location.";
    if (form.adoptionFee === "" || Number(form.adoptionFee) < 0) er.adoptionFee = "Enter a fee of 0 or more (0 means free).";
    if (!form.description.trim()) er.description = "Please write a short description.";
    if (!photoURL) er.photo = uploading ? "Please wait for the photo to finish uploading." : "Please upload a photo.";
    return er;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    if (!ownerEmail) return toast.error("Please log in again to add a pet.");

    setSubmitting(true);
    try {
      const result = await AddPet({
        ...form,
        petName: form.petName.trim(),
        breed: form.breed.trim(),
        age: form.age.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        adoptionFee: Number(form.adoptionFee),
        imageUrl: photoURL,
        ownerEmail,
      });

      // your AddPet returns res.json(), so check the response itself
      if (!result || (!result.insertedId && !result.success && !result.acknowledged)) {
        throw new Error(result?.message || "Could not add the pet. Please try again.");
      }

      toast.success("Pet added successfully!");
      router.push("/pets");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="max-w-3xl rounded-3xl bg-white p-6 shadow-[0_14px_30px_-20px_rgba(35,27,77,0.6)] sm:p-8"
    >
      <h1
        className="text-3xl font-extrabold text-[#231B4D]"
        style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      >
        Add a pet
      </h1>
      <p className="mt-1 text-[#231B4D]/70">Fill in the details and help a pet find a loving home.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Pet name" id="petName" error={errors.petName}>
          <input id="petName" type="text" placeholder="e.g. Bruno" value={form.petName} onChange={set("petName")} className={inputClass} />
        </Field>

        <Field label="Species" id="species">
          <Select id="species" value={form.species} onChange={set("species")} options={speciesOptions} />
        </Field>

        <Field label="Breed" id="breed" error={errors.breed}>
          <input id="breed" type="text" placeholder="e.g. Labrador Mix" value={form.breed} onChange={set("breed")} className={inputClass} />
        </Field>

        <Field label="Age" id="age" error={errors.age}>
          <input id="age" type="text" placeholder="e.g. 2 years" value={form.age} onChange={set("age")} className={inputClass} />
        </Field>

        <Field label="Gender" id="gender">
          <Select id="gender" value={form.gender} onChange={set("gender")} options={genderOptions} />
        </Field>

        <Field label="Adoption fee (৳, 0 for free)" id="adoptionFee" error={errors.adoptionFee}>
          <input id="adoptionFee" type="number" min="0" placeholder="e.g. 3000" value={form.adoptionFee} onChange={set("adoptionFee")} className={inputClass} />
        </Field>

        <Field label="Health status" id="healthStatus">
          <Select id="healthStatus" value={form.healthStatus} onChange={set("healthStatus")} options={healthOptions} />
        </Field>

        <Field label="Vaccination status" id="vaccinationStatus">
          <Select id="vaccinationStatus" value={form.vaccinationStatus} onChange={set("vaccinationStatus")} options={vaccinationOptions} />
        </Field>

        <Field label="Location" id="location" error={errors.location}>
          <input id="location" type="text" placeholder="e.g. Dhanmondi, Dhaka" value={form.location} onChange={set("location")} className={inputClass} />
        </Field>

        <Field label="Owner email (auto-filled)" id="ownerEmail">
          <input id="ownerEmail" type="email" value={ownerEmail} readOnly className={`${inputClass} cursor-not-allowed bg-[#F1EDFF]/60`} />
        </Field>

        <Field label="Pet photo" id="photo" error={errors.photo} className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F1EDFF] text-xs text-[#231B4D]/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {preview ? <img src={preview} alt="Selected pet preview" className="h-full w-full object-cover" /> : "No photo"}
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
            aria-label="Image URL"
            value={uploading ? "Uploading to ImgBB..." : photoURL}
            placeholder="Image URL will appear here"
            className={`${inputClass} mt-2 bg-[#F1EDFF]/60 text-sm`}
          />
        </Field>

        <Field label="Description" id="description" error={errors.description} className="md:col-span-2">
          <textarea
            id="description"
            rows={4}
            placeholder="Tell us about the pet's personality, habits and needs..."
            value={form.description}
            onChange={set("description")}
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting || uploading}
            className={`${buttonVariants({ variant: "primary" })} w-full rounded-full bg-[#6C4CF1] py-3 text-lg font-semibold text-white hover:bg-[#5638D6] disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {submitting ? "Adding pet..." : uploading ? "Uploading photo..." : "Add pet"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}