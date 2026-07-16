import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing. Please configure it in your Settings > Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Robust wrapper to call Gemini generateContent with automatic retry and model fallback.
 * If 503/429/high demand or other transient errors occur, we retry,
 * and if retries are exhausted, we fallback to gemini-3.1-flash-lite.
 */
export async function generateContentWithRetry(params: any, maxRetries = 2, delayMs = 1500) {
  const modelsToTry = [params.model || 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  
  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
    const currentModel = modelsToTry[mIdx];
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Calling Gemini with model: ${currentModel} (Attempt ${attempt + 1}/${maxRetries + 1})`);
        const ai = getAi();
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel,
        });
        return response;
      } catch (error: any) {
        console.error(`Gemini call failed on model ${currentModel}, attempt ${attempt + 1}:`, error);
        
        const isUnavailable = 
          error?.status === 503 || 
          error?.status === 429 || 
          error?.code === 503 ||
          error?.code === 429 ||
          error?.statusCode === 503 ||
          error?.statusCode === 429 ||
          (error?.message && (
            error.message.includes('503') || 
            error.message.includes('429') || 
            error.message.includes('high demand') || 
            error.message.includes('UNAVAILABLE') ||
            error.message.includes('resource exhausted')
          ));

        if (isUnavailable) {
          if (attempt < maxRetries) {
            console.warn(`Retrying in ${delayMs}ms due to transient error...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          // Out of retries for this model, try next model if available
          if (mIdx < modelsToTry.length - 1) {
            console.warn(`Model ${currentModel} exhausted retries. Switching to fallback model: ${modelsToTry[mIdx + 1]}`);
            break; // Break retry loop, moves to next model in modelsToTry
          }
        }
        // If it's some other non-transient error, or we ran out of options entirely
        throw error;
      }
    }
  }
  throw new Error("All attempts and fallback models exhausted for Gemini generation.");
}
