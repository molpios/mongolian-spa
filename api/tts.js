const googleTtsLang = {
  mn: "mn",
  en: "en",
  ko: "ko",
  zh: "zh-CN",
  ru: "ru"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { text, language = "mn" } = req.body || {};
    const cleanedText = String(text || "").replace(/\s+/g, " ").trim();
    if (!cleanedText) {
      res.status(400).json({ error: "Missing TTS text." });
      return;
    }

    const params = new URLSearchParams({
      ie: "UTF-8",
      q: cleanedText.slice(0, 200),
      tl: googleTtsLang[language] || "mn",
      client: "tw-ob"
    });

    const upstream = await fetch(`https://translate.google.com/translate_tts?${params.toString()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const audio = Buffer.from(await upstream.arrayBuffer());
    if (!upstream.ok || !audio.length) {
      res.status(upstream.status || 502).json({ error: "TTS audio generation failed." });
      return;
    }

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(audio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
