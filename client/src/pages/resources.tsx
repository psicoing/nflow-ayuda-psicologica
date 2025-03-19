import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Heart, Brain, Footprints, Users, Coffee, Moon, Sun } from "lucide-react";

const resources = [
  {
    title: "Meditación Guiada",
    description: "Sesiones de meditación para reducir el estrés y la ansiedad",
    icon: Moon,
    color: "text-purple-500"
  },
  {
    title: "Ejercicios de Respiración",
    description: "Técnicas de respiración para momentos de tensión",
    icon: Sun,
    color: "text-yellow-500"
  },
  {
    title: "Diario Emocional",
    description: "Herramienta para registrar y entender tus emociones",
    icon: Book,
    color: "text-blue-500"
  },
  {
    title: "Grupos de Apoyo",
    description: "Comunidad virtual para compartir experiencias",
    icon: Users,
    color: "text-green-500"
  },
  {
    title: "Ejercicio Mental",
    description: "Actividades para mantener tu mente activa y saludable",
    icon: Brain,
    color: "text-red-500"
  },
  {
    title: "Rutinas Saludables",
    description: "Consejos para mantener un estilo de vida equilibrado",
    icon: Coffee,
    color: "text-orange-500"
  },
  {
    title: "Progreso Personal",
    description: "Seguimiento de tu viaje de bienestar mental",
    icon: Footprints,
    color: "text-indigo-500"
  },
  {
    title: "Autocuidado",
    description: "Prácticas diarias para cuidar tu salud mental",
    icon: Heart,
    color: "text-pink-500"
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Recursos de Autoayuda
          </h1>
          <p className="text-muted-foreground mt-2">
            Herramientas y recursos para apoyar tu bienestar mental
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`${resource.color} mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Aquí se pueden agregar más detalles o botones de acción */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
