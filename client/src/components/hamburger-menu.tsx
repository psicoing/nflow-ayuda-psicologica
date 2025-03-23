import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Languages, Book, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { DeactivateAccountDialog } from "./deactivate-account-dialog";
import { useLocation } from "wouter";

export function HamburgerMenu() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menú principal</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {/* Selector de idioma */}
          <div className="flex items-center gap-2 px-2">
            <Languages className="h-5 w-5" />
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español (ES)</SelectItem>
                <SelectItem value="en">English (EN)</SelectItem>
                <SelectItem value="ca">Català (CA)</SelectItem>
                <SelectItem value="fr">Français (FR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user ? (
            // Menú para usuarios autenticados
            <>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="/resources">
                  <Book className="h-5 w-5" />
                  Recursos
                </a>
              </Button>
              <DeactivateAccountDialog />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5" />
                {logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
              </Button>
            </>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  );
}