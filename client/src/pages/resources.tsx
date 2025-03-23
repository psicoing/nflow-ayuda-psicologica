import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Heart, Brain, Footprints, Users, Coffee, Moon, Sun, Map } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertEmotionJournalSchema, type InsertEmotionJournal } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    color: "text-blue-500",
    route: "/resources#diario-emocional"
  },
  {
    title: "Mapa de Recursos",
    description: "Un mapa interactivo que muestra los recursos de salud mental disponibles en tu área.",
    icon: Map,
    color: "text-teal-500"
  }
];

const EmotionJournalForm = () => {
  const { toast } = useToast();
  const form = useForm<InsertEmotionJournal>({
    resolver: zodResolver(insertEmotionJournalSchema),
    defaultValues: {
      weekStart: new Date().toISOString(),
      mainThought: "",
      dominantEmotion: "",
      actionTaken: "",
      content: "",
      emotionCodes: []
    }
  });

  const createJournalMutation = useMutation({
    mutationFn: async (data: InsertEmotionJournal) => {
      const response = await fetch("/api/emotion-journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Error al crear la entrada");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emotion-journals"] });
      toast({
        title: "Entrada creada",
        description: "Tu reflexión ha sido guardada exitosamente.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertEmotionJournal) => {
    createJournalMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">💭 Pensamiento central</label>
            <Input {...form.register("mainThought")} placeholder="¿Qué idea predomina hoy?" />
          </div>
          <div>
            <label className="text-sm font-medium">❤️ Emoción dominante</label>
            <Input {...form.register("dominantEmotion")} placeholder="¿Qué emoción resalta?" />
          </div>
          <div>
            <label className="text-sm font-medium">🔁 Acción tomada</label>
            <Input {...form.register("actionTaken")} placeholder="¿Qué hiciste al respecto?" />
          </div>
          <div>
            <label className="text-sm font-medium">Reflexión</label>
            <Textarea 
              {...form.register("content")} 
              placeholder="Escribe tu reflexión aquí (tipo haiku o 2-3 líneas)"
              className="h-24"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Códigos emocionales</label>
            <Input 
              {...form.register("emotionCodes")} 
              placeholder="🔥 pasión, 🌫️ confusión, 🌱 renacer (separados por comas)"
            />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={createJournalMutation.isPending}
        >
          {createJournalMutation.isPending ? "Guardando..." : "Guardar entrada"}
        </Button>
      </form>
    </Form>
  );
};

export default function ResourcesPage() {
  const [location] = useLocation();
  const [showEmotionJournal, setShowEmotionJournal] = useState(false);

  useEffect(() => {
    if (location.includes("#diario-emocional")) {
      setShowEmotionJournal(true);
    }
  }, [location]);

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
              <Card 
                key={index} 
                className="transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => {
                  if (resource.route === "/resources#diario-emocional") {
                    setShowEmotionJournal(true);
                  }
                }}
              >
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
                    <Link href={resource.route || "#"}>
                      Explorar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showEmotionJournal && (
          <div className="mt-12 max-w-2xl mx-auto" id="diario-emocional">
            <Card>
              <CardHeader>
                <CardTitle>Diario Emocional</CardTitle>
                <CardDescription>
                  Registra tus emociones y reflexiones del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionJournalForm />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}