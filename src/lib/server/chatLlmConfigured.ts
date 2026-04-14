/** Whether `/api/chat` can call an upstream model (env on the server). */
export function isChatLlmConfigured(): boolean {
  const gemini = process.env.GEMINI_API_KEY?.trim();
  const openai = process.env.OPENAI_API_KEY?.trim();
  return Boolean(gemini || openai);
}
