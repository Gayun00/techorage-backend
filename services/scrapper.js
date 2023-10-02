import puppeteer from "puppeteer";
import cheerio from "cheerio";

export async function scrapArticle(url) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto(url);

  const content = await page.content();

  const $ = cheerio.load(content);

  const title = $("title").text();

  const imageUrl = $('meta[property="og:image"]').attr("content");

  const textArray = [];

  $("p, li, h1, h2, h3, h4").each((index, element) => {
    const text = $(element).text();
    textArray.push(text);
  });

  const text = textArray.join(",");
  return { title, imageUrl, text };
  // callback(text);

  await browser.close();
}
