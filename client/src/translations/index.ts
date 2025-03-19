import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido",
      "startChat": "Iniciar Chat",
      "startChatDesc": "Comienza una conversación de apoyo con nuestro asistente de IA para salud mental.",
      "mentalHealthTips": "Consejos de Salud Mental",
      "tips": {
        "mindfulness": "Practica la atención plena diariamente",
        "sleep": "Mantén un horario regular de sueño",
        "exercise": "Haz ejercicio regularmente",
        "connect": "Mantén el contacto con seres queridos"
      },
      "resources": "Recursos",
      "resourcesList": {
        "crisis": "Línea de crisis: 112",
        "local": "Servicios locales de salud mental",
        "selfHelp": "Guías de autoayuda",
        "community": "Grupos de apoyo comunitario"
      },
      "logout": "Cerrar sesión",
      "adminPanel": {
        "title": "Panel de Administración",
        "pendingReviews": "Revisiones Pendientes",
        "reviewedChats": "Chats Revisados",
        "noChatsToReview": "No hay chats para revisar",
        "chatSession": "Sesión de Chat",
        "user": "Usuario",
        "assistant": "Asistente",
        "approve": "Aprobar",
        "flag": "Marcar"
      }
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "startChat": "Start a Chat",
      "startChatDesc": "Begin a supportive conversation with our AI mental health assistant.",
      "mentalHealthTips": "Mental Health Tips",
      "tips": {
        "mindfulness": "Practice mindfulness daily",
        "sleep": "Maintain a regular sleep schedule",
        "exercise": "Exercise regularly",
        "connect": "Stay connected with loved ones"
      },
      "resources": "Resources",
      "resourcesList": {
        "crisis": "Crisis helpline: 112",
        "local": "Local mental health services",
        "selfHelp": "Self-help guides",
        "community": "Community support groups"
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
    lng: "es", // idioma por defecto
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;