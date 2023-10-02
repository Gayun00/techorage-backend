import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractKeywords(textToAnalyze) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a block of text, and your task is to extract a list of keywords from it.",
        },
        {
          role: "user",
          content: textToAnalyze,
        },
      ],
      temperature: 0.5,
      max_tokens: 256,
    });
    console.log(response.choices[0].message);
    return response.choices[0].message.content.split(", ");
  } catch (error) {
    console.error("Error extracting keywords:", error);
  }
}
