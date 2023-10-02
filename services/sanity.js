import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

export const client = createClient({
  projectId: "pztd9ny2",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-10-02",
  token:
    "ski3JWZgipetcvJr5CeNkyAfLfWgur9Zp5olgorP5lW1gjMD57drc1SlP2rftefE6OQGBbsTWb43F0PnMw4AHRmay15w6I65ZcMJj05QSrLQEoCRjOlxVk5iK3BFNvral3uI4bEc48s1XlapA0DKCT2HdSr2cGV7Jrn5W7HV64pOTnmtg4DR", // Only if you want to update content with the client
});

export async function getArticles() {
  const articles = await client.fetch('*[_type == "article"]');
  return articles;
}

export async function createArticle(article) {
  const result = client.createIfNotExists({
    _id: uuidv4(),
    _type: "article",
    ...article,
  });
  console.log(result);
  return result;
}
