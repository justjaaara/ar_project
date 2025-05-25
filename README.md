# AR Navigator UdeM

## Visión general

AR Navigator UdeM es una aplicación de navegación basada en realidad aumentada (AR) diseñada específicamente para ayudar a estudiantes, profesores y visitantes a desplazarse por el campus de la Universidad de Medellín. La aplicación utiliza tecnología de realidad aumentada para superponer indicaciones visuales de navegación sobre el entorno real, proporcionando una experiencia de orientación intuitiva y eficiente.

## Tecnologías

El proyecto está construido con las siguientes tecnologías:

- **Next.js**: Framework de React que proporciona renderización del lado del servidor (SSR), generación estática, y optimizaciones de rendimiento.
- **TypeScript**: Lenguaje de programación tipado que mejora el desarrollo y mantenimiento del código.
- **Tailwind CSS**: Framework de CSS utilitario para el diseño responsivo y la interfaz de usuario.
- **WebXR**: API para desarrollar experiencias de realidad aumentada en navegadores web.
- **React 19**: Versión más reciente de React para construir interfaces de usuario.

## Características principales

- **Navegación AR en tiempo real**: Superpone flechas direccionales y marcadores en la vista de la cámara para guiar a los usuarios.
- **Catálogo de ubicaciones**: Incluye los principales puntos de interés del campus como la Biblioteca, Bloque 5, Coliseo, Teatro y Admisiones.
- **Indicaciones de distancia**: Muestra la distancia aproximada hasta el destino seleccionado.
- **Interfaz intuitiva**: Diseño centrado en el usuario con instrucciones claras y navegación sencilla.
- **Optimizado para dispositivos móviles**: Experiencia fluida en smartphones y tablets.

## Arquitectura

El proyecto sigue una arquitectura moderna basada en componentes:

- **Layout**: Estructura base de la aplicación con estilos globales y metadatos.
- **Páginas**: Sistema de rutas basado en el sistema de archivos de Next.js.
- **Componentes**: Elementos reutilizables como ARCameraView, LocationsList, NavigationControls, etc.
- **Tipos**: Definiciones de TypeScript para garantizar la consistencia de datos.
- **Constantes**: Datos predefinidos como ubicaciones y puntos de interés.

## Funcionamiento

1. El usuario selecciona un destino específico de la lista de ubicaciones disponibles.
2. La aplicación solicita permisos para acceder a la cámara del dispositivo.
3. Una vez activada la cámara, el sistema de AR superpone flechas e indicadores visuales en la vista real.
4. El usuario sigue las indicaciones para llegar al destino deseado.
5. La interfaz proporciona información adicional como distancia restante y nombre del destino.

## Implementación técnica

- **Generación de rutas**: Algoritmos para calcular la ruta óptima entre la posición actual y el destino.
- **Tracking espacial**: Utilización de los sensores del dispositivo (giroscopio, acelerómetro, GPS) para determinar la ubicación y orientación precisas.
- **Renderización AR**: Superposición de elementos 3D sobre la vista de cámara real.
- **Optimización de rendimiento**: Técnicas para garantizar una experiencia fluida incluso en dispositivos con recursos limitados.

## Estado del proyecto

La aplicación está actualmente en fase de desarrollo con una interfaz funcional que demuestra el concepto. La implementación completa de la funcionalidad AR está en progreso.

## Próximos pasos

- Integración del API de WebXR para habilitar la funcionalidad AR completa
- Implementación del sistema de geolocalización precisa dentro del campus
- Desarrollo de modelos 3D para mejorar la visualización AR
- Optimización de la experiencia de usuario basada en pruebas reales
- Integración con el mapa oficial de la Universidad de Medellín

# AR Project

## Cómo habilitar la geolocalización y la actualización en vivo de la flecha en cualquier dispositivo 

1. **Inicia el servidor de desarrollo:**
   
   En la carpeta del proyecto, ejecuta:
   
   pnpm dev

2. **Descarga y configura ngrok:**
   - Descarga ngrok desde https://ngrok.com/download y descomprime el ejecutable.
   - Regístrate gratis en https://dashboard.ngrok.com/signup.
   - Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken.
   - Abre una terminal en la carpeta donde está ngrok.exe y ejecuta:
     .\ngrok config add-authtoken TU_TOKEN

3. **Expón tu servidor local con HTTPS:**
   
   .\ngrok http 3000

4. **Abre la URL HTTPS que te da ngrok ** (Caso de ser un celular u otro dispositivo diferente del dispositivo donde corre localhost, debe estar en la misma red WiFi).

Así la geolocalización y la flecha de navegación funcionarán correctamente en tu dispositivo.
