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

export async function uploadImage(imageFile) {
  return fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-10-02/assets/images/production`,
    {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: imageFile,
    }
  );
}
