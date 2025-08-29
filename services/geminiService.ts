import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.ARRAY,
            description: "Key bullet points summarizing the complaint, capturing the main issues raised by the citizen.",
            items: { type: Type.STRING }
        },
        department: {
            type: Type.STRING,
            description: "The single, most relevant government department this complaint should be routed to (e.g., 'Public Works Department', 'Health and Human Services', 'Department of Transportation')."
        },
        analysis: {
            type: Type.STRING,
            description: "A detailed analysis of the complaint against common government rules and regulations. Explain how the rules might apply to the citizen's situation. Be neutral and objective."
        },
        solutions: {
            type: Type.ARRAY,
            description: "A list of actionable, step-by-step suggested solutions or next steps for the official to consider. These should be practical and compliant with regulations.",
            items: { type: Type.STRING }
        },
    },
    required: ["summary", "department", "analysis", "solutions"]
};


export const analyzeComplaint = async (complaintText: string): Promise<AnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please analyze the following citizen complaint, which may be in English or Malayalam: "${complaintText}"`,
            config: {
                systemInstruction: "You are an expert legal and administrative assistant for a government agency. Your task is to analyze citizen complaints with objectivity and precision. Your response must be in JSON format and adhere to the provided schema. Focus on identifying the core issues, mapping them to the correct department, evaluating them against standard government regulations, and proposing clear, actionable solutions for the handling official.",
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as AnalysisResult;
        return result;

    } catch (error) {
        console.error("Error analyzing complaint:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze complaint due to an API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during complaint analysis.");
    }
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    try {
        const filePart = await fileToGenerativePart(file);
        const textPart = { text: "Extract all text from the attached file, which contains a citizen's complaint letter. The file could be an image or a PDF. The text may be in English or Malayalam. Transcribe the text accurately, preserving paragraphs and original formatting as much as possible." };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error extracting text from file:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to extract text from file due to an API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during text extraction.");
    }
};
