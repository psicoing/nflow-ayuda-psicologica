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
          ¿Quiénes somos?
        </h1>

        <Card className="prose prose-gray dark:prose-invert">
          <CardContent className="pt-6 space-y-4">
            <p>
              Niflow nace como evolución del Ins NeuronMeg, un centro con más de 32 años de experiencia 
              en el ámbito de la psicología clínica y escolar. Desde su origen en el Empordà, NeuronMeg 
              ha acompañado a personas, familias y comunidades educativas, con una mirada integradora 
              que combina ciencia, tecnología y sensibilidad humana.
            </p>

            <p>
              Estamos colegiados en el Colegio Oficial de Psicología de Cataluña con el número 7851, 
              lo que garantiza un ejercicio profesional riguroso, ético y basado en la evidencia.
            </p>

            <p>
              En la actualidad, como Niflow, ampliamos nuestra acción profesional a través de la formación 
              en inteligencia artificial para empresas y empleados, el desarrollo de IAs personalizadas, 
              y la implementación de la norma ISO 45003, centrada en el bienestar psicológico en entornos 
              laborales. También ofrecemos servicios de selección gratuitos con orientación psicosocial 
              desde el inicio del proceso.
            </p>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Nuestra presencia y estructura actual incluye:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">EmpordaJobs</h3>
                  <p>
                    Plataforma especializada en selección y orientación laboral en el Alt Empordà, 
                    con un modelo ético y gratuito para empresas que se comprometan con el bienestar 
                    de sus equipos. Funciona también como lanzadera de talento local y promotor de 
                    buenas prácticas en salud laboral.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Psicología</h3>
                  <p>
                    Área clínica que continúa el legado del Instituto NeuronMeg, ofreciendo intervención 
                    psicológica en contextos escolares, familiares, individuales y comunitarios. Nuestra 
                    línea de acción combina el acompañamiento terapéutico con la innovación metodológica.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Nflow</h3>
                  <p>
                    Unidad de desarrollo en inteligencia artificial aplicada al bienestar, la educación 
                    y la gestión del conocimiento organizacional. Diseñamos asistentes virtuales, programas 
                    formativos y herramientas digitales adaptadas a cada entorno.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Instituto NeuronMeg</h3>
                  <p>
                    Origen y núcleo clínico del proyecto, especializado en psicología escolar, clínica y 
                    comunitaria, y con una fuerte vocación de servicio público, basada en décadas de 
                    experiencia, investigación y acompañamiento directo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6">
              Nuestro enfoque une el conocimiento humano con la tecnología avanzada, asegurando 
              soluciones eficientes, adaptadas y sostenibles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}