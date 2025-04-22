import React from "react";
import Link from "next/link";
import { Location } from "@/types";

interface LocationsListProps {
  locations: Location[];
}

export const LocationsList: React.FC<LocationsListProps> = ({ locations }) => {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-6 text-center">
        Selecciona un lugar para ir
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <Link
            href={`/navigation/${location.id}`}
            key={location.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col"
          >
            <h3 className="font-bold text-lg">{location.name}</h3>
            <p className="text-gray-400 text-sm">{location.description}</p>
            <div className="mt-4 self-end">
              <span className="text-sm bg-blue-900/50 py-1 px-3 rounded-full">
                Navegar ahora →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
