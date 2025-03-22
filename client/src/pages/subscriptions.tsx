import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, CheckCircle, Shield } from "lucide-react";
import { PayPalSubscriptionButton } from "@/components/paypal-subscription-button";

export default function SubscriptionsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Planes de Suscripción
          </h1>
          <p className="text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Plan Gratuito */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Plan Gratuito</CardTitle>
              <CardDescription>Para empezar a explorar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">€0/mes</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  5 mensajes gratuitos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Soporte básico
                </li>
              </ul>
              <div className="w-full max-w-md mx-auto">
                {user?.subscriptionStatus === "inactive" ? (
                  <p className="text-center text-sm text-muted-foreground">Plan actual</p>
                ) : (
                  <p className="text-center text-sm text-primary">Plan básico disponible</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
              Recomendado
            </div>
            <CardHeader>
              <CardTitle>Plan ASEQUIBLE</CardTitle>
              <CardDescription>Para un apoyo continuo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">€2.99/mes</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Mensajes ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Acceso prioritario
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Soporte premium 24/7
                </li>
              </ul>
              {user?.subscriptionStatus !== "active" && (
                <PayPalSubscriptionButton 
                  planId="P-XXXXXXXXXX" // Reemplazar con el ID real del plan de PayPal
                  amount="2.99"
                />
              )}
              {user?.subscriptionStatus === "active" && (
                <p className="text-center text-sm text-primary font-medium">
                  ¡Ya tienes el plan premium activo!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}