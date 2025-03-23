import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { MessageCircle, Brain, Library } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            NFlow Mental Health
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/auth">Iniciar sesión</Link>
            </Button>
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Apoyo emocional cuando lo necesites
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma diseñada para brindarte soporte emocional y recursos para tu bienestar mental
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Chat de Apoyo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Conversaciones privadas con nuestro asistente virtual especializado en apoyo emocional
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Consejos Personalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Recibe consejos adaptados a tus necesidades y situación personal
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Library className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Accede a una biblioteca completa de recursos para tu bienestar emocional
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/auth">Comenzar ahora</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
