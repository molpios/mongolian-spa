import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import verifyCallbackHandler from "./api/verify-callback.js";
import verifyPhoneHandler from "./api/verify-phone.js";
import verifyStatusHandler from "./api/verify-status.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 5174);
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function handleGemini(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "GEMINI_API_KEY is not configured on the server." });
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
        sendJson(res, 400, { error: "Missing prompt." });
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
      sendJson(res, response.ok ? 200 : response.status, response.ok ? { text } : { error: data?.error?.message || "Gemini request failed." });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
  });
}

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

async function handleApiRoute(handler, req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  const body = req.method === "POST" ? await readJsonBody(req) : {};
  const apiReq = {
    method: req.method,
    headers: req.headers,
    body,
    query: Object.fromEntries(url.searchParams.entries())
  };
  const apiRes = {
    status(statusCode) {
      return {
        json(payload) {
          sendJson(res, statusCode, payload);
        }
      };
    }
  };
  await handler(apiReq, apiRes);
}

function serveStatic(req, res) {
  const requestPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(distDir, safePath));
  const finalPath = filePath.startsWith(distDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(distDir, "index.html");
  const ext = path.extname(finalPath);
  const contentTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml"
  };
  res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
  fs.createReadStream(finalPath).pipe(res);
}

http.createServer((req, res) => {
  if (req.url?.startsWith("/api/gemini")) {
    if (req.method !== "POST") {
      res.writeHead(405);
      res.end("Method Not Allowed");
      return;
    }
    handleGemini(req, res);
    return;
  }
  if (req.url?.startsWith("/api/verify-phone")) {
    handleApiRoute(verifyPhoneHandler, req, res).catch((error) => sendJson(res, 500, { error: error.message }));
    return;
  }
  if (req.url?.startsWith("/api/verify-status")) {
    handleApiRoute(verifyStatusHandler, req, res).catch((error) => sendJson(res, 500, { error: error.message }));
    return;
  }
  if (req.url?.startsWith("/api/verify-callback")) {
    handleApiRoute(verifyCallbackHandler, req, res).catch((error) => sendJson(res, 500, { error: error.message }));
    return;
  }
  serveStatic(req, res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
