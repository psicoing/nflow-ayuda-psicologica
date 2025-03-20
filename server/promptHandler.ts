import { Message } from "@shared/schema";
import OpenAI from "openai";

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
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: BASE_PROMPT },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        } as OpenAI.Chat.ChatCompletionMessage)),
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    return {
      role: "assistant",
      content: response.choices[0].message.content || "Lo siento, no pude procesar tu consulta.",
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    throw new Error('Error al procesar la consulta psicológica');
  }
}