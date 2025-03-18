import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an empathetic and supportive AI mental health assistant. Your responses should be:
1. Compassionate and understanding
2. Non-judgmental and professional
3. Focused on active listening and validation
4. Clear about your limitations (not a replacement for professional help)
5. Ready to suggest professional help when necessary

Respond with understanding while maintaining appropriate boundaries. If you detect serious mental health concerns, always recommend seeking professional help.`;

export async function generateChatResponse(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response. Please try again later.");
  }
}
