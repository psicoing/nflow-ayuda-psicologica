import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Users, MessageCircle, Flag, Shield } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Link } from "wouter";

const forumTopics = [
  {
    id: "anxiety",
    title: "Manejo de la Ansiedad",
    description: "Comparte estrategias y experiencias sobre el manejo de la ansiedad",
    posts: 24,
    members: 156
  },
  {
    id: "depression",
    title: "Superando la Depresión",
    description: "Un espacio seguro para hablar sobre la depresión y el camino hacia la recuperación",
    posts: 18,
    members: 143
  },
  {
    id: "stress",
    title: "Gestión del Estrés",
    description: "Técnicas y consejos para manejar el estrés diario",
    posts: 31,
    members: 189
  },
  {
    id: "mindfulness",
    title: "Práctica de Mindfulness",
    description: "Aprende y comparte experiencias sobre mindfulness y meditación",
    posts: 15,
    members: 112
  }
];

export default function SupportGroupsPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [activeForumId, setActiveForumId] = useState<string | null>(null);

  const handlePostSubmit = () => {
    // Aquí se implementará la lógica para enviar posts
    console.log("Enviando post:", { content: newPost, isAnonymous });
    setNewPost("");
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
              Grupos de Apoyo
            </h1>
            <p className="text-muted-foreground">
              Un espacio seguro para compartir experiencias y recibir apoyo
            </p>
          </div>
          <Users className="h-10 w-10 text-primary" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Normas de la Comunidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>• Mantén un ambiente respetuoso y de apoyo</p>
            <p>• No compartas información personal sensible</p>
            <p>• Reporta contenido inapropiado</p>
            <p>• Los moderadores están aquí para ayudar</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forumTopics.map((topic) => (
            <Card 
              key={topic.id}
              className={`transition-all hover:shadow-lg cursor-pointer ${
                activeForumId === topic.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveForumId(topic.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{topic.title}</span>
                  <MessageCircle className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{topic.posts} publicaciones</span>
                  <span>{topic.members} miembros</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeForumId && (
          <Card>
            <CardHeader>
              <CardTitle>Nueva Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <label htmlFor="anonymous-mode">Modo anónimo</label>
              </div>
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Comparte tu experiencia..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between">
                <Button variant="outline" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Reportar
                </Button>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                >
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
