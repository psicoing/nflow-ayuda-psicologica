import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, Flower2, Sparkles } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Link } from "wouter";

const gratitudePrompts = [
  "¿Qué te hizo sonreír hoy?",
  "¿Qué persona te ayudó recientemente?",
  "¿Qué momento especial viviste esta semana?",
  "¿Qué habilidad tuya te enorgullece?",
  "¿Qué experiencia te hizo crecer como persona?"
];

const selfAffirmations = [
  "Soy capaz de superar cualquier desafío",
  "Merezco amor y respeto",
  "Cada día me hago más fuerte",
  "Mi bienestar es una prioridad",
  "Confío en mi capacidad de crecer"
];

const stretchingExercises = [
  {
    name: "Estiramiento de cuello",
    description: "Inclina suavemente la cabeza hacia un lado durante 10 segundos",
    duration: "30 segundos"
  },
  {
    name: "Rotación de hombros",
    description: "Realiza círculos suaves con los hombros, adelante y atrás",
    duration: "1 minuto"
  },
  {
    name: "Flexión de muñecas",
    description: "Estira y flexiona las muñecas en todas direcciones",
    duration: "30 segundos"
  }
];

export default function SelfCarePage() {
  const [gratitudeEntry, setGratitudeEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [selectedAffirmation, setSelectedAffirmation] = useState("");
  const [practiceLog, setPracticeLog] = useState("");

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % gratitudePrompts.length);
    setGratitudeEntry("");
  };

  const saveGratitudeEntry = () => {
    // Aquí se implementará la lógica para guardar la entrada
    console.log("Guardando entrada de gratitud:", gratitudeEntry);
    nextPrompt();
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
              Autocuidado
            </h1>
            <p className="text-muted-foreground">
              Dedica un momento para cuidar tu bienestar emocional y físico
            </p>
          </div>
          <Heart className="h-10 w-10 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diario de Gratitud */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flower2 className="h-5 w-5" />
                Diario de Gratitud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">{gratitudePrompts[currentPrompt]}</p>
              <Textarea
                value={gratitudeEntry}
                onChange={(e) => setGratitudeEntry(e.target.value)}
                placeholder="Escribe tu reflexión aquí..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={nextPrompt}>
                  Siguiente pregunta
                </Button>
                <Button onClick={saveGratitudeEntry} disabled={!gratitudeEntry}>
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Autoafirmaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Autoafirmaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {selfAffirmations.map((affirmation, index) => (
                  <Button
                    key={index}
                    variant={selectedAffirmation === affirmation ? "default" : "outline"}
                    onClick={() => setSelectedAffirmation(affirmation)}
                    className="justify-start"
                  >
                    {affirmation}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estiramientos y Automasajes */}
          <Card>
            <CardHeader>
              <CardTitle>Guía de Estiramientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stretchingExercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {exercise.description}
                    </p>
                    <p className="text-sm text-primary mt-2">
                      Duración: {exercise.duration}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registro de Prácticas */}
          <Card>
            <CardHeader>
              <CardTitle>Registro de Prácticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="¿Qué práctica de autocuidado realizaste hoy?"
                value={practiceLog}
                onChange={(e) => setPracticeLog(e.target.value)}
              />
              <Button className="w-full" disabled={!practiceLog}>
                Registrar Práctica
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
