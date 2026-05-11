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

## Build

```bash
npm run build
```

## Vercel Deployment

Add these environment variables in Vercel:

- `mazaalai_API_KEY`
- `GEMINI_MODEL` optional, defaults to `mazaalai-2.5-flash`

Vercel will build the Vite app and use `api/mazaalai.js` for `/api/mazaalai`.
