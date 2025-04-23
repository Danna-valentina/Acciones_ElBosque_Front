
import { useEffect } from "react";

export const useInactividad = (tiempoMs: number = 20 * 60 * 1000) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const cerrarSesionPorInactividad = () => {
      alert("Sesión expirada por inactividad");
      localStorage.removeItem("token");
      window.location.href = "/LoginPage"; // Asegúrate que coincide con tu ruta
    };

    const iniciarTemporizador = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cerrarSesionPorInactividad, tiempoMs);
    };

    const eventos = ["mousemove", "keydown", "click", "scroll"];
    eventos.forEach(event => window.addEventListener(event, iniciarTemporizador));

    iniciarTemporizador();

    return () => {
      clearTimeout(timeoutId);
      eventos.forEach(event => window.removeEventListener(event, iniciarTemporizador));
    };
  }, [tiempoMs]);
};
