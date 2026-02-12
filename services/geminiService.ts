import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// NOTE: Ideally, the API key should come from a secure backend or environment variable. 
// For this client-side demo as requested, ensure the key is available in the build environment.

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Gemini API Key is missing.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

/**
 * Classifies a medicine using Gemini models.
 * @param medicineName Name of the medicine.
 * @returns The predicted category in Turkish.
 */
export const classifyMedicineWithGemini = async (medicineName: string): Promise<string> => {
  if (!ai) {
    return "API Anahtarı Eksik - Sınıflandırma Yapılamadı";
  }

  try {
    const prompt = `
      Sen uzman bir eczacı asistanısın. Görevin, verilen ilaç ismine göre ilacı sınıflandırmaktır.
      
      İlaç İsmi: "${medicineName}"

      Lütfen bu ilacın genel kullanım amacını TÜRKÇE olarak, 1-2 kelimeyle belirt (Örneğin: Antibiyotik, Ağrı Kesici, Tansiyon İlacı, Mide İlacı, Antidepresan, Diyabet İlacı vb.).
      
      Eğer ilacı kesinlikle bilmiyorsan sadece "Bilinmiyor" yaz.
      
      Sadece kategori ismini yaz, başka hiçbir açıklama yapma.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sınıflandırma Hatası";
  }
};