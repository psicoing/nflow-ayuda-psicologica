import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Brain, Users, Zap, Heart, Lightbulb, School } from "lucide-react";

const services = [
  {
    title: "Evaluación y Modulación Neurofrecuencial",
    description: "Análisis avanzado de neurofrecuencias para detectar desajustes en la actividad cerebral. Programas personalizados de modulación neurofrecuencial para optimizar la conectividad neuronal.",
    icon: Brain,
  },
  {
    title: "Psicología Clínica y Escolar",
    description: "Evaluación y tratamiento de trastornos emocionales, del aprendizaje y del comportamiento en niños y adolescentes. Rehabilitación neurocognitiva basada en principios de neuroplasticidad.",
    icon: Heart,
  },
  {
    title: "Plataforma NFlow",
    description: "Acceso a herramientas de autoayuda y asesoramiento profesional desde el móvil. Programas de entrenamiento cognitivo personalizados según el perfil neurocognitivo del usuario.",
    icon: Zap,
  },
  {
    title: "Formación en Neurociencias",
    description: "Cursos especializados en neurociencias aplicadas a la educación, la psicología y la salud. Programas de capacitación para profesionales y centros educativos.",
    icon: School,
  },
  {
    title: "Consultoría en Bienestar",
    description: "Evaluación del impacto del entorno en la salud mental. Diseño de estrategias para mejorar la productividad y reducir el estrés.",
    icon: Users,
  },
  {
    title: "Investigación y Desarrollo",
    description: "Estudio y desarrollo de nuevos modelos de intervención neurocognitiva. Aplicación de tecnologías avanzadas para el diagnóstico y tratamiento de trastornos neurológicos.",
    icon: Lightbulb,
  },
];

export default function PersonalServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Instituto NEURONMEG
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Una iniciativa de vanguardia que combina neurociencias, tecnología y bienestar para ofrecer soluciones innovadoras en el ámbito de la salud mental y la optimización cognitiva.
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
