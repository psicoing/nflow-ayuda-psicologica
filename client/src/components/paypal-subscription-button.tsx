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
      return actions.subscription.create({
        plan_id: planId,
        application_context: {
          brand_name: "NFlow Mental Health Support",
          user_action: "SUBSCRIBE_NOW",
          shipping_preference: "NO_SHIPPING",
          locale: "es-ES"
        }
      });
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
      toast({
        title: "Error en la suscripción",
        description: "No se pudo crear la suscripción. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const onApprove = async (data: any) => {
    try {
      // Enviar los datos de la suscripción al backend
      await apiRequest("POST", "/api/subscriptions/activate", {
        subscriptionId: data.subscriptionID,
        userId: user?.id
      });

      toast({
        title: "¡Suscripción exitosa!",
        description: "Tu suscripción ha sido activada correctamente.",
      });
    } catch (error) {
      console.error("Error al activar la suscripción:", error);
      toast({
        title: "Error en la suscripción",
        description: "Hubo un problema al activar tu suscripción. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const onError = (err: any) => {
    console.error("Error en PayPal:", err);
    toast({
      title: "Error en el pago",
      description: "Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.",
      variant: "destructive",
    });
  };

  if (isRejected) {
    return (
      <div className="text-center text-red-500">
        Error al cargar PayPal. Por favor, recarga la página.
      </div>
    );
  }

  if (isPending || isInitial) {
    return <div className="animate-pulse">Cargando PayPal...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
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
    </div>
  );
}