import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

async function geminiProxy(req, res, apiKey, model) {
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const { prompt, image } = JSON.parse(body || "{}");
      if (!prompt || typeof prompt !== "string") {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing prompt." }));
        return;
      }

      const parts = [{ text: prompt }];
      if (image?.data && image?.mimeType) {
        parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            maxOutputTokens: 2800
          }
        })
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") || "";
      res.statusCode = response.ok ? 200 : response.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.ok ? { text } : { error: data?.error?.message || "Gemini request failed." }));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";

  return {
    plugins: [
      react(),
      {
        name: "gemini-dev-proxy",
        configureServer(server) {
          server.middlewares.use("/api/gemini", (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }
            geminiProxy(req, res, apiKey, model);
          });
        }
      }
    ]
  };
});
