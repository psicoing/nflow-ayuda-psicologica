import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function HamburgerMenu() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const isAdmin = user?.role === "admin" || user?.role === "professional";

  return (
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
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                Panel de Administración
              </Button>
            </Link>
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
  );
}
