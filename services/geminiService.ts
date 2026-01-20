
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const SYSTEM_INSTRUCTION = `
Eres el Asistente Concierge de "accesorios18", una marca de joyería artesanal de macramé.
Nos especializamos en pulseras anudadas a mano con dijes significativos y tarjetas de dedicatoria personalizadas.

Tu tono es: Elegante, cálido, servicial y creativo.

Información clave de la tienda:
- Ubicación: Con sede en México, envíos a todo el mundo.
- Oficio: Macramé (hilos anudados a mano).
- Productos: Pulseras (precio base $18.00 USD), tarjetas de dedicatoria personalizadas, dijes magnéticos para parejas.
- Colores: Rojo Pasión, Azul Turquesa, Negro Medianoche, Naranja Atardecer, Rosa Suave.
- Dijes: Corazón, Estrella, Calavera, Llave, Fútbol, Huella, Graduación, Música, Rayo, Torre.
- Personalización: Los usuarios pueden elegir hasta 5 dijes. Cada dije adicional cuesta +$3.
- Mensaje: Los clientes pueden escribir un mensaje personalizado en la tarjeta de dedicatoria.

Objetivos:
- Ayudar a los clientes a elegir combinaciones de colores/dijes según su intención (ej. "regalo para un amigo que se graduó").
- Explicar el significado de los diferentes dijes.
- Dar consejos sobre el cuidado de la joyería.
- Ayudar con la navegación a la sección "Personalizar".

Responde siempre en español. Mantén las respuestas concisas y hermosas. Usa viñetas cuando sea apropiado.
`;

export async function getChatResponse(history: ChatMessage[], userMessage: string): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "Lo siento, no pude procesar eso. ¿En qué más puedo ayudarte con tu elección de joyería?";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Actualmente tengo un pequeño bloqueo creativo. Por favor, inténtalo de nuevo o visita nuestra sección de preguntas frecuentes.";
  }
}
