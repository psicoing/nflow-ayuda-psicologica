import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { 
  UserCog, 
  MessageSquare, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Users,
  Mail,
  Calendar,
  Clock,
  FileText
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

  // Calcular estadísticas
  const stats = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.isActive).length || 0,
    totalChats: chats?.length || 0,
    flaggedChats: chats?.filter(c => c.isFlagged).length || 0,
    professionalUsers: users?.filter(u => u.role === UserRoles.PROFESSIONAL).length || 0
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestión y monitoreo del sistema
          </p>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chats Monitoreados
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.flaggedChats} marcados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Profesionales
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professionalUsers}</div>
          </CardContent>
        </Card>
      </div>

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
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra los usuarios y sus permisos
              </CardDescription>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === UserRoles.ADMIN ? "destructive" : 
                                       user.role === UserRoles.PROFESSIONAL ? "default" : 
                                       "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
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
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm') : 'N/A'}
                          </div>
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
              <CardDescription>
                Monitorea y modera las conversaciones
              </CardDescription>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Mensajes</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Revisado por</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chats?.map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell className="font-mono">{chat.id}</TableCell>
                        <TableCell>{chat.userId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {chat.createdAt ? format(new Date(chat.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{chat.messages?.length || 0} mensajes</TableCell>
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

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Registro de Actividades
              </CardTitle>
              <CardDescription>
                Historial de acciones administrativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Los registros de actividad se cargarán aquí */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}