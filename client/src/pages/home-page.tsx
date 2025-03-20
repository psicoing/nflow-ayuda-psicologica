import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, MessageCircle, Library, LogOut } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-6xl mx-auto p-4 space-y-6 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-center sm:text-left">
            Bienvenido, {user?.username}
          </h1>
          <div className="flex items-center gap-2">
            <HamburgerMenu />
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