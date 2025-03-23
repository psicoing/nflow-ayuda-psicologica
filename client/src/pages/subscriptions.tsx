import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, CheckCircle, Shield, FileText, Zap, Crown, Server, Clock } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";

export default function SubscriptionsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="container mx-auto p-4 space-y-6">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Planes de Suscripción
          </h1>
          <p className="text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Plan Gratuito */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Plan Gratuito</CardTitle>
              <CardDescription>Para empezar a explorar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">€0/mes</div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>3 mensajes gratuitos</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>2 recursos de autoayuda</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Soporte básico</span>
                </li>
              </ul>
              <div className="pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Plan actual
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan BÁSICO */}
          <Card className="relative overflow-hidden border-primary shadow-lg">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
              Recomendado
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Plan BÁSICO</CardTitle>
              <CardDescription>Para un apoyo continuo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">€2.99/mes</div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>Mensajes ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Acceso prioritario</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Soporte premium 24/7</span>
                </li>
              </ul>
              <div className="pt-4">
                <button 
                  className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  onClick={() => alert("Funcionalidad de pago en desarrollo")}
                >
                  Actualizar a Plan Básico
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Avanzado */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Plan Avanzado
              </CardTitle>
              <CardDescription>Para usuarios exigentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">€9.99/mes</div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-primary" />
                  <span>Todas las características del plan básico</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Análisis emocional avanzado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Ejercicios personalizados</span>
                </li>
              </ul>
              <div className="pt-4">
                <button 
                  className="w-full py-2 px-4 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  onClick={() => alert("Funcionalidad de pago en desarrollo")}
                >
                  Actualizar a Plan Avanzado
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}