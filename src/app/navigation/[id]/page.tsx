import { notFound } from "next/navigation";
import { LOCATIONS } from "@/constants/locations";
import { LocationHeader } from "@/components/LocationHeader";
import { ARCameraView } from "@/components/ARCameraView";
import { NavigationControls } from "@/components/NavigationControls";

// Esto le dice a Next.js qué rutas estáticas generar
export async function generateStaticParams() {
  return LOCATIONS.map((location) => ({ id: location.id }));
}

// Forzar modo estático para evitar problemas con los tipos
export const dynamic = "force-static";
export const dynamicParams = false;

// Manejo explícito de los params convertidos en texto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageProps = any;

export default function LocationPage(props: PageProps) {
  // Extraer el ID de los parámetros
  const id =
    typeof props.params === "object" && props.params !== null
      ? props.params.id
      : typeof props.params === "string"
      ? props.params
      : undefined;

  const location = LOCATIONS.find((loc) => loc.id === id);

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
