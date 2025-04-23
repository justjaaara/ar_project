'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Location } from '@/types';

interface ARCameraViewProps {
  location: Location;
}

export const ARCameraView: React.FC<ARCameraViewProps> = ({ location }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [orientation, setOrientation] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({ alpha: null, beta: null, gamma: null });
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);

  // Función para calcular la distancia entre dos puntos
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Función para calcular el ángulo de dirección entre dos puntos
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const λ1 = (lon1 * Math.PI) / 180;
    const λ2 = (lon2 * Math.PI) / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    let θ = Math.atan2(y, x);
    θ = (θ * 180 / Math.PI + 360) % 360;
    return θ;
  };

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        setError('No se pudo acceder a la cámara. Por favor, asegúrate de dar los permisos necesarios.');
        console.error('Error al acceder a la cámara:', err);
      }
    };

    initializeCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Verificar si el código se ejecuta en el cliente antes de usar 'window'
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        setOrientation({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
      };

      window.addEventListener('deviceorientation', handleOrientation);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const handlePosition = (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;

        // Calcular distancia y dirección
        const dist = calculateDistance(
          latitude,
          longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        setDistance(dist);

        const bear = calculateBearing(
          latitude,
          longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        setBearing(bear);
      };

      const handleError = (err: GeolocationPositionError) => {
        console.error('Error de geolocalización:', err);
        setError('No se pudo acceder a la ubicación. Por favor, asegúrate de dar los permisos necesarios.');
      };

      const watchId = navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [location.coordinates]);

  useEffect(() => {
    if (!isCameraActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (videoRef.current && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Calcular la dirección basada en la orientación y el bearing
        const deviceDirection = orientation.alpha ? (orientation.alpha + 90) % 360 : 0;
        const targetDirection = bearing !== null ? (deviceDirection - bearing + 360) % 360 : 0;
        
        // Dibujar indicadores AR
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();

        // Dibujar flecha de dirección con rotación
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((targetDirection * Math.PI) / 180);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50);
        ctx.stroke();
        ctx.restore();

        // Dibujar información del destino
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(location.name, canvas.width / 2, canvas.height / 2 + 100);

        // Mostrar información de orientación y distancia
        if (orientation.alpha !== null && distance !== null) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(10, 10, 250, 100);
          ctx.fillStyle = 'white';
          ctx.font = '14px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`Dirección: ${Math.round(targetDirection)}°`, 20, 30);
          ctx.fillText(`Distancia: ${Math.round(distance)} metros`, 20, 50);
          ctx.fillText(`Inclinación: ${Math.round(orientation.beta || 0)}°`, 20, 70);
          ctx.fillText(`Rotación: ${Math.round(orientation.gamma || 0)}°`, 20, 90);
        }
      }
      requestAnimationFrame(draw);
    };

    draw();
  }, [isCameraActive, location, orientation, bearing, distance]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={typeof window !== 'undefined' ? window.innerWidth : 0}
        height={typeof window !== 'undefined' ? window.innerHeight : 0}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
        <h2 className="text-xl font-bold mb-2">{location.name}</h2>
        <p className="text-sm text-gray-300">{location.description}</p>
        {distance !== null && (
          <p className="text-sm text-blue-400 mt-2">
            Distancia: {Math.round(distance)} metros
          </p>
        )}
      </div>
    </div>
  );
};
