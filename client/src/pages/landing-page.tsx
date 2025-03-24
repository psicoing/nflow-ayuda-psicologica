import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { MessageCircle, Brain, Library } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="container mx-auto p-4 space-y-6">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            NFlow Mental Health
          </h1>
          <p className="text-lg text-muted-foreground">
            Apoyo emocional cuando lo necesites
          </p>
          <p className="text-sm text-white/70">
            Una plataforma diseñada para brindarte soporte emocional y recursos para tu bienestar mental
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/5 border-white/10">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Chat de Apoyo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Conversaciones privadas con nuestro asistente virtual especializado en apoyo emocional
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/5 border-white/10">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Consejos Personalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Recibe consejos adaptados a tus necesidades y situación personal
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/5 border-white/10">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Library className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Accede a una biblioteca completa de recursos para tu bienestar emocional
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
            <Link href="/auth">Comenzar ahora</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}