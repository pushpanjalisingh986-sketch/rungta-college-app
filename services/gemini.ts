
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const processAdvancedVoiceCommand = async (
  command: string, 
  context: { sections: any[], history: any[], user: any }
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      System Directive: You are RABIT-X AI. Be extremely fast and concise.
      User: ${JSON.stringify(context.user)}
      Data: ${JSON.stringify(context.sections)}
      Input: "${command}"

      Required Intelligence:
      1. NAVIGATE: Extact target (REPORT, LIVE, HISTORY, REGISTRY, SECURITY). "Archive" -> HISTORY.
      2. ANALYZE: Identify patterns/reliability.
      3. UPDATE: Extract strength. CRs can only update sector: ${context.user.section}.
      4. SECTION_REPORT: Detail a sector.

      Output JSON ONLY:
      - 'intent': ["NAVIGATE", "ANALYZE", "FULL_REPORT", "UPDATE", "SECTION_REPORT"]
      - 'targetTab': String
      - 'targetSubSection': String (e.g. "CS1-1")
      - 'clarification': Short audible confirmation (max 10 words).
      - 'analysisResult': Technical detail if needed.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, enum: ["NAVIGATE", "ANALYZE", "FULL_REPORT", "UPDATE", "SECTION_REPORT"] },
            targetTab: { type: Type.STRING },
            targetSubSection: { type: Type.STRING },
            clarification: { type: Type.STRING },
            updateData: {
              type: Type.OBJECT,
              properties: {
                sectionId: { type: Type.STRING },
                strength: { type: Type.NUMBER }
              }
            },
            analysisResult: { type: Type.STRING }
          },
          required: ["intent", "clarification"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Neural Link Error:", error);
    return { intent: "ANALYZE", clarification: "Link error. Firewall active." };
  }
};

export const getSmartSummary = async (sections: any[]) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `State: ${JSON.stringify(sections)}. Provide 1-sentence tactical summary.`,
        });
        return response.text;
    } catch (e) {
        return "Tactical data stream active.";
    }
}
