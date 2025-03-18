import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "nF#9mK$pL2@vX7"; // Esta contraseña debería moverse a una variable de entorno

export function HamburgerMenu() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const isAdmin = user?.role === "admin" || user?.role === "professional";

  const handleAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setShowAdminDialog(false);
      setAdminPassword("");
      toast({
        title: "Acceso concedido",
        description: "Panel de administración desbloqueado",
      });
    } else {
      toast({
        title: "Acceso denegado",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menú</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Link href="/resources">
              <Button variant="ghost" className="w-full justify-start">
                Recursos de Salud Mental
              </Button>
            </Link>

            {isAdmin && (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => !adminUnlocked && setShowAdminDialog(true)}
              >
                {adminUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                Panel de Administración
              </Button>
            )}

            <Link href="/subscriptions">
              <Button variant="ghost" className="w-full justify-start">
                Suscripciones
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={() => {
                // Implementar lógica para dar de baja
              }}
            >
              Darse de Baja
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acceso Administrativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña de administrador"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleAdminAccess}>
              Acceder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}