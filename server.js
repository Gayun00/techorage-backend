import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

// POST 요청을 파싱하기 위해 bodyParser 사용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST 요청을 처리하는 예제
app.post("/api/post", (req, res) => {
  // POST 요청에서 전송된 데이터는 req.body에서 사용 가능
  const requestData = req.body;

  // 여기에 원하는 로직을 추가하십시오.
  // 이 예제에서는 전송된 데이터를 그대로 응답합니다.
  res.json({
    message: "POST 요청이 성공적으로 처리되었습니다.",
    data: requestData,
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
