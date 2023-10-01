const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

(async () => {
  // 브라우저를 실행합니다.
  const browser = await puppeteer.launch();

  // 새 페이지를 생성합니다.
  const page = await browser.newPage();

  // 웹 페이지로 이동합니다.
  await page.goto(
    "https://velog.io/@gygy/%EC%A2%8B%EC%9D%80-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EC%84%A4%EA%B3%84%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EB%AF%BC-Compound-component%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0"
  );

  // 페이지의 내용을 스크래핑합니다.
  const content = await page.content();
  console.log(content);

  // Cheerio로 HTML 파싱
  const $ = cheerio.load(content);

  // 제목 추출
  const title = $("title").text();

  // 이미지 추출
  const imageUrl = $('meta[property="og:image"]').attr("content");

  // 결과 출력
  console.log("제목:", title);
  console.log("이미지 URL:", imageUrl);
  // 원하는 태그 사이에 있는 텍스트를 추출합니다.
  const textArray = [];

  // p, li, h1, h2, h3, h4 태그 안에 있는 텍스트를 추출합니다.
  $("p, li, h1, h2, h3, h4").each((index, element) => {
    const text = $(element).text();
    textArray.push(text);
  });

  // 추출한 텍스트를 출력합니다.
  console.log(textArray.join(","));

  // 브라우저를 닫습니다.
  await browser.close();
})();
