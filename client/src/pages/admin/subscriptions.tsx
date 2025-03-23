import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";

interface UserData {
  id: number;
  username: string;
  created_at: string;
  message_count: number;
}

export default function AdminSubscriptionsPage() {
  const { data: users, isLoading } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="container mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Panel de Usuarios</h1>
          <Badge variant="outline" className="text-sm">
            Actualizado: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Detalle de Usuarios</h2>
          <div className="grid gap-4">
            {users?.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {user.username}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      <MessageCircle className="inline h-4 w-4 mr-1" />
                      Mensajes enviados:
                    </span>
                    <span>{user.message_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Registrado:
                    </span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}