"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  myListings,
  updatePet,
  deletePet,
  getMyIncomingRequests,
  getIncomingRequests,
  updateAdoptionRequest,
} from "@/lib/getUser";
/* Save as: src/app/dashboard/my-listings/page.jsx
   Needs NEXT_PUBLIC_IMGBB_KEY in .env.local (only used if the owner changes the photo while editing). */

const inputClass =
  "w-full rounded-xl border border-[#231B4D]/20 bg-white px-4 py-3 text-[#231B4D] outline-none transition placeholder:text-[#231B4D]/40 focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/30";

const options = {
  species: ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Other"],
  gender: ["Male", "Female"],
  healthStatus: ["Healthy", "Under treatment", "Special needs"],
  vaccinationStatus: ["Fully vaccinated", "Partially vaccinated", "Not vaccinated", "Not required"],
};

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

const formatFee = (fee) => (Number(fee) > 0 ? `৳${Number(fee).toLocaleString()}` : "Free");

/* ---------- Modal shell ---------- */
function Modal({ title, onClose, wide, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#231B4D]/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Edit modal ---------- */
function EditModal({ pet, email, onClose, onSaved }) {
  const [form, setForm] = useState({
    petName: pet.petName ?? "",
    species: pet.species ?? "Dog",
    breed: pet.breed ?? "",
    age: pet.age ?? "",
    gender: pet.gender ?? "Male",
    healthStatus: pet.healthStatus ?? "Healthy",
    vaccinationStatus: pet.vaccinationStatus ?? "Fully vaccinated",
    location: pet.location ?? "",
    adoptionFee: pet.adoptionFee ?? 0,
    description: pet.description ?? "",
    imageUrl: pet.imageUrl ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      return toast.error("Please choose an image under 5 MB.");
    }
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const required = ["petName", "breed", "age", "location", "description"];
    if (required.some((k) => !String(form[k]).trim())) return toast.error("Please fill in all fields.");
    if (form.adoptionFee === "" || Number(form.adoptionFee) < 0) return toast.error("Fee must be 0 or more.");

    const data = { ...form, adoptionFee: Number(form.adoptionFee), ownerEmail: email };
    setSaving(true);
    try {
      const result = await updatePet(pet._id, data);
      // your backend returns the raw MongoDB result (acknowledged, matchedCount, ...)
      if (!result?.acknowledged || result.matchedCount === 0) {
        throw new Error(result?.message || "Could not update the pet.");
      }
      toast.success("Listing updated!");
      onSaved({ ...pet, ...data });
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
      setSaving(false);
    }
  }

  const text = [
    ["petName", "Pet name"],
    ["breed", "Breed"],
    ["age", "Age"],
    ["location", "Location"],
  ];
  const selects = [
    ["species", "Species"],
    ["gender", "Gender"],
    ["healthStatus", "Health status"],
    ["vaccinationStatus", "Vaccination status"],
  ];

  return (
    <Modal title="Edit listing" onClose={onClose} wide>
      <h2 className="text-2xl font-extrabold text-[#231B4D]">Edit {pet.petName}</h2>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        {text.map(([k, label]) => (
          <label key={k} className="block text-sm font-semibold text-[#231B4D]">
            {label}
            <input value={form[k]} onChange={set(k)} className={`${inputClass} mt-1.5 font-normal`} />
          </label>
        ))}

        {selects.map(([k, label]) => (
          <label key={k} className="block text-sm font-semibold text-[#231B4D]">
            {label}
            <select value={form[k]} onChange={set(k)} className={`${inputClass} mt-1.5 font-normal`}>
              {options[k].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}

        <label className="block text-sm font-semibold text-[#231B4D]">
          Adoption fee (৳, 0 for free)
          <input type="number" min="0" value={form.adoptionFee} onChange={set("adoptionFee")} className={`${inputClass} mt-1.5 font-normal`} />
        </label>

        <div className="text-sm font-semibold text-[#231B4D]">
          Photo (optional change)
          <div className="mt-1.5 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.imageUrl || "/logo.jpg"} alt="Current pet" className="h-12 w-12 rounded-xl object-cover" />
            <input
              type="file"
              accept="image/*"
              onChange={onPickPhoto}
              className="w-full text-xs font-normal file:mr-2 file:rounded-full file:border-0 file:bg-[#FFB320] file:px-3 file:py-1.5 file:font-semibold file:text-[#231B4D]"
            />
          </div>
        </div>

        <label className="block text-sm font-semibold text-[#231B4D] md:col-span-2">
          Description
          <textarea rows={4} value={form.description} onChange={set("description")} className={`${inputClass} mt-1.5 font-normal`} />
        </label>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="button"
            onClick={onClose}
            className={`${buttonVariants({ variant: "outline" })} flex-1 rounded-full border-[#231B4D]/30 py-3 font-semibold text-[#231B4D]`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className={`${buttonVariants({ variant: "primary" })} flex-1 rounded-full bg-[#6C4CF1] py-3 font-semibold text-white hover:bg-[#5638D6] disabled:opacity-60`}
          >
            {saving ? "Saving..." : uploading ? "Uploading photo..." : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Delete confirm modal ---------- */
function DeleteModal({ pet, busy, onCancel, onConfirm }) {
  return (
    <Modal title="Delete listing" onClose={busy ? () => { } : onCancel}>
      <h2 className="text-xl font-extrabold text-[#231B4D]">Delete {pet.petName}?</h2>
      <p className="mt-2 text-[#231B4D]/75">This listing will be removed permanently. This cannot be undone.</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className={`${buttonVariants({ variant: "outline" })} flex-1 rounded-full border-[#231B4D]/30 py-3 font-semibold text-[#231B4D]`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="flex-1 rounded-full bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? "Deleting..." : "Yes, delete"}
        </button>
      </div>
    </Modal>
  );
}

function RequestsModal({
  pet,
  requests,
  loading,
  busyId,
  onClose,
  onAction
}) {
  return (
    <Modal title="Adoption Requests" onClose={onClose}>
      <h2 className="text-xl font-extrabold text-[#231B4D]">
        Requests for {pet.petName}
      </h2>

      {loading ? (
        <p className="mt-5">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="mt-5 text-gray-500">
          No pending adoption requests.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {requests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border p-4"
            >
              <p className="text-sm font-semibold text-[#231B4D]">
                Requester Email:
              </p>

              <p className="mt-1 break-all text-sm text-gray-600">
                {request.requesterEmail}
              </p>

              <p className="mt-2 text-sm">
                Status:
                <span className="ml-1 font-semibold text-orange-500">
                  {request.status}
                </span>
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  disabled={!!busyId}
                  onClick={() =>
                    onAction(request, 'approved')
                  }
                  className="flex-1 rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busyId === request._id
                    ? 'Updating...'
                    : 'Approve'}
                </button>

                <button
                  disabled={!!busyId}
                  onClick={() =>
                    onAction(request, 'canceled')
                  }
                  className="flex-1 rounded-full bg-red-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-5 w-full rounded-full border py-2.5 font-semibold"
      >
        Close
      </button>
    </Modal>
  );
}

/* ---------- Page ---------- */
export default function MyListingsPage() {
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  // States
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [requestPet, setRequestPet] = useState(null);
  const [pendingPetIds, setPendingPetIds] = useState(new Set());
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestBusyId, setRequestBusyId] = useState(null);

  useEffect(() => {
    if (!email) return;

    async function loadPendingRequests() {
      try {
        const data = await getMyIncomingRequests(email);

        const petIds = new Set(
          data.map((request) => String(request.petId))
        );

        setPendingPetIds(petIds);
      } catch (error) {
        toast.error("Failed to load pending requests.");
      }
    }

    loadPendingRequests();
  }, [email]);

  async function openRequests(pet) {

    setRequestPet(pet);

    setRequestsLoading(true);



    try {

      const data = await getIncomingRequests(email, pet._id);

      setRequests(Array.isArray(data) ? data : []);

    } catch (error) {

      toast.error("Could not load adoption requests.");

    } finally {

      setRequestsLoading(false);

    }

  }



  async function handleRequestAction(request, status) {
    setRequestBusyId(request._id);

    try {
      const result = await updateAdoptionRequest(
        request._id,
        status,
        email
      );

      if (!result?.acknowledged || result.modifiedCount === 0) {
        throw new Error(result?.message || "Could not update request.");
      }

      if (status === "approved") {
        toast.success(
          "Request approved. All other pending requests were canceled."
        );

        setRequests([]);
        setPendingPetIds((prev) => {
          const updated = new Set(prev);
          updated.delete(String(request.petId));
          return updated;
        });

        // Approve হলে modal বন্ধ হবে।
        setRequestPet(null);
      } else {
        // Cancel করলে শুধু এই request সরবে; modal খোলা থাকবে।
        toast.success("Adoption request canceled.");

        const remainingRequests = requests.filter(
          (item) => item._id !== request._id
        );

        setRequests(remainingRequests);

        if (remainingRequests.length === 0) {
          setPendingPetIds((prev) => {
            const updated = new Set(prev);
            updated.delete(String(request.petId));
            return updated;
          });
        }
      }
    } catch (error) {
      toast.error(error.message || "Could not update request.");
    } finally {
      setRequestBusyId(null);
    }
  }

  useEffect(() => {
    if (!email) return;
    let active = true;
    myListings(email)
      .then((data) => active && setPets(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Could not load your listings."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [email]);

  async function confirmDelete() {
    setDeleteBusy(true);
    try {
      const result = await deletePet(deleting._id, email);
      // raw MongoDB result: { acknowledged: true, deletedCount: 1 }
      if (!result?.acknowledged || result.deletedCount === 0) {
        throw new Error(result?.message || "Could not delete the pet.");
      }
      setPets((list) => list.filter((p) => p._id !== deleting._id));
      toast.success("Listing deleted.");
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="text-3xl font-extrabold text-[#231B4D]"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            My listings
          </h1>
          <p className="mt-1 text-[#231B4D]/70">
            {loading ? "Loading..." : `${pets.length} ${pets.length === 1 ? "pet" : "pets"} listed by you`}
          </p>
        </div>
        <Link
          href="/dashboard/add-pet"
          className={`${buttonVariants({ variant: "primary" })} rounded-full bg-[#6C4CF1] px-5 py-2.5 font-semibold text-white hover:bg-[#5638D6]`}
        >
          + Add pet
        </Link>
      </div>

      {!loading && pets.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)]">
          <p className="text-lg font-semibold text-[#231B4D]">You have not listed any pets yet.</p>
          <p className="mt-1 text-[#231B4D]/70">Add your first pet and help it find a home.</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {pets.map((pet, i) => (
            <motion.article
              key={pet._id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.35 }}
              className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_-18px_rgba(35,27,77,0.6)]"
            >
              <div className="relative aspect-[4/3] bg-[#F1EDFF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.imageUrl || "/logo.jpg"}
                  alt={pet.petName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/logo.jpg";
                  }}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#FFB320] px-3 py-1 text-xs font-bold text-[#231B4D]">
                  {pet.species}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-[#231B4D] px-3 py-1 text-xs font-bold text-white">
                  {formatFee(pet.adoptionFee)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-bold text-[#231B4D]">{pet.petName}</h2>
                <p className="text-[#231B4D]/70">
                  {pet.breed} · {pet.age} · {pet.gender}
                </p>
                <p className="mt-1 text-sm text-[#231B4D]/70">{pet.location}</p>

                <div
                  className={`mt-auto grid gap-3 pt-5 ${pendingPetIds.has(String(pet._id))
                      ? "grid-cols-3"
                      : "grid-cols-2"
                    }`}
                >
                  {/* Edit */}
                  <button onClick={() => setEditing(pet)}>
                    Edit
                  </button>

                  {/* Requests */}
                  {pendingPetIds.has(String(pet._id)) && (
                    <button
                      type="button"
                      onClick={() => openRequests(pet)}
                      className="rounded-full border border-green-300 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                      Requests
                    </button>
                  )}

                  {/* Delete */}
                  <button onClick={() => setDeleting(pet)}>
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {requestPet && (
          <RequestsModal
            key="requests"
            pet={requestPet}
            requests={requests}
            loading={requestsLoading}
            busyId={requestBusyId}
            onClose={() => setRequestPet(null)}
            onAction={handleRequestAction}
          />
        )}
        {editing && (
          <EditModal
            key="edit"
            pet={editing}
            email={email}
            onClose={() => setEditing(null)}
            onSaved={(updated) => {
              setPets((list) => list.map((p) => (p._id === updated._id ? updated : p)));
              setEditing(null);
            }}
          />
        )}
        {deleting && (
          <DeleteModal
            key="delete"
            pet={deleting}
            busy={deleteBusy}
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}