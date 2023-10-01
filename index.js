import puppeteer from "puppeteer";
import cheerio from "cheerio";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto(
    "https://velog.io/@gygy/%EC%A2%8B%EC%9D%80-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EC%84%A4%EA%B3%84%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EB%AF%BC-Compound-component%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0"
  );

  const content = await page.content();
  console.log(content);

  const $ = cheerio.load(content);

  const title = $("title").text();

  const imageUrl = $('meta[property="og:image"]').attr("content");

  console.log("제목:", title);
  console.log("이미지 URL:", imageUrl);
  const textArray = [];

  $("p, li, h1, h2, h3, h4").each((index, element) => {
    const text = $(element).text();
    textArray.push(text);
  });

  const text = textArray.join(",");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function extractKeywords() {
    const textToAnalyze = `
    Next.js의 작동원리,Next.js로 하는 성능 최적화, Streaming SSR, Next.js와 SSR의 관계
  `;

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
    } catch (error) {
      console.error("Error extracting keywords:", error);
    }
  }
  extractKeywords();

  await browser.close();
})();
