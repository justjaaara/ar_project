import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-6 text-center border-t border-gray-800">
      <p className="text-gray-500 text-sm">
        Universidad de Medellín - AR Navigator © {new Date().getFullYear()}
      </p>
    </footer>
  );
};
