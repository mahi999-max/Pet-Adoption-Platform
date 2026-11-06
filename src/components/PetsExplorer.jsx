"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PetCard from "@/app/pets/Petcard";
// import PetCard from "@/components/PetCard";

/* Save as: src/components/PetsExplorer.jsx
   Usage:   <PetsExplorer pets={allPet} />
   Search + species filter + sort, all on the client (no extra API call). */

const sorts = [
  { value: "default", label: "Default order" },
  { value: "low", label: "Fee: low to high" },
  { value: "high", label: "Fee: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export default function PetsExplorer({ pets = [] }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("All");
  const [sort, setSort] = useState("default");

  // species chips come from the real data, with a count for each
  const speciesList = useMemo(() => {
    const map = new Map();
    pets.forEach((p) => p.species && map.set(p.species, (map.get(p.species) || 0) + 1));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [pets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = pets.filter((p) => {
      const speciesOk = species === "All" || p.species === species;
      const searchOk =
        !q || [p.petName, p.breed, p.species, p.location].some((v) => String(v ?? "").toLowerCase().includes(q));
      return speciesOk && searchOk;
    });

    if (sort === "low") list = [...list].sort((a, b) => Number(a.adoptionFee) - Number(b.adoptionFee));
    if (sort === "high") list = [...list].sort((a, b) => Number(b.adoptionFee) - Number(a.adoptionFee));
    if (sort === "name") list = [...list].sort((a, b) => String(a.petName).localeCompare(String(b.petName)));
    return list;
  }, [pets, query, species, sort]);

  const hasFilters = query.trim() !== "" || species !== "All" || sort !== "default";
  const clearAll = () => {
    setQuery("");
    setSpecies("All");
    setSort("default");
  };

  const chip = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-[#6C4CF1] ${
      active
        ? "bg-[#6C4CF1] text-white shadow-[0_8px_16px_-10px_rgba(108,76,241,0.9)]"
        : "bg-[#F1EDFF] text-[#231B4D] hover:bg-[#6C4CF1]/15"
    }`;

  return (
    <div>
      {/* Filter bar */}
      <div
        role="search"
        className="rounded-3xl bg-white p-4 shadow-[0_14px_30px_-20px_rgba(35,27,77,0.6)] sm:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#231B4D]/50"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              aria-label="Search pets"
              placeholder="Search by name, species, breed or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-[#231B4D]/20 bg-white py-3 pl-12 pr-4 text-[#231B4D] outline-none transition placeholder:text-[#231B4D]/45 focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/30"
            />
          </div>

          {/* Sort */}
          <select
            aria-label="Sort pets"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-[#231B4D]/20 bg-white px-4 py-3 font-semibold text-[#231B4D] outline-none focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/30 md:w-52"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Species chips */}
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by species">
          <button type="button" aria-pressed={species === "All"} onClick={() => setSpecies("All")} className={chip(species === "All")}>
            All ({pets.length})
          </button>
          {speciesList.map(([name, count]) => (
            <button
              key={name}
              type="button"
              aria-pressed={species === name}
              onClick={() => setSpecies(name)}
              className={chip(species === name)}
            >
              {name} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Result count + clear */}
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-[#231B4D]/75" aria-live="polite">
        <p>
          Showing <span className="font-bold text-[#231B4D]">{filtered.length}</span> of {pets.length}{" "}
          {pets.length === 1 ? "pet" : "pets"}
        </p>
        {hasFilters && (
          <button type="button" onClick={clearAll} className="font-bold text-[#6C4CF1] hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl bg-white p-10 text-center shadow-[0_10px_24px_-16px_rgba(35,27,77,0.5)]"
        >
          <p className="text-lg font-semibold text-[#231B4D]">No pets match your search.</p>
          <p className="mt-1 text-[#231B4D]/70">Try a different word or choose another species.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 rounded-full bg-[#6C4CF1] px-6 py-2.5 font-semibold text-white transition hover:bg-[#5638D6]"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((pet, i) => (
              <motion.div
                key={pet._id}
                layout={!reduce}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <PetCard pet={pet} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}