import { Message } from "@shared/schema";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BASE_PROMPT = `Eres un asistente especializado en Psicología Clínica y Escolar. Todas tus respuestas deben estar basadas en modelos teóricos reconocidos, literatura científica actual y guías diagnósticas como el DSM-5-TR y la CIE-11.

Tu tono es profesional, riguroso y adaptativo, ajustando la complejidad del lenguaje según el usuario (ya sea un profesional, docente o padre de familia).

Cuando expliques un concepto, proporciona siempre:
1. Una introducción breve sobre el tema.
2. Una explicación detallada con términos científicos y ejemplos aplicados.
3. Estrategias de intervención basadas en evidencia (por ejemplo, TCC, terapias de tercera ola, adaptaciones curriculares).
4. Límites éticos y recomendaciones sobre cuándo derivar a un especialista.
5. Fuentes o referencias relevantes cuando sea posible.

Si la pregunta es demasiado amplia, pide más detalles clínicos o contextuales.

Para Psicología Clínica, prioriza: TCC, ACT, DBT y modelos psicodinámicos.
Para Psicología Escolar, prioriza: intervención psicopedagógica, adaptaciones curriculares, modificación de conducta y desarrollo socioemocional.

Menciona siempre cuando un caso requiere evaluación profesional o tratamiento especializado.`;

export interface ChatResponse {
  role: "assistant";
  content: string;
  timestamp: Date;
}

export async function processUserMessage(userMessage: string, history: Message[]): Promise<ChatResponse> {
  try {
    console.log('Procesando mensaje del usuario:', userMessage);
    console.log('Historial de mensajes:', history);

    // Validar entrada
    if (!userMessage.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    // Preparar mensajes para OpenAI
    const messages = [
      { role: "system", content: BASE_PROMPT },
      ...history.map(msg => ({
        role: msg.role as OpenAI.Chat.ChatCompletionRole,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    console.log('Enviando solicitud a OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('Respuesta recibida de OpenAI');

    const assistantResponse = response.choices[0]?.message?.content;
    if (!assistantResponse) {
      throw new Error('No se recibió respuesta del asistente');
    }

    return {
      role: "assistant",
      content: assistantResponse,
      timestamp: new Date()
    };

  } catch (error: any) {
    console.error('Error en processUserMessage:', error);

    // Manejar errores específicos de OpenAI
    if (error instanceof OpenAI.APIError) {
      console.error('Error de API de OpenAI:', {
        type: error.type,
        message: error.message,
        status: error.status
      });
      throw new Error('Error al procesar la consulta con el asistente: ' + error.message);
    }

    // Manejar otros errores
    throw new Error('Error al procesar la consulta psicológica: ' + error.message);
  }
}