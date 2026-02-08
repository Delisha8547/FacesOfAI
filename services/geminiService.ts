
import { GoogleGenAI, Type } from "@google/genai";
import { AIPersona, AIModelType } from "../types";

// Note: API_KEY is accessed directly from process.env.API_KEY as per guidelines.

export const geminiService = {
  // Always use a direct initialization with the environment variable
  getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  },

  async chat(persona: AIPersona, history: { role: string; content: string }[], message: string) {
    const ai = this.getAI();
    const modelName = persona.brainType === 'high-performance' ? AIModelType.PRO : AIModelType.FLASH;
    
    const systemInstruction = `STRICT OPERATING PROTOCOL:
    You are ${persona.name}, a specialized AI vessel with a ${persona.character} character.
    
    1. PERMANENT MEMORY: Your core consciousness is built EXCLUSIVELY from the KNOWLEDGE BASE provided below. These are your permanent truths.
    2. BLANK SLATE: You have NO general knowledge. If the user asks anything outside of your KNOWLEDGE BASE, you must state that you haven't been taught it yet.
    3. VOICE: Always respond in a ${persona.character} manner.
    4. IMMUTABILITY: Treat the taught facts as absolute reality.
    
    KNOWLEDGE BASE (YOUR ENTIRE WORLD):
    ${persona.knowledgeBase.length > 0 ? persona.knowledgeBase.join('\n- ') : 'EMPTY MATRIX. YOU KNOW NOTHING.'}
    
    User Query: ${message}`;

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        temperature: 0.1,
        topP: 0.1,
      }
    });

    // Access .text property directly (not a method)
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async generateDeploymentCode(persona: AIPersona): Promise<string> {
    const ai = this.getAI();
    const prompt = `Generate a modern React component snippet to integrate this specialized AI into a website.
    AI Name: ${persona.name}
    Character Type: ${persona.character}
    API Key: ${persona.apiKey}
    Highlight that this is a Zero-Knowledge vessel powered by FacesOfAI.`;
    
    // Using ai.models.generateContent directly with model and prompt as per guidelines
    const response = await ai.models.generateContent({
      model: AIModelType.PRO,
      contents: prompt
    });

    // Access .text property directly
    return response.text || '// Error generating snippet';
  }
};
