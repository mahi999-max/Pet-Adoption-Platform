import { notFound } from "next/navigation";
import { petDetails } from "@/lib/getUser";
import PetDetailsView from "./PetDetailsView";

/* Save as: src/app/pets/[id]/page.jsx */

const PetDetails = async ({ params }) => {
  const { id } = await params;
  const details = await petDetails({ id });

  // no pet found -> Next.js 404 page
  if (!details || Object.keys(details).length === 0) notFound();

  return <PetDetailsView pet={details} id={id} />;
};

export default PetDetails;