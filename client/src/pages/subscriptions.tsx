import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, CheckCircle, Shield, FileText } from "lucide-react"; // Added FileText import
import { PayPalSubscriptionButton } from "@/components/paypal-subscription-button";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const planId = import.meta.env.VITE_PAYPAL_PLAN_ID;

  if (!planId) {
    console.error('Error: VITE_PAYPAL_PLAN_ID no está configurado');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-4 space-y-6">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Planes de Suscripción
          </h1>
          <p className="text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                {user?.subscriptionStatus === "inactive" ? (
                  <p className="text-center text-sm text-muted-foreground font-medium">
                    Plan actual
                  </p>
                ) : (
                  <p className="text-center text-sm text-primary">
                    Plan básico disponible
                  </p>
                )}
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
                {!planId ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      El sistema de pagos está en proceso de verificación. 
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Estaremos activando las suscripciones muy pronto.
                    </p>
                  </div>
                ) : user?.subscriptionStatus === "active" ? (
                  <p className="text-center text-sm text-primary font-medium">
                    ¡Ya tienes el plan premium activo!
                  </p>
                ) : (
                  <PayPalSubscriptionButton 
                    planId={planId}
                    amount="2.99"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}