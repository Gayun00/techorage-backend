import express from "express";
import bodyParser from "body-parser";

import { scrapArticle } from "./services/scrapper.js";
import { extractKeywords } from "./services/openai.js";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/article", async (req, res) => {
  const requestData = req.body;
  console.log("requestData: ", requestData);
  const { text, title, imageUrl } = await scrapArticle(requestData.url);
  const keywords = await extractKeywords(title);

  res.json({
    message: "POST 요청이 성공적으로 처리되었습니다.",
    data: {
      text,
      title,
      imageUrl,
      keywords,
    },
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
