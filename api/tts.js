import crypto from "node:crypto";
import WebSocket from "ws";

const edgeVoiceByLanguage = {
  mn: "mn-MN-BataaNeural",
  en: "en-US-JennyNeural",
  ko: "ko-KR-SunHiNeural",
  zh: "zh-CN-XiaoxiaoNeural",
  ru: "ru-RU-SvetlanaNeural"
};

const edgeLangByVoice = {
  "mn-MN-BataaNeural": "mn-MN",
  "en-US-JennyNeural": "en-US",
  "ko-KR-SunHiNeural": "ko-KR",
  "zh-CN-XiaoxiaoNeural": "zh-CN",
  "ru-RU-SvetlanaNeural": "ru-RU"
};

const trustedClientToken = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const audioFormat = "audio-24khz-48kbitrate-mono-mp3";
const chromiumFullVersion = "143.0.3650.75";
const chromiumMajorVersion = chromiumFullVersion.split(".")[0];
const secMsGecVersion = `1-${chromiumFullVersion}`;
const winEpoch = 11644473600;

function cleanText(value) {
  return String(value || "")
    .replace(/[`*_#>]+/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function speechTimestamp() {
  return new Date().toUTCString().replace("GMT", "GMT+0000 (Coordinated Universal Time)");
}

function secMsGec() {
  let ticks = Math.floor(Date.now() / 1000);
  ticks += winEpoch;
  ticks -= ticks % 300;
  const windowsTicks = Math.floor(ticks * 10000000);
  return crypto.createHash("sha256").update(`${windowsTicks}${trustedClientToken}`, "ascii").digest("hex").toUpperCase();
}

function muid() {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

function edgeVoiceName(shortVoice) {
  const match = String(shortVoice || "").match(/^([a-z]{2,})-([A-Z]{2,})-(.+Neural)$/);
  if (!match) {
    return shortVoice;
  }
  return `Microsoft Server Speech Text to Speech Voice (${match[1]}-${match[2]}, ${match[3]})`;
}

function wsMessage(path, requestId, contentType, body) {
  return [
    `X-RequestId:${requestId}`,
    `X-Timestamp:${speechTimestamp()}`,
    `Content-Type:${contentType}`,
    `Path:${path}`,
    "",
    body
  ].join("\r\n");
}

function stripAudioHeaders(data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (buffer.length > 2) {
    const headerLength = buffer.readUInt16BE(0);
    const headerEnd = 2 + headerLength;
    if (headerEnd <= buffer.length) {
      const header = buffer.subarray(2, headerEnd).toString("utf8");
      return header.includes("Path:audio") ? buffer.subarray(headerEnd) : Buffer.alloc(0);
    }
  }
  const marker = Buffer.from("Path:audio\r\n");
  const markerIndex = buffer.indexOf(marker);
  if (markerIndex === -1) {
    return buffer;
  }
  const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), markerIndex);
  return headerEnd === -1 ? Buffer.alloc(0) : buffer.subarray(headerEnd + 4);
}

function readWsData(data) {
  if (typeof data === "string") {
    return Promise.resolve(data);
  }
  if (data instanceof ArrayBuffer) {
    return Promise.resolve(Buffer.from(data));
  }
  if (ArrayBuffer.isView(data)) {
    return Promise.resolve(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
  }
  if (data?.arrayBuffer) {
    return data.arrayBuffer().then((arrayBuffer) => Buffer.from(arrayBuffer));
  }
  return Promise.resolve(Buffer.from(data || ""));
}

function synthesizeWithEdge({ text, voice, language }) {
  return new Promise((resolve, reject) => {
    const selectedVoice = voice || edgeVoiceByLanguage[language] || edgeVoiceByLanguage.mn;
    const lang = edgeLangByVoice[selectedVoice] || edgeLangByVoice[edgeVoiceByLanguage[language]] || "mn-MN";
    const microsoftVoice = edgeVoiceName(selectedVoice);
    const requestId = crypto.randomUUID().replace(/-/g, "");
    const connectionId = crypto.randomUUID().replace(/-/g, "");
    const url = [
      `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${trustedClientToken}`,
      `ConnectionId=${connectionId}`,
      `Sec-MS-GEC=${secMsGec()}`,
      `Sec-MS-GEC-Version=${secMsGecVersion}`
    ].join("&");
    const ws = new WebSocket(url, {
      headers: {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromiumMajorVersion}.0.0.0 Safari/537.36 Edg/${chromiumMajorVersion}.0.0.0`,
        Cookie: `muid=${muid()};`
      },
      perMessageDeflate: true
    });
    const audioChunks = [];
    const timeoutId = setTimeout(() => {
      try {
        ws.close();
      } catch {
        // ignore close failures
      }
      reject(new Error("TTS request timed out."));
    }, 25000);

    ws.on("open", () => {
      const config = {
        context: {
          synthesis: {
            audio: {
              metadataoptions: {
                sentenceBoundaryEnabled: false,
                wordBoundaryEnabled: false
              },
              outputFormat: audioFormat
            }
          }
        }
      };
      ws.send(`X-Timestamp:${speechTimestamp()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${JSON.stringify(config)}\r\n`);
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${microsoftVoice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
      ws.send(`${wsMessage("ssml", crypto.randomUUID().replace(/-/g, ""), "application/ssml+xml", ssml)}`);
    });

    ws.on("message", async (message, isBinary) => {
      try {
        const data = isBinary ? await readWsData(message) : String(message);
        if (typeof data === "string") {
          if (data.includes("Path:turn.end")) {
            clearTimeout(timeoutId);
            ws.close();
            resolve(Buffer.concat(audioChunks));
          }
          return;
        }
        const audio = stripAudioHeaders(data);
        if (audio.length) {
          audioChunks.push(audio);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        ws.close();
        reject(error);
      }
    });

    ws.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(new Error(error?.message || "TTS WebSocket failed."));
    });

    ws.on("close", () => {
      clearTimeout(timeoutId);
      if (audioChunks.length) {
        resolve(Buffer.concat(audioChunks));
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { text, voice, language = "mn" } = req.body || {};
    const cleanedText = cleanText(text).slice(0, 1000);
    if (!cleanedText) {
      res.status(400).json({ error: "Missing TTS text." });
      return;
    }

    const audio = await synthesizeWithEdge({ text: cleanedText, voice, language });
    if (!audio.length) {
      res.status(502).json({ error: "TTS audio generation failed." });
      return;
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(audio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
