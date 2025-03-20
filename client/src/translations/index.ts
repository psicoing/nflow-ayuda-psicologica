import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido a NFlow Mental Health Support",
      "startChat": "Iniciar Consulta",
      "startChatDesc": "Inicia una conversación con nuestro asistente especializado en psicología clínica y escolar, basado en evidencia científica y guías diagnósticas actualizadas.",
      "mentalHealthTips": "Recursos Terapéuticos",
      "tips": {
        "mindfulness": "Técnicas de atención plena y regulación emocional",
        "sleep": "Higiene del sueño y manejo del estrés",
        "exercise": "Actividad física y bienestar mental",
        "connect": "Habilidades sociales y apoyo psicosocial"
      },
      "resources": "Recursos Profesionales",
      "resourcesList": {
        "crisis": "Línea de crisis: 112 (24/7)",
        "local": "Directorio de servicios de salud mental",
        "selfHelp": "Guías terapéuticas basadas en evidencia",
        "community": "Red de apoyo profesional"
      },
      "chat": {
        "welcome": "Bienvenido al Asistente de Salud Mental NFlow",
        "introduction": "Soy un asistente especializado en psicología clínica y escolar. Mis respuestas se basan en modelos teóricos reconocidos y literatura científica actual. Por favor, ten en cuenta que no soy un reemplazo para la atención profesional presencial.",
        "disclaimer": "Este servicio no sustituye la atención profesional presencial. En caso de emergencia, contacta con servicios de emergencia o profesionales de salud mental.",
        "refineQuestion": "Para brindarte una mejor orientación, ¿podrías proporcionar más detalles sobre tu consulta?",
        "professionalHelp": "Esta situación requiere atención profesional presencial. Te recomiendo consultar con un especialista.",
        "typeMessage": "Describe tu consulta con el mayor detalle posible..."
      },
      "logout": "Cerrar sesión"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to NFlow Mental Health Support",
      "startChat": "Start Consultation",
      "startChatDesc": "Begin a conversation with our specialized clinical and educational psychology assistant, based on scientific evidence and current diagnostic guidelines.",
      "mentalHealthTips": "Therapeutic Resources",
      "tips": {
        "mindfulness": "Mindfulness and emotional regulation techniques",
        "sleep": "Sleep hygiene and stress management",
        "exercise": "Physical activity and mental wellbeing",
        "connect": "Social skills and psychosocial support"
      },
      "resources": "Professional Resources",
      "resourcesList": {
        "crisis": "Crisis helpline: 112 (24/7)",
        "local": "Mental health services directory",
        "selfHelp": "Evidence-based therapeutic guides",
        "community": "Professional support network"
      },
      "chat": {
        "welcome": "Welcome to NFlow Mental Health Assistant",
        "introduction": "I am a specialized assistant in clinical and educational psychology. My responses are based on recognized theoretical models and current scientific literature. Please note that I am not a replacement for in-person professional care.",
        "disclaimer": "This service does not substitute professional in-person care. In case of emergency, contact emergency services or mental health professionals.",
        "refineQuestion": "To provide better guidance, could you provide more details about your inquiry?",
        "professionalHelp": "This situation requires in-person professional attention. I recommend consulting with a specialist.",
        "typeMessage": "Describe your inquiry in as much detail as possible..."
      },
      "logout": "Logout"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    lng: "es",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;