import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Brain, Users, Sparkles, Heart, Dumbbell } from "lucide-react";

const services = [
  {
    title: "NFlow – Bienestar Mental y Salud",
    description: "Plataforma digital que permite a empleados y directivos llevar en su bolsillo servicios de salud mental y bienestar. Acceso a herramientas de autoayuda, recursos psicológicos y apoyo profesional inmediato.",
    icon: Heart,
  },
  {
    title: "Selección de Talento",
    description: "Servicio de selección de personal gratuito para empresas. Evaluación de candidatos basada en competencias y bienestar psicológico, siguiendo los principios de la ISO 45003.",
    icon: Users,
  },
  {
    title: "Formación en Inteligencia Artificial",
    description: "Cursos diseñados para empleados y empresas sobre el uso práctico de la IA en el entorno laboral. Formación impartida en las salas de CINC Figueres.",
    icon: Brain,
  },
  {
    title: "Desarrollo de IA Personalizada",
    description: "Creación de IAs internas para mejorar la gestión del conocimiento en las organizaciones. Implementación de asistentes virtuales y optimización de procesos empresariales.",
    icon: Sparkles,
  },
  {
    title: "Consultoría en Bienestar Laboral",
    description: "Aplicación de conocimientos en neurociencia para mejorar la calidad del entorno laboral. Evaluación del impacto del trabajo en la salud mental y diseño de estrategias para aumentar la motivación.",
    icon: Dumbbell,
  },
];

export default function BusinessServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Servicios para Empresas
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            EmpordaJobs SL ofrece soluciones innovadoras en selección de talento, optimización empresarial e integración de inteligencia artificial, con un fuerte enfoque en el bienestar laboral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <IconComponent className="h-8 w-8 text-primary mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
