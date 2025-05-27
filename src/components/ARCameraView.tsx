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
  const [distance, setDistance] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Refs para valores en tiempo real
  const orientationRef = useRef<{ alpha: number | null; beta: number | null; gamma: number | null }>(
    { alpha: null, beta: null, gamma: null }
  );
  // Ref para distancia en tiempo real
  const distanceRef = useRef<number | null>(null);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Verifica que esté en el navegador y que mediaDevices exista
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('La cámara no es compatible o no está disponible en este dispositivo/navegador.');
      return;
    }
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
        orientationRef.current = {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        };
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
        const dist = calculateDistance(
          latitude,
          longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        setDistance(dist);
        distanceRef.current = dist;
      };

      const handleError = (err: GeolocationPositionError) => {
        const code = err && 'code' in err ? err.code : 'desconocido';
        const message = err && 'message' in err ? err.message : 'Sin mensaje';
        console.error(`Error de geolocalización [${code}]: ${message}`);
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
    // Ajustar tamaño del canvas dinámicamente para evitar reflows y asegurar calidad
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Estado interno para animación suave
    let lastAngle = 0;
    let animationFrameId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (videoRef.current && ctx) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
        // Usar refs para valores más recientes
        const orientation = orientationRef.current;
        const distance = distanceRef.current;
        const deviceDirection = orientation.alpha != null ? (orientation.alpha + 90) % 360 : 0;
        const targetDirection = distance != null ? (deviceDirection - distance + 360) % 360 : 0;
        // Interpolación suave del ángulo
        lastAngle = lerp(lastAngle, targetDirection, 0.15);
        // Dibujar indicadores AR
        // Dibuja solo una bolita pequeña en la base de la flecha
        ctx.save();
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 8 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 6 * (window.devicePixelRatio || 1);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Dibujar flecha de dirección con rotación
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((lastAngle * Math.PI) / 180);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 5 * (window.devicePixelRatio || 1);
        // Flecha con punta triangular
        ctx.beginPath();
        // Línea principal (sin colita, inicia en el centro)
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50 * (window.devicePixelRatio || 1));
        ctx.stroke();

        // Punta de flecha (triángulo)
        ctx.beginPath();
        ctx.moveTo(0, -60 * (window.devicePixelRatio || 1)); // punta
        ctx.lineTo(-12 * (window.devicePixelRatio || 1), -40 * (window.devicePixelRatio || 1));
        ctx.lineTo(12 * (window.devicePixelRatio || 1), -40 * (window.devicePixelRatio || 1));
        ctx.closePath();
        ctx.fillStyle = '#3B82F6';
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 10 * (window.devicePixelRatio || 1);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.restore();
        // Dibujar información del destino
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = `${20 * (window.devicePixelRatio || 1)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(location.name, canvas.width / 2, canvas.height / 2 + 100 * (window.devicePixelRatio || 1));
        ctx.restore();
        // Mostrar información de orientación y distancia
        if (orientation.alpha !== null && distance !== null) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(10 * (window.devicePixelRatio || 1), 10 * (window.devicePixelRatio || 1), 250 * (window.devicePixelRatio || 1), 100 * (window.devicePixelRatio || 1));
          ctx.fillStyle = 'white';
          ctx.font = `${14 * (window.devicePixelRatio || 1)}px Arial`;
          ctx.textAlign = 'left';
          ctx.fillText(`Dirección: ${Math.round(lastAngle)}°`, 20 * (window.devicePixelRatio || 1), 30 * (window.devicePixelRatio || 1));
          ctx.fillText(`Distancia: ${Math.round(distance)} metros`, 20 * (window.devicePixelRatio || 1), 50 * (window.devicePixelRatio || 1));
          ctx.fillText(`Inclinación: ${Math.round(orientation.beta || 0)}°`, 20 * (window.devicePixelRatio || 1), 70 * (window.devicePixelRatio || 1));
          ctx.fillText(`Rotación: ${Math.round(orientation.gamma || 0)}°`, 20 * (window.devicePixelRatio || 1), 90 * (window.devicePixelRatio || 1));
          ctx.restore();
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isCameraActive, location]);

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
      {isClient && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
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
