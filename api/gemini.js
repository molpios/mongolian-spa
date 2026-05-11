export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    return;
  }

  try {
    const { prompt, image } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing prompt." });
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
    res.status(response.ok ? 200 : response.status).json(response.ok ? { text } : { error: data?.error?.message || "Gemini request failed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
