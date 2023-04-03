import axios from "axios";

export async function postMessage({ id, userId, data }) {
  return axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputText }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loaderData.OPENAI_API_KEY}`,
      },
    }
  );
}
