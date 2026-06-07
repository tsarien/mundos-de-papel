import axios from "axios";

/**
 * @param {string} userMessage
 * @param {Array<{role: string, content: string}>} history
 * @returns {Promise<string>}
 */
export const enviarMensaje = async (userMessage, history = []) => {
  const response = await axios.post("/api/chat", {
    message: userMessage,
    history,
  });

  return response.data.reply;
};
