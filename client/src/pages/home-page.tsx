import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, MessageCircle, Library, LogOut, Menu, Info, PersonStanding, Building2, Globe, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/language-selector";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-6xl mx-auto p-4 space-y-6 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-center sm:text-left">
            Bienvenido, {user?.username}
          </h1>
          <div className="flex items-center gap-2">
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
                    <Link href="/about">
                      <Info className="h-5 w-5" />
                      Quienes somos
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/services/personal">
                      <PersonStanding className="h-5 w-5" />
                      Servicios Personas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/services/business">
                      <Building2 className="h-5 w-5" />
                      Servicios Empresas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/language">
                      <Globe className="h-5 w-5" />
                      Idiomas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/subscriptions">
                      <CreditCard className="h-5 w-5" />
                      Suscripciones
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Iniciar Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comienza una conversación con nuestro asistente virtual
              </p>
              <Link href="/chat">
                <Button className="w-full">Comenzar Chat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Consejos de Salud Mental
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Practica la atención plena diariamente</li>
                <li>Mantén un horario regular de sueño</li>
                <li>Realiza ejercicio físico regularmente</li>
                <li>Mantén conexiones sociales saludables</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Líneas de crisis 24/7</li>
                <li>Recursos locales de ayuda</li>
                <li>Guías de autoayuda</li>
                <li>Grupos de apoyo comunitario</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}