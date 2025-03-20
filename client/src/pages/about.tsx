import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/hamburger-menu";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-4 flex justify-end">
        <HamburgerMenu />
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Quienes Somos
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>EmpordaJobs SL</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert">
            <p>
              EmpordaJobs SL es una empresa dedicada a la selección de talento y desarrollo de soluciones 
              innovadoras para el ámbito laboral. Nos especializamos en conectar empresas con profesionales 
              altamente capacitados, ofreciendo un servicio de selección gratuito con un enfoque en la 
              implementación de la norma ISO 45003, que vela por el bienestar psicológico en el trabajo.
            </p>

            <p>
              Además, proporcionamos formación en inteligencia artificial para empleados y empresas, 
              destacando la IA como una herramienta clave para la optimización de procesos y la mejora 
              del rendimiento organizacional. También desarrollamos IAs personalizadas para empresas, 
              facilitando la gestión del conocimiento interno y la toma de decisiones estratégicas.
            </p>

            <p>
              Con una sólida experiencia en neurociencias, psicología y bioinformática, nuestro enfoque 
              integra el conocimiento humano con la tecnología avanzada, asegurando soluciones eficientes 
              y adaptadas a las necesidades del mercado.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
