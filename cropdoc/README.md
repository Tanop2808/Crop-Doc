# 🌿 CropDoc — AI Crop Disease Detector

A Next.js + Tailwind CSS app that uses AI to detect crop diseases from photos.

## Features
- 🔬 AI-powered crop disease detection (Anthropic Claude API)
- 💬 Built-in chatbot assistant in the navbar
- 📱 Fully responsive design
- 🌿 4 diseases: Powdery Mildew, Leaf Blight, Root Rot, Nutrient Deficiency
- 💊 Treatment plans, product recommendations & cost estimates

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API Key
Create a `.env.local` file in the root:
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
```
Get your API key from: https://console.anthropic.com

> **Note:** The chatbot works without an API key. Only the image diagnosis needs one.

### 3. Update the API call (optional)
In `components/DiagnosePage.tsx`, find the fetch call and add the API key header:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
},
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production
```bash
npm run build
npm start
```

## Deploy to Vercel (Free)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add your `NEXT_PUBLIC_ANTHROPIC_API_KEY` in Vercel environment variables
4. Deploy!

## Project Structure
```
cropdoc/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page (routing)
│   └── globals.css      # Global styles + Tailwind
├── components/
│   ├── Navbar.tsx       # Top navbar with chat button
│   ├── LandingPage.tsx  # Hero, stats, how-it-works
│   ├── DiagnosePage.tsx # Upload, AI analysis, results
│   └── Chatbot.tsx      # Floating chatbot window
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```
