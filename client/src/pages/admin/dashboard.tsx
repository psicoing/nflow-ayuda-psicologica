import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { User, Chat, UserRoles } from "@shared/schema";
import { Redirect } from "wouter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCog, 
  MessageSquare, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Solo permitir acceso a administradores
  if (!user || user.role !== UserRoles.ADMIN) {
    return <Redirect to="/" />;
  }

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: chats, isLoading: isLoadingChats } = useQuery<Chat[]>({
    queryKey: ["/api/admin/chats"],
  });

  const userMutation = useMutation({
    mutationFn: async ({ userId, action, data }: { 
      userId: number; 
      action: string; 
      data?: any 
    }) => {
      await apiRequest("POST", `/api/admin/users/${userId}/${action}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const chatMutation = useMutation({
    mutationFn: async ({ chatId, action, data }: {
      chatId: number;
      action: string;
      data?: any
    }) => {
      await apiRequest("POST", `/api/admin/chats/${chatId}/${action}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chats"] });
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestión de usuarios y moderación de contenido
          </p>
        </div>
      </header>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <UserCog className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="chats" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Activo
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              Inactivo
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => userMutation.mutate({
                                userId: user.id,
                                action: user.isActive ? 'deactivate' : 'activate'
                              })}
                            >
                              {user.isActive ? 'Desactivar' : 'Activar'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => userMutation.mutate({
                                userId: user.id,
                                action: 'promote',
                                data: { role: 'professional' }
                              })}
                              disabled={user.role === 'professional'}
                            >
                              Promover
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Moderación de Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingChats ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Revisado por</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chats?.map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell>{chat.userId}</TableCell>
                        <TableCell>
                          {chat.createdAt ? format(new Date(chat.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {chat.isFlagged && (
                            <Alert variant="destructive">
                              <AlertDescription>
                                {chat.flagReason}
                              </AlertDescription>
                            </Alert>
                          )}
                        </TableCell>
                        <TableCell>
                          {chat.reviewedBy || 'Pendiente'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => chatMutation.mutate({
                                chatId: chat.id,
                                action: 'review',
                                data: { isReviewed: true }
                              })}
                              disabled={chat.isReviewed}
                            >
                              Revisar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => chatMutation.mutate({
                                chatId: chat.id,
                                action: 'flag',
                                data: { 
                                  isFlagged: true,
                                  flagReason: 'Contenido inapropiado' 
                                }
                              })}
                              disabled={chat.isFlagged}
                            >
                              Marcar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}