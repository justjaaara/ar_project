import React from "react";
import { Location } from "@/types";

interface NavigationControlsProps {
  location: Location;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  location,
}) => {
  return (
    <div className="bg-gray-900 p-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <p>Destino: {location.name}</p>
          <p>{location.description}</p>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
          aria-label="Detener navegación"
        >
          <span className="block h-4 w-4"></span>
        </button>
      </div>
    </div>
  );
};
