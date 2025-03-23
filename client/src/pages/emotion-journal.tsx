import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmotionJournal, insertEmotionJournalSchema } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, PenIcon, HeartIcon, RefreshCwIcon } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const EMOTION_CODES = {
  "🔥": "Pasión",
  "🌫️": "Confusión",
  "🌱": "Renacer",
  "💪": "Fortaleza",
  "😔": "Tristeza",
  "✨": "Inspiración",
  "❤️": "Amor",
  "😊": "Felicidad"
};

export default function EmotionJournalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertEmotionJournalSchema),
    defaultValues: {
      weekStart: new Date(),
      mainThought: "",
      dominantEmotion: "",
      actionTaken: "",
      content: "",
      emotionCodes: []
    }
  });

  const { data: journals, isLoading } = useQuery<EmotionJournal[]>({
    queryKey: ["/api/emotion-journals"],
  });

  const createJournalMutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/emotion-journals", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Entrada creada",
        description: "Tu reflexión ha sido guardada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/emotion-journals"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: typeof form.getValues) => {
    createJournalMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Diario Emocional</h1>
        <p className="text-muted-foreground">
          Reflexiona sobre tus emociones y experiencias
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nueva Entrada</CardTitle>
              <CardDescription>
                Comparte tus pensamientos y emociones de la semana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mainThought"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>💭 Pensamiento central</FormLabel>
                    <FormControl>
                      <Input placeholder="¿Qué idea destaca en tu mente hoy?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dominantEmotion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>❤️ Emoción dominante</FormLabel>
                    <FormControl>
                      <Input placeholder="¿Qué emoción prevalece?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>🔁 Acción tomada</FormLabel>
                    <FormControl>
                      <Input placeholder="¿Qué acción tomaste al respecto?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reflexión</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Comparte una breve reflexión o haiku sobre tu experiencia..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emotionCodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Códigos emocionales</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(EMOTION_CODES).map(([emoji, name]) => (
                        <Button
                          key={emoji}
                          type="button"
                          variant={field.value.includes(emoji) ? "default" : "outline"}
                          className="text-lg"
                          onClick={() => {
                            const value = field.value || [];
                            const newValue = value.includes(emoji)
                              ? value.filter(v => v !== emoji)
                              : [...value, emoji];
                            field.onChange(newValue);
                          }}
                        >
                          {emoji} {name}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={createJournalMutation.isPending}
              >
                {createJournalMutation.isPending ? (
                  <>
                    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <PenIcon className="mr-2 h-4 w-4" />
                    Guardar entrada
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Entradas anteriores</h2>
        <div className="grid gap-4">
          {journals?.map((journal) => (
            <Card key={journal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    <CalendarIcon className="inline-block mr-2 h-5 w-5" />
                    {format(new Date(journal.weekStart), "PPP", { locale: es })}
                  </CardTitle>
                  <div className="flex gap-1">
                    {journal.emotionCodes?.map((code) => (
                      <span key={code} className="text-xl" title={EMOTION_CODES[code]}>
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">💭 Pensamiento central</p>
                  <p className="text-muted-foreground">{journal.mainThought}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">❤️ Emoción dominante</p>
                  <p className="text-muted-foreground">{journal.dominantEmotion}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">🔁 Acción tomada</p>
                  <p className="text-muted-foreground">{journal.actionTaken}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Reflexión</p>
                  <p className="text-muted-foreground whitespace-pre-line">{journal.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
