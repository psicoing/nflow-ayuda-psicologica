import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search, Filter } from "lucide-react";
import { HamburgerMenu } from "@/components/hamburger-menu";
import { Link } from "wouter";
import { useState } from "react";
import 'leaflet/dist/leaflet.css';

// Datos de ejemplo de recursos de salud mental
const mentalHealthResources = [
  {
    id: 1,
    name: "Centro de Bienestar Mental",
    type: "Centro Médico",
    address: "Calle Principal 123",
    coordinates: [41.9794, 2.8214],
    services: ["Terapia Individual", "Grupos de Apoyo", "Evaluación Psicológica"],
    phone: "+34 972 123 456"
  },
  {
    id: 2,
    name: "Clínica de Salud Mental",
    type: "Clínica",
    address: "Avenida Central 456",
    coordinates: [41.9854, 2.8224],
    services: ["Psiquiatría", "Terapia Familiar", "Intervención en Crisis"],
    phone: "+34 972 789 012"
  },
  {
    id: 3,
    name: "Instituto de Bienestar Emocional",
    type: "Instituto",
    coordinates: [41.9774, 2.8194],
    address: "Plaza Mayor 789",
    services: ["Mindfulness", "Terapia Ocupacional", "Rehabilitación"],
    phone: "+34 972 345 678"
  }
];

// Icono personalizado para los marcadores
const customIcon = new Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MentalHealthMapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredResources = mentalHealthResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = Array.from(new Set(mentalHealthResources.map(r => r.type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="p-4 flex justify-between items-center">
        <Link href="/resources" className="flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="h-5 w-5" />
          Volver a Recursos
        </Link>
        <HamburgerMenu />
      </header>

      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Mapa de Recursos de Salud Mental
          </h1>
          <MapPin className="h-8 w-8 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Panel lateral de búsqueda y filtros */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Buscar Recursos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o dirección"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">Filtrar por tipo</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {types.map(type => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredResources.map(resource => (
                  <Card key={resource.id}>
                    <CardContent className="pt-4">
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.address}</p>
                      <p className="text-sm text-primary mt-1">{resource.phone}</p>
                      <div className="mt-2">
                        <span className="text-xs font-medium">Servicios:</span>
                        <ul className="text-xs text-muted-foreground mt-1">
                          {resource.services.map((service, index) => (
                            <li key={index}>• {service}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card className="md:col-span-3 h-[600px]">
            <MapContainer
              center={[41.9794, 2.8214]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredResources.map(resource => (
                <Marker
                  key={resource.id}
                  position={resource.coordinates}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm">{resource.address}</p>
                      <p className="text-sm text-primary">{resource.phone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
