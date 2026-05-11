import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import verifyCallbackHandler from "./api/verify-callback.js";
import verifyPhoneHandler from "./api/verify-phone.js";
import verifyStatusHandler from "./api/verify-status.js";
import ttsHandler from "./api/tts.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function viteApiRoute(handler, req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const body = req.method === "POST" ? await readJsonBody(req) : {};
  const apiReq = {
    method: req.method,
    headers: req.headers,
    body,
    query: Object.fromEntries(url.searchParams.entries())
  };
  const apiRes = {
    status(statusCode) {
      res.statusCode = statusCode;
      return apiRes;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
      return apiRes;
    },
    json(payload) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(payload));
    },
    send(payload) {
      res.end(payload);
    }
  };
  await handler(apiReq, apiRes);
}

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
          server.middlewares.use("/api/verify-phone", (req, res) => {
            viteApiRoute(verifyPhoneHandler, req, res).catch((error) => {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message }));
            });
          });
          server.middlewares.use("/api/verify-status", (req, res) => {
            viteApiRoute(verifyStatusHandler, req, res).catch((error) => {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message }));
            });
          });
          server.middlewares.use("/api/verify-callback", (req, res) => {
            viteApiRoute(verifyCallbackHandler, req, res).catch((error) => {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message }));
            });
          });
          server.middlewares.use("/api/tts", (req, res) => {
            viteApiRoute(ttsHandler, req, res).catch((error) => {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message }));
            });
          });
        }
      }
    ]
  };
});
