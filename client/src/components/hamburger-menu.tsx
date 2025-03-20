import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Lock, 
  Heart, 
  CreditCard, 
  LogOut,
  Book,
  Headset,
  GraduationCap,
  Users,
  Building2,
  PersonStanding,
  Globe,
  Info
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "nF#9mK$pL2@vX7"; 
const ADMIN_PANEL_URL = "https://admin-space-pro-rmportbou.replit.app/auth";

export function HamburgerMenu() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setShowAdminDialog(false);
      setAdminPassword("");
      toast({
        title: "Acceso concedido",
        description: "Accediendo al panel de administración",
      });
      window.location.href = ADMIN_PANEL_URL;
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
            <Link href="/about">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Info className="h-4 w-4" />
                Quienes somos
              </Button>
            </Link>

            <Link href="/services/personal">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <PersonStanding className="h-4 w-4" />
                Servicios Personas
              </Button>
            </Link>

            <Link href="/services/business">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" />
                Servicios Empresas
              </Button>
            </Link>

            <Link href="/language">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                Idiomas
              </Button>
            </Link>

            <Link href="/subscriptions">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Suscripciones
              </Button>
            </Link>

            <Link href="/resources">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Book className="h-4 w-4" />
                Recursos de Salud Mental
              </Button>
            </Link>

            <a href="https://empordajobs.empleactiva.com/contenido/contacto" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Headset className="h-4 w-4" />
                Atención Cliente
              </Button>
            </a>

            <a href="https://empordajobs.empleactiva.com/contenido/ins-neuronmeg-1" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <GraduationCap className="h-4 w-4" />
                Instituto NeuronMeg
              </Button>
            </a>

            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={() => setShowAdminDialog(true)}
            >
              <Lock className="h-4 w-4" />
              Panel de Administración
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive"
              onClick={() => {
                // Implementar lógica para dar de baja
              }}
            >
              <LogOut className="h-4 w-4" />
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