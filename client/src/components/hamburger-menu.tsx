import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Languages, Book, LogOut, Info, PersonStanding, Building2, Headset, GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export function HamburgerMenu() {
  const { user, logoutMutation } = useAuth();

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
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5" />
                Darse de baja
              </Button>
            </>
          ) : (
            // Menú para visitantes
            <>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="/about">
                  <Info className="h-5 w-5" />
                  Quienes somos
                </a>
              </Button>

              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="/services/personal">
                  <PersonStanding className="h-5 w-5" />
                  Servicios Personas
                </a>
              </Button>

              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="/services/business">
                  <Building2 className="h-5 w-5" />
                  Servicios Empresas
                </a>
              </Button>

              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="https://empordajobs.empleactiva.com/contenido/contacto" target="_blank" rel="noopener noreferrer">
                  <Headset className="h-5 w-5" />
                  Atención Cliente
                </a>
              </Button>

              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="https://empordajobs.empleactiva.com/contenido/ins-neuronmeg-1" target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="h-5 w-5" />
                  Instituto NeuronMeg
                </a>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}