export interface GeneratedCardResponse {
  title: string;
  description: string;
  category: string;
  gradient: string;
  visibility: 'public';
  allowComments: boolean;
  tags: string[];
}

export class AIService {
  private apiKey = process.env.GEMINI_API_KEY;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models';

  constructor() {
    if (!this.apiKey) {
      throw {
        status: 500,
        message: 'Gemini API key is not configured in environment variables.',
      };
    }
  }

  async generateCard(): Promise<GeneratedCardResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const url = `${this.baseUrl}/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

      const prompt = `
      You are a creative assistant that generates card data for a social app where users share ideas, art, and inspiration.
      Create a random, realistic, and visually interesting post idea.
      Be creative and natural, but concise.

      Return only a valid JSON object in this format:
      {
        "title": "string",
        "description": "string",
        "category": one of ["photography", "art-design", "technology", "travel", "music", "education", "food-recipes", "other"],
        "gradient": one of ["aurora", "blush", "emerald", "sunrise", "orchid", "ocean", "ash"],
        "visibility": "public",
        "allowComments": true,
        "tags": ["string", "string", ...] // Generate between 3 and 10 random tags based on the description
      }
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Gemini API error:', errorBody);
        throw { status: response.status, message: 'AI request failed' };
      }

      const data = await response.json();
      const textResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

      const cleanJson = textResponse
        .replace(/```json/i, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson) as GeneratedCardResponse;
      return parsed;
    } catch (error: any) {
      clearTimeout(timeout);
      console.error('Error generating card:', error);
      throw {
        status: error.status || 500,
        message:
          error.message || 'An unexpected error occurred while generating card',
      };
    }
  }
}
