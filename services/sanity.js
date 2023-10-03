import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-10-02",
  token: process.env.SANITY_API_TOKEN,
});

export async function getArticles() {
  const articles = await client.fetch('*[_type == "article"]');
  return articles;
}

export async function createArticle(article) {
  const result = await client.createIfNotExists({
    _id: uuidv4(),
    _type: "article",
    ...article,
  });
  console.log(result, article);
  return result;
}

const checkKeywordExistence = (value) => {
  const query = `*[_type == "keywords" && keyword == $value]`;

  return client.fetch(query, { value }).then((keyword) => {
    console.log("value", value, keyword, "keyword");
    return !!keyword.length;
  });
};

// Known issue: 3~4회 반복까지는 existence검사가 정상동작하지 않는 경우 발생
export const updateKeywords = async (keywords) => {
  for (const keyword of keywords) {
    const isExist = await checkKeywordExistence(keyword);
    console.log(keyword, isExist);
    if (!isExist) {
      try {
        await client
          .create({
            _id: uuidv4(),
            _type: "keywords",
            keyword,
            count: 0,
          })
          .then((doc) => {
            console.log("created! New document:", doc);
          });
      } catch (err) {
        console.error("Oh no, creation failed: ", err.message);
      }
    }
  }
};

// await client
//   .patch(keyword)
//   .inc({ count: 1 })
//   .commit()
//   .then((updatedBike) => {
//     console.log("updated! New document:");
//     console.log(updatedBike);
//   })
//   .catch((err) => {
//     console.error("Oh no, the update failed: ", err.message);
//   });

export const deleteKeywords = () => {
  client
    .delete({ query: '*[_type == "keywords"]' })
    .then(() => {
      console.log("The document was deleted");
    })
    .catch((err) => {
      console.error("Delete failed: ", err.message);
    });
};

export const deleteArticles = () => {
  client
    .delete({ query: '*[_type == "article"]' })
    .then(() => {
      console.log("The document was deleted");
    })
    .catch((err) => {
      console.error("Delete failed: ", err.message);
    });
};

// 이미지 처리 방식 결정까지 주석처리
// export async function uploadImage(imageFile) {
//   return fetch(
//     `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-10-02/assets/images/production`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "image/jpeg",
//       },
//       body: imageFile,
//     }
//   );
// }
