import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import { scrapArticle } from "./services/scrapper.js";
import { extractKeywords } from "./services/openai.js";
import {
  createArticle,
  deleteArticles,
  deleteKeywords,
  getArticles,
  updateKeywords,
} from "./services/sanity.js";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/article", async (req, res) => {
  const requestData = req.body;

  const { text, title, imageUrl } = await scrapArticle(requestData.url);
  const keywords = await extractKeywords(title);
  await createArticle({
    text,
    title,
    keywords,
    url: requestData.url,
    thumbnail: imageUrl,
  });
  await updateKeywords(keywords);

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

app.post("/test", async (req, res) => {
  await updateKeywords(["좋은 컴포넌트 설계2", "고민", "Compound component"]);
  res.json({
    message: "키워드 업데이트 성공",
  });
});

app.delete("/keywords", async (req, res) => {
  await deleteKeywords();
  res.json({
    message: "키워드 삭제 성공",
  });
});

app.delete("/articles", async (req, res) => {
  await deleteArticles();
  res.json({
    message: "아티클 삭제 성공",
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
