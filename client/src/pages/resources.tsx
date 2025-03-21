import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Heart, Brain, Footprints, Users, Coffee, Moon, Sun } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const resources = [
  {
    title: "Rutinas Saludables",
    description: "Espacio con consejos prácticos para mejorar la calidad de vida a través de hábitos saludables. Incluye recomendaciones sobre alimentación, sueño, ejercicio y bienestar mental.",
    icon: Coffee,
    color: "text-orange-500"
  },
  {
    title: "Progreso Personal",
    description: "Un diario interactivo donde los usuarios pueden registrar su evolución en su camino hacia el bienestar mental. Se pueden agregar metas, reflexiones y seguimientos personalizados.",
    icon: Footprints,
    color: "text-indigo-500"
  },
  {
    title: "Autocuidado",
    description: "Sección dedicada a prácticas diarias para mejorar la salud mental y emocional. Incluye ejercicios de mindfulness, técnicas de relajación y autocuidado físico y psicológico.",
    icon: Heart,
    color: "text-pink-500"
  },
  {
    title: "Grupos de Apoyo",
    description: "Comunidad virtual donde los usuarios pueden compartir experiencias, recibir apoyo mutuo y participar en foros sobre bienestar mental y emocional.",
    icon: Users,
    color: "text-green-500"
  },
  {
    title: "Ejercicio Mental",
    description: "Actividades y juegos diseñados para mantener la mente activa y saludable. Incluye ejercicios de memoria, lógica y concentración para fortalecer las capacidades cognitivas.",
    icon: Brain,
    color: "text-red-500"
  },
  {
    title: "Meditación Guiada",
    description: "Sesiones de meditación con audios y guías interactivas para reducir el estrés y mejorar la conexión con el presente. Diferentes técnicas según las necesidades del usuario.",
    icon: Moon,
    color: "text-purple-500"
  },
  {
    title: "Ejercicios de Respiración",
    description: "Técnicas de respiración guiadas para ayudar a controlar la ansiedad, mejorar la oxigenación y reducir la tensión emocional y física.",
    icon: Sun,
    color: "text-yellow-500"
  },
  {
    title: "Diario Emocional",
    description: "Herramienta para registrar y analizar emociones diarias. Permite llevar un control del estado emocional a través de entradas escritas y reflexiones guiadas.",
    icon: Book,
    color: "text-blue-500"
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Recursos de Autoayuda
          </h1>
          <p className="text-muted-foreground mt-2">
            Herramientas y recursos para apoyar tu bienestar mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`${resource.color} mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={
                      resource.title === "Rutinas Saludables"
                        ? "/resources/healthy-routines"
                        : resource.title === "Progreso Personal"
                        ? "/resources/personal-progress"
                        : resource.title === "Autocuidado"
                        ? "/resources/self-care"
                        : `#${resource.title.toLowerCase().replace(/\s+/g, '-')}`
                    }>
                      Explorar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}