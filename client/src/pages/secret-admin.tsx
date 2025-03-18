import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Redirect } from "wouter";

const ADMIN_PASSWORD = "nF#9mK$pL2@vX7"; // Esta contraseña se debe mover a una variable de entorno

export default function SecretAdminPage() {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  if (!user?.role || (user.role !== "admin" && user.role !== "professional")) {
    return <Redirect to="/" />;
  }

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Acceso Restringido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Contraseña de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Acceder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Panel de Administración Secreto</CardTitle>
          </CardHeader>
          <CardContent>
            <p>URL de acceso: https://tu-app.repl.co/admin-secret-panel</p>
            <p>Contraseña actual: {ADMIN_PASSWORD}</p>
            <p className="text-muted-foreground mt-4">
              Esta página es accesible solo para administradores y profesionales autorizados.
              Guarda esta información en un lugar seguro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
