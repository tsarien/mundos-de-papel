import { servicioIA } from "../services/chatService.js";

export const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "El mensaje no puede estar vacío" });
  }

  try {
    const reply = await servicioIA(message, history);

    res.json({ reply });
  } catch (error) {
    console.error("Error en el chat:", error.message);
    res.status(500).json({ message: "Error al procesar el mensaje" });
  }
};
