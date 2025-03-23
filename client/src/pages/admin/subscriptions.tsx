import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User, Clock, AlertTriangle } from "lucide-react";

interface SubscriptionSummary {
  estado_usuario: string;
  total_usuarios: number;
  total_mensajes: number;
  promedio_mensajes: number;
  usuarios_activos: number;
}

interface UserSubscriptionData {
  id: number;
  username: string;
  subscription_status: string;
  subscription_id: string | null;
  subscription_provider: string | null;
  message_count: number;
  created_at: string;
  estado_usuario: string;
  puede_enviar_mensajes: boolean;
}

interface SubscriptionData {
  users: UserSubscriptionData[];
  summary: SubscriptionSummary[];
}

export default function AdminSubscriptionsPage() {
  const { data, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/admin/subscription-summary"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Suscripciones</h1>
        <Badge variant="outline" className="text-sm">
          Actualizado: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Resumen general */}
      <div className="grid md:grid-cols-3 gap-4">
        {data?.summary.map((stat) => (
          <Card key={stat.estado_usuario} className={
            stat.estado_usuario === 'Límite alcanzado - Requiere suscripción' 
              ? 'border-destructive/50' 
              : ''
          }>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {stat.estado_usuario === 'Límite alcanzado - Requiere suscripción' && (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
                {stat.estado_usuario}
              </CardTitle>
              <CardDescription>
                {stat.usuarios_activos} de {stat.total_usuarios} usuarios activos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  <User className="inline h-4 w-4 mr-1" />
                  Total usuarios:
                </span>
                <span className="font-medium">{stat.total_usuarios}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  <MessageCircle className="inline h-4 w-4 mr-1" />
                  Total mensajes:
                </span>
                <span className="font-medium">{stat.total_mensajes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Promedio:</span>
                <span className="font-medium">{stat.promedio_mensajes} msg/usuario</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista detallada de usuarios */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Detalle de Usuarios</h2>
        <div className="grid gap-4">
          {data?.users.map((user) => (
            <Card key={user.id} className={
              !user.puede_enviar_mensajes ? 'border-destructive/50' : ''
            }>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {!user.puede_enviar_mensajes && (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    {user.username}
                  </span>
                  <Badge variant={user.puede_enviar_mensajes ? "default" : "destructive"}>
                    {user.estado_usuario}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    <MessageCircle className="inline h-4 w-4 mr-1" />
                    Mensajes enviados:
                  </span>
                  <span className={user.message_count >= 3 ? "text-destructive font-medium" : ""}>
                    {user.message_count} / 3
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Registrado:
                  </span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {user.subscription_id && (
                  <div className="text-sm text-muted-foreground mt-2">
                    ID Suscripción: {user.subscription_id}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}