import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Heart, MessageCircle, Sparkles } from "lucide-react";

export default function HomePage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-background to-muted">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              NFlow Soporte de Salud Mental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      {...loginForm.register("username")}
                      placeholder="Ingresa tu usuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Usuario</Label>
                    <Input
                      id="reg-username"
                      {...registerForm.register("username")}
                      placeholder="Elige un usuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Contraseña</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      {...registerForm.register("password")}
                      placeholder="Elige una contraseña"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creando cuenta..." : "Registrarse"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex items-center justify-center bg-primary/5 p-8">
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-primary">
            Tu Espacio Seguro para el Bienestar Mental
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <p>Soporte IA Compasivo 24/7</p>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <p>Conversaciones Confidenciales</p>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <p>Recursos Profesionales de Salud Mental</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}