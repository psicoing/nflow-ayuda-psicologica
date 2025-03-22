import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface PayPalSubscriptionButtonProps {
  planId: string;
  amount: string;
}

export function PayPalSubscriptionButton({ planId, amount }: PayPalSubscriptionButtonProps) {
  const [{ isPending, isInitial, isRejected }] = usePayPalScriptReducer();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscription = async (data: any, actions: any) => {
    try {
      console.log('Iniciando creación de suscripción con plan:', planId);
      return actions.subscription.create({
        plan_id: planId,
        application_context: {
          brand_name: "NFlow Mental Health Support",
          user_action: "SUBSCRIBE_NOW",
          shipping_preference: "NO_SHIPPING",
          locale: "es-ES",
          return_url: window.location.origin + "/subscriptions",
          cancel_url: window.location.origin + "/subscriptions"
        }
      });
    } catch (error: any) {
      console.error("Error detallado al crear la suscripción:", {
        error,
        message: error.message,
        details: error.details
      });
      toast({
        title: "Error en la suscripción",
        description: error.message || "No se pudo crear la suscripción. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const onApprove = async (data: any) => {
    try {
      console.log('Suscripción aprobada:', data);
      // Enviar los datos de la suscripción al backend
      await apiRequest("POST", "/api/subscriptions/activate", {
        subscriptionId: data.subscriptionID,
        userId: user?.id
      });

      toast({
        title: "¡Suscripción exitosa!",
        description: "Tu suscripción ha sido activada correctamente.",
      });

      // Recargar la página para actualizar el estado
      window.location.reload();
    } catch (error: any) {
      console.error("Error detallado al activar la suscripción:", {
        error,
        message: error.message,
        details: error.details
      });
      toast({
        title: "Error en la suscripción",
        description: "Hubo un problema al activar tu suscripción. Por favor, contacta con soporte.",
        variant: "destructive",
      });
    }
  };

  const onError = (err: any) => {
    console.error("Error detallado en PayPal:", {
      error: err,
      message: err.message,
      details: err.details
    });
    toast({
      title: "Error en el pago",
      description: err.message || "Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.",
      variant: "destructive",
    });
  };

  if (isRejected) {
    return (
      <div className="text-center p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">
          No se pudo cargar PayPal. Por favor, recarga la página o contacta con soporte.
        </p>
      </div>
    );
  }

  if (isPending || isInitial) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Cargando PayPal...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <PayPalButtons
        createSubscription={handleSubscription}
        onApprove={onApprove}
        onError={onError}
        style={{
          shape: "rect",
          color: "blue",
          layout: "vertical",
          label: "subscribe"
        }}
      />
      <p className="text-xs text-center text-muted-foreground">
        Al suscribirte, aceptas los términos y condiciones del servicio
      </p>
    </div>
  );
}