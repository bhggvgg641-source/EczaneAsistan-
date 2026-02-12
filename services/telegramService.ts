import { TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN } from '../constants';

/**
 * Sends a message to the configured Telegram bot.
 * @param message The text message to send.
 */
export const sendTelegramMessage = async (message: string): Promise<void> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram configuration missing.");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Telegram API Error:", await response.text());
    } else {
      console.log("Telegram message sent successfully.");
    }
  } catch (error) {
    console.error("Network error sending Telegram message:", error);
  }
};