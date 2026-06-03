import axios from "axios";

/**
 * Sends a message to the chat API along with the conversation history.
 * @param {string} userMessage - The latest user message
 * @param {Array<{role: string, content: string}>} history - Previous messages in the conversation
 * @returns {Promise<string>} - The assistant's reply text
 */
export const enviarMensaje = async (userMessage, history = []) => {
  const response = await axios.post("/api/chat", {
    message: userMessage,
    history,
  });

  return response.data.reply;
};
