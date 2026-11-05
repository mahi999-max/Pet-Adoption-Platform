import { getAllPets } from "@/lib/getUser";
import PetCard from "./Petcard";

/* Save as: src/app/pets/page.jsx */

const AllPetsPage = async () => {
  const allPet = await getAllPets();

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-[#F1EDFF] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6C4CF1]">All pets</p>
          <h1
            className="mt-2 text-3xl font-extrabold text-[#231B4D] sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Find your new best friend
          </h1>
          <p className="mt-2 text-[#231B4D]/70">
            {allPet.length} {allPet.length === 1 ? "pet is" : "pets are"} waiting for a home.
          </p>
        </div>

        {allPet.length === 0 ? (
          <p className="mt-16 text-center text-lg text-[#231B4D]/70">
            No pets found right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allPet.map((pet, i) => (
              <PetCard key={pet._id} pet={pet} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllPetsPage;