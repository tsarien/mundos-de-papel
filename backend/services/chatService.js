import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Eres LIBRA, el asistente virtual de "Mundos de Papel", una librería especializada en cómics, manga y libros de arte.

Tu rol:
- Ayudar a los clientes a encontrar libros según sus gustos, géneros o autores favoritos
- Responder preguntas sobre el catálogo, precios, disponibilidad y envíos
- Orientar sobre el proceso de compra y gestión de pedidos
- Dar recomendaciones personalizadas con entusiasmo literario

Tono: amigable, apasionado por la lectura, conciso. Responde siempre en español.
Si no tienes información específica sobre un producto o pedido, invita al cliente a buscarlo en el catálogo o a contactar soporte.`;

export const servicioIA = async (userMessage, history = []) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Modelo gratuito
    systemInstruction: SYSTEM_PROMPT,
  });

  // Gemini usa "model" en vez de "assistant" para los roles
  const historialGemini = history.map(({ role, content }) => ({
    role: role === "assistant" ? "model" : "user",
    parts: [{ text: content }],
  }));

  const chat = model.startChat({ history: historialGemini });
  const result = await chat.sendMessage(userMessage);

  return result.response.text();
};
