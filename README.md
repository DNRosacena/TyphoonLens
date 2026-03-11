# 🌀 TyphoonLens

An AI-powered satellite image classification system that analyzes typhoon intensity across three international meteorological scales simultaneously — PAGASA, Saffir-Simpson, and JMA — using Groq Vision AI and Llama 4 Scout.

![TyphoonLens Preview](https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&h=600&fit=crop)

## Live Demo

🔗 [typhoon-lens.vercel.app](https://typhoon-lens.vercel.app) 

---

## Features

- **Satellite Image Upload** — Drag & drop or click to upload any typhoon satellite image (JPG, PNG, WEBP up to 20MB)
- **Auto Compression** — Client-side image compression before API submission for fast processing
- **Triple-Scale Classification** — Simultaneous analysis across all three international typhoon scales
- **PAGASA Scale** 🇵🇭 — TD / TS / STS / TY / STY with PSWS signal level
- **Saffir-Simpson Scale** 🌍 — Category 1–5 with damage potential rating
- **JMA Scale** 🇯🇵 — TD / TS / STS / T with central pressure estimate
- **Risk Assessment** — Storm surge, rainfall risk, and estimated storm diameter
- **Intensity Bars** — Visual progress bar showing severity position on each scale
- **Session History** — Last 8 classifications with thumbnail and quick recall
- **Cinematic UI** — Dark storm/weather aesthetic with radar animations and scan-line overlays
- **Groq Vision AI** — Powered by Llama 4 Scout 17B for fast, accurate satellite analysis

---

## Classification Scales

### 🇵🇭 PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration)
| Code | Name | Wind Speed |
|---|---|---|
| TD | Tropical Depression | < 63 km/h |
| TS | Tropical Storm | 63–88 km/h |
| STS | Severe Tropical Storm | 89–117 km/h |
| TY | Typhoon | 118–184 km/h |
| STY | Super Typhoon | ≥ 185 km/h |

### 🌍 Saffir-Simpson Hurricane Wind Scale
| Code | Name | Wind Speed |
|---|---|---|
| CAT1 | Category 1 | 119–153 km/h |
| CAT2 | Category 2 | 154–177 km/h |
| CAT3 | Category 3 | 178–208 km/h |
| CAT4 | Category 4 | 209–251 km/h |
| CAT5 | Category 5 | ≥ 252 km/h |

### 🇯🇵 JMA (Japan Meteorological Agency)
| Code | Name | Wind Speed |
|---|---|---|
| TD | Tropical Depression | < 17 m/s |
| TS | Tropical Storm | 17–24 m/s |
| STS | Severe Tropical Storm | 25–32 m/s |
| T | Typhoon | ≥ 33 m/s |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| AI Vision | Groq API — Llama 4 Scout 17B |
| Image Compression | browser-image-compression |
| Icons | Lucide React |
| Fonts | Rajdhani · Share Tech Mono · Exo 2 |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Groq API key (free) → https://console.groq.com

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typhoonlens.git
cd typhoonlens

# Install dependencies
npm install

# Create environment file
echo "VITE_GROQ_API_KEY=your_groq_key_here" > .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

Create a `.env` file in the project root:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
typhoonlens/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Fixed nav with radar animation
│   │   ├── UploadZone.jsx     # Drag & drop image upload with compression
│   │   ├── ResultPanel.jsx    # Triple-scale classification results
│   │   └── HistoryLog.jsx     # Session classification history
│   ├── utils/
│   │   ├── classifier.js      # Groq Vision API integration + prompt
│   │   └── compress.js        # Client-side image compression
│   ├── App.jsx                # Main layout and classification flow
│   ├── App.css                # Component styles and badge classes
│   ├── index.css              # Global styles, CSS variables, animations
│   └── main.jsx
├── public/
│   └── favicon.svg
├── .env                       # API keys (not committed)
├── .gitignore
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## How It Works

```
1. User uploads satellite image
        ↓
2. browser-image-compression reduces to ≤18KB JPEG
        ↓
3. Image converted to base64
        ↓
4. Sent to Groq API with expert typhoon analysis prompt
        ↓
5. Llama 4 Scout analyzes cloud structure, eye wall,
   spiral bands, CDO, and system symmetry
        ↓
6. Returns structured JSON with all three scale classifications
        ↓
7. React renders intensity bars, badges, risk assessment
```

---

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
vercel --prod
```

**Framework preset:** Vite
**Build command:** `npm run build`
**Output directory:** `dist`

### Environment Variables on Vercel

Go to **Project Settings → Environment Variables** and add:
```
VITE_GROQ_API_KEY = your_groq_api_key_here
```

---

## Sample Images for Testing

Search for any of these on Google Images:
- `Typhoon Hainan satellite PAGASA`
- `Super Typhoon Haiyan satellite image`
- `Typhoon MTSAT satellite`
- `Western Pacific tropical cyclone satellite NASA`

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

Part of a 10-project freelance portfolio
