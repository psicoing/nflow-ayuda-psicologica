import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
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
  },
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
      "logout": "Cerrar sesión"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue",
      "startChat": "Démarrer une conversation",
      "startChatDesc": "Commencez une conversation de soutien avec notre assistant IA en santé mentale.",
      "mentalHealthTips": "Conseils de santé mentale",
      "tips": {
        "mindfulness": "Pratiquez la pleine conscience quotidiennement",
        "sleep": "Maintenez un horaire de sommeil régulier",
        "exercise": "Faites de l'exercice régulièrement",
        "connect": "Restez en contact avec vos proches"
      },
      "resources": "Ressources",
      "resourcesList": {
        "crisis": "Ligne d'urgence: 112",
        "local": "Services locaux de santé mentale",
        "selfHelp": "Guides d'auto-assistance",
        "community": "Groupes de soutien communautaire"
      },
      "logout": "Déconnexion"
    }
  },
  ca: {
    translation: {
      "welcome": "Benvingut",
      "startChat": "Iniciar Xat",
      "startChatDesc": "Comença una conversa de suport amb el nostre assistent d'IA per a la salut mental.",
      "mentalHealthTips": "Consells de Salut Mental",
      "tips": {
        "mindfulness": "Practica l'atenció plena diàriament",
        "sleep": "Mantén un horari regular de son",
        "exercise": "Fes exercici regularment",
        "connect": "Mantén el contacte amb els éssers estimats"
      },
      "resources": "Recursos",
      "resourcesList": {
        "crisis": "Línia de crisis: 112",
        "local": "Serveis locals de salut mental",
        "selfHelp": "Guies d'autoajuda",
        "community": "Grups de suport comunitari"
      },
      "logout": "Tancar sessió"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // idioma por defecto
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
