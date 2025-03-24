import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar el banner solo si aún no se ha decidido
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted === null) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
    toast({
      title: "Cookies aceptadas",
      description: "Gracias por tu confianza",
    });
  };

  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setShowBanner(false);
    toast({
      title: "Cookies rechazadas",
      description: "Respetamos tu decisión",
    });
  };

  const configureCookies = () => {
    toast({
      title: "Configuración de cookies",
      description: "Esta función estará disponible próximamente",
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 w-full bg-card p-4 shadow-lg z-50 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <p className="mb-4 text-card-foreground">
          Utilizamos cookies propias y de terceros para mejorar tu experiencia, 
          analizar el tráfico y personalizar contenido. Puedes aceptar todas, 
          rechazarlas o configurar tus preferencias.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={acceptCookies} variant="default">
            Aceptar
          </Button>
          <Button onClick={rejectCookies} variant="destructive">
            Rechazar
          </Button>
          <Button onClick={configureCookies} variant="outline">
            Configurar
          </Button>
        </div>
      </div>
    </div>
  );
}
