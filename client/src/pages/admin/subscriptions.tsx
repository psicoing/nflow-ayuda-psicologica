import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export default function AdminSubscriptionsPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estado de Suscripciones</h1>
      
      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{user.username}</span>
                <Badge variant={user.subscriptionStatus === "active" ? "default" : "secondary"}>
                  {user.subscriptionStatus === "active" ? "Suscrito" : "No suscrito"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">ID de Suscripción:</span>{" "}
                {user.subscriptionId || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Proveedor:</span>{" "}
                {user.subscriptionProvider || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Mensajes enviados:</span>{" "}
                {user.messageCount}
              </div>
              <div>
                <span className="font-medium">Fecha de registro:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
