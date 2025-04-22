import React from "react";
import Link from "next/link";
import { Location } from "@/types";

interface LocationHeaderProps {
  location: Location;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ location }) => {
  return (
    <header className="bg-gray-900 p-4 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        <span className="text-xl">←</span>
        <span>Volver</span>
      </Link>
      <h1 className="font-bold text-lg">{location.name}</h1>
      <div className="w-[60px]"></div>
    </header>
  );
};
