import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function DeactivateAccountDialog() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const deactivateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/user");
    },
    onSuccess: () => {
      toast({
        title: "Cuenta desactivada",
        description: "Tu cuenta ha sido dada de baja correctamente. Esperamos verte pronto de nuevo.",
      });
      // Pequeño retraso para asegurar que el mensaje se muestre antes de la redirección
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "No se pudo dar de baja la cuenta. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Dar de baja mi cuenta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se desactivará tu cuenta y perderás acceso a todos tus datos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deactivateMutation.mutate()}
            disabled={deactivateMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deactivateMutation.isPending ? "Procesando..." : "Dar de baja"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}