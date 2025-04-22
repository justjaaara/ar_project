import { LocationsList } from "@/components/LocationsList";
import { Footer } from "@/components/Footer";
import { LOCATIONS } from "@/constants/locations";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col">
      <header className="mb-12 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          AR Navigator UdeM
        </h1>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Navega por la Universidad de Medellín con realidad aumentada
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <section className="mb-12 max-w-2xl text-center">
          <div className="mb-8 relative w-full h-64 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/universidad.png"
                alt="AR Navigation"
                width={1000}
                height={600}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">¿Cómo funciona?</h2>
          <p className="text-gray-300 mb-6">
            Esta aplicación utiliza realidad aumentada para guiarte a través del
            campus universitario. Simplemente selecciona un destino, activa tu
            cámara y sigue las indicaciones en pantalla para llegar a tu destino
            de forma rápida y sencilla.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 py-2 px-4 bg-gray-800 rounded-full">
              <span className="text-blue-400 text-xl">1</span>
              <span className="text-sm">Selecciona un destino</span>
            </div>

            <div className="flex items-center gap-2 py-2 px-4 bg-gray-800 rounded-full">
              <span className="text-blue-400 text-xl">2</span>
              <span className="text-sm">Activa la cámara</span>
            </div>

            <div className="flex items-center gap-2 py-2 px-4 bg-gray-800 rounded-full">
              <span className="text-blue-400 text-xl">3</span>
              <span className="text-sm">Sigue las indicaciones AR</span>
            </div>
          </div>
        </section>

        <LocationsList locations={LOCATIONS} />
      </main>

      <Footer />
    </div>
  );
}
