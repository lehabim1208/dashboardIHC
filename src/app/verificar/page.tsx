"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Importa useRouter

export default function Verificar() {
  const [status, setStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter(); // Instancia de useRouter

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");
      const correo = searchParams.get("correo");

      if (!token || !correo) {
        setStatus("Parámetros inválidos o incompletos.");
        return;
      }

      try {
        const response = await fetch("/api/verificar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, correo }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus(data.message);

          // Redirige a /login después de 3 segundos si la verificación fue exitosa
          if (data.message.includes("verificada")) {
            setTimeout(() => {
              router.push("/login"); // Redirección
            }, 3000); // Espera 3 segundos antes de redirigir
          }
        } else {
          setStatus(data.error || "Error en la verificación.");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setStatus("Error al procesar la solicitud.");
      }
    };

    verifyUser();
  }, [searchParams, router]); // Asegúrate de incluir router en las dependencias

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Verificación de Cuenta</h1>
        {status === null ? (
          <p>Procesando...</p>
        ) : (
          <p className={status.includes("éxito") ? "text-green-600" : "text-red-600"}>{status}</p>
        )}
      </div>
    </div>
  );
}
