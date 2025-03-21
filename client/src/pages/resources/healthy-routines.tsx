import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Coffee, Bell, ArrowLeft } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Link } from "wouter";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const healthyHabits = [
  {
    id: "sleep",
    title: "Dormir 8 horas",
    description: "Mantener un horario regular de sueño",
    tip: "Evita las pantallas 1 hora antes de dormir"
  },
  {
    id: "exercise",
    title: "Ejercicio diario",
    description: "30 minutos de actividad física",
    tip: "Empieza con caminatas cortas y aumenta gradualmente"
  },
  {
    id: "water",
    title: "Beber agua",
    description: "8 vasos de agua al día",
    tip: "Mantén una botella de agua cerca de tu escritorio"
  },
  {
    id: "meditation",
    title: "Meditación",
    description: "10 minutos de mindfulness",
    tip: "Usa apps de meditación guiada para empezar"
  },
  {
    id: "nutrition",
    title: "Alimentación balanceada",
    description: "Incluir frutas y verduras en cada comida",
    tip: "Prepara tus comidas con anticipación"
  }
];

export default function HealthyRoutinesPage() {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleHabit = (habitId: string) => {
    setCompletedHabits(current =>
      current.includes(habitId)
        ? current.filter(id => id !== habitId)
        : [...current, habitId]
    );
  };

  const toggleNotifications = () => {
    // Aquí se implementaría la lógica real de notificaciones
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <header className="flex justify-between items-center mb-8">
        <Link href="/resources" className="flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="h-5 w-5" />
          Volver a Recursos
        </Link>
        <HamburgerMenu />
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Rutinas Saludables
            </h1>
            <p className="text-muted-foreground">
              Desarrolla hábitos positivos para tu bienestar
            </p>
          </div>
          <Coffee className="h-10 w-10 text-primary" />
        </div>

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={toggleNotifications}
        >
          <Bell className="h-4 w-4" />
          {notificationsEnabled ? "Desactivar notificaciones" : "Activar notificaciones"}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Seguimiento de Hábitos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Estado</TableHead>
                  <TableHead>Hábito</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Consejo del día</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthyHabits.map(habit => (
                  <TableRow key={habit.id}>
                    <TableCell>
                      <Checkbox
                        checked={completedHabits.includes(habit.id)}
                        onCheckedChange={() => toggleHabit(habit.id)}
                        id={habit.id}
                      />
                    </TableCell>
                    <TableCell>{habit.title}</TableCell>
                    <TableCell>{habit.description}</TableCell>
                    <TableCell className="text-muted-foreground">{habit.tip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">
                {completedHabits.length}/{healthyHabits.length}
              </div>
              <p className="text-muted-foreground">
                hábitos completados hoy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
