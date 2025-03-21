import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Smile, Meh, Frown, Target, BookText } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Link } from "wouter";

const moodOptions = [
  { icon: Smile, label: "Positivo", value: 3, color: "text-green-500" },
  { icon: Meh, label: "Neutral", value: 2, color: "text-yellow-500" },
  { icon: Frown, label: "Negativo", value: 1, color: "text-red-500" },
];

export default function PersonalProgressPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [diaryEntry, setDiaryEntry] = useState("");
  const [goal, setGoal] = useState("");

  const handleSaveEntry = () => {
    // Aquí se implementará la lógica para guardar la entrada del diario
    console.log("Guardando entrada:", { mood: selectedMood, entry: diaryEntry });
  };

  const handleSaveGoal = () => {
    // Aquí se implementará la lógica para guardar la meta
    console.log("Guardando meta:", goal);
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
              Progreso Personal
            </h1>
            <p className="text-muted-foreground">
              Registra tu evolución y establece metas para tu bienestar
            </p>
          </div>
          <BookText className="h-10 w-10 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registro de Estado de Ánimo */}
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo te sientes hoy?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around mb-4">
                {moodOptions.map((mood) => {
                  const MoodIcon = mood.icon;
                  return (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "ghost"}
                      className="flex-col gap-2"
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <MoodIcon className={`h-8 w-8 ${mood.color}`} />
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Entrada de Diario */}
          <Card>
            <CardHeader>
              <CardTitle>Diario Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="¿Qué te gustaría reflexionar hoy?"
                value={diaryEntry}
                onChange={(e) => setDiaryEntry(e.target.value)}
                className="min-h-[150px]"
              />
              <Button 
                className="w-full"
                onClick={handleSaveEntry}
                disabled={!selectedMood || !diaryEntry}
              >
                Guardar Entrada
              </Button>
            </CardContent>
          </Card>

          {/* Establecimiento de Metas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas Personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Define una nueva meta..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSaveGoal}
                disabled={!goal}
              >
                Establecer Meta
              </Button>
            </CardContent>
          </Card>

          {/* Gráfico de Progreso */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Evolución</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Aquí se mostrará un gráfico con tu progreso emocional
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
