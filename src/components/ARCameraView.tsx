import React from "react";
import Image from "next/image";
import { Location } from "@/types";

interface ARCameraViewProps {
  location: Location;
}

export const ARCameraView: React.FC<ARCameraViewProps> = ({ location }) => {
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-800 to-black relative">
      {/* Mensaje de permisos de cámara */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center mb-6">
          <Image
            src="/window.svg"
            alt="Camera icon"
            width={40}
            height={40}
            className="opacity-60"
          />
        </div>
        <h2 className="text-xl mb-2 text-center">Realidad Aumentada</h2>
        <p className="text-gray-400 text-center max-w-md">
          En una versión completa, aquí se mostraría la vista de la cámara con
          instrucciones de navegación superpuestas en realidad aumentada.
        </p>
        <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium">
          Activar Cámara AR
        </button>
      </div>

      {/* Indicadores de AR (simulados) */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="bg-blue-600/80 px-5 py-3 rounded-lg text-center backdrop-blur-sm">
          <p className="font-bold">Dirígete hacia {location.name}</p>
          <p className="text-sm text-gray-200">Aproximadamente a 150 metros</p>
        </div>
      </div>
    </div>
  );
};
