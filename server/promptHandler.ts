import { Message } from "@shared/schema";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Prompt más simple para empezar
const BASE_PROMPT = `Eres un asistente amable y profesional que ayuda con consultas sobre salud mental.
Tus respuestas deben ser claras, empáticas y basadas en evidencia científica.
Si detectas una situación que requiere atención profesional inmediata, indica esto claramente.`;

export interface ChatResponse {
  role: "assistant";
  content: string;
  timestamp: Date;
}

export async function processUserMessage(userMessage: string, history: Message[]): Promise<ChatResponse> {
  try {
    if (!userMessage.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const messages = [
      { role: "system" as const, content: BASE_PROMPT },
      ...history.map(msg => ({
        role: msg.role as OpenAI.Chat.ChatCompletionRole,
        content: msg.content
      })),
      { role: "user" as const, content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No se recibió respuesta del asistente');
    }

    return {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: new Date()
    };

  } catch (error) {
    console.error('Error en processUserMessage:', error);
    if (error instanceof OpenAI.APIError) {
      throw new Error(`Error de comunicación con el asistente: ${error.message}`);
    }
    throw new Error('Error al procesar tu mensaje: ' + (error as Error).message);
  }
}