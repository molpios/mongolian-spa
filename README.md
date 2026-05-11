# mongolian-spa

Interactive Mongolia food and nutrition prototype built with React and Vite.

## Features

- Complete Mongolia administrative map coverage: 21 aimags, Ulaanbaatar, soums, and districts.
- Regional food filtering by aimag or Ulaanbaatar.
- Multilingual UI: Mongolian, English, Korean, Chinese, and Russian.
- Food detail pages with nutrition table, source links, verified images where available, and cooking videos.
- Mazaalai AI explanations and image-based food search through a server-side Gemini endpoint.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `GEMINI_API_KEY` in `.env` for local AI features.
Set `VITE_TTS_ENDPOINT` if your local TTS server is not running at `http://localhost:8000/tts`.
Set `VERIFY_MN_API_KEY` and `VERIFY_MN_CALLBACK_URL` for phone login verification.

## Build

```bash
npm run build
```

## Vercel Deployment

Add these environment variables in Vercel:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` optional, defaults to `gemini-2.5-flash`
- `VERIFY_MN_API_KEY`
- `VERIFY_MN_CALLBACK_URL`, for example `https://your-domain.vercel.app/api/verify-callback`
- `VITE_TTS_ENDPOINT` optional, only needed if using an external TTS service

Vercel will build the Vite app and use `api/gemini.js` for `/api/gemini` plus verify.mn routes under `/api/verify-*`.
