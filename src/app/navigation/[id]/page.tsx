import { notFound } from "next/navigation";
import { LOCATIONS } from "@/constants/locations";
import { LocationHeader } from "@/components/LocationHeader";
import { ARCameraView } from "@/components/ARCameraView";
import { NavigationControls } from "@/components/NavigationControls";

export async function generateStaticParams() {
  return LOCATIONS.map((location) => ({ id: location.id }));
}

interface PageProps {
  params: { id: string };
}

export default function LocationPage({ params }: PageProps) {
  const location = LOCATIONS.find((loc) => loc.id === params.id);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <LocationHeader location={location} />
      <div className="flex-1 relative flex flex-col">
        <ARCameraView location={location} />
        <NavigationControls location={location} />
      </div>
    </div>
  );
}
