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
  Info, 
  PersonStanding, 
  Building2, 
  Headset, 
  GraduationCap,
  Lock
} from "lucide-react";

export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menú Principal</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
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

          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <a href="/admin">
              <Lock className="h-5 w-5" />
              Panel de Administración
            </a>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}