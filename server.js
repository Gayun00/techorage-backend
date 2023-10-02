import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import { scrapArticle } from "./services/scrapper.js";
import { extractKeywords } from "./services/openai.js";
import { createArticle, getArticles } from "./services/sanity.js";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/article", async (req, res) => {
  const requestData = req.body;

  const { text, title, imageUrl } = await scrapArticle(requestData.url);
  const keywords = await extractKeywords(title);
  await createArticle({ text, title, keywords });

  res.json({
    message: "요청이 성공적으로 처리되었습니다.",
  });
});

app.get("/articles", async (req, res) => {
  const { token } = req.body;

  const articles = await getArticles({ token });

  res.json({
    message: "요청이 성공적으로 처리되었습니다.",
    articles,
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
