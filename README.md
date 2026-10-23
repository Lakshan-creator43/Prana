# 🌿 PRANA — Traditional Knowledge. Modern Trust.

AI-powered traditional and home remedy research assistant. Every remedy comes with a receipt.

Built by **SideQuest** — AI & Data Science, Dhanalakshmi Srinivasan College of Engineering, Coimbatore.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file from the template
cp .env.example .env
# Edit .env and add your Groq and Tavily API keys

# Start the Flask server (runs on http://localhost:5000)
python app.py
```

### 3. Build for Production

```bash
npm run build    # Output in dist/
npm run preview  # Preview the production build
```

---

## 🔑 Environment Variables

Create `backend/.env` from `backend/.env.example`:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key for LLM inference |
| `TAVILY_API_KEY` | Your Tavily API key for web research |
| `LLM_MODEL` | Groq model to use (default: `openai/gpt-oss-20b`) |
| `FLASK_SECRET_KEY` | Flask secret key for sessions |
| `FLASK_PORT` | Backend port (default: `5000`) |
| `FLASK_DEBUG` | Enable debug mode (`true`/`false`) |

For Vercel deployment, set `VITE_API_URL` to your deployed backend URL.

---

## 🖼️ Image Frames Setup

Place 229 JPG frames in `public/images/prana/`:

```
public/images/prana/
├── ezgif-frame-001.jpg
├── ezgif-frame-002.jpg
├── ...
└── ezgif-frame-229.jpg
```

File names must be 3-digit zero-padded (`001` through `229`). These frames drive the scroll-linked hero canvas animation.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (JavaScript/JSX)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **HTML5 Canvas** image sequence for the hero
- **react-router-dom** for routing
- **lucide-react** for icons
- **Fonts**: Cormorant Garamond (headings), Inter (body)

### Backend
- **Flask** (Python) with CORS
- **Groq SDK** for LLM inference
- **Tavily SDK** for web research/scraping
- **Pydantic** for request/response validation
- **SQLite** for local data storage
- **BeautifulSoup4** for HTML parsing

---

## 📁 Project Structure

```
├── src/                     # React frontend
│   ├── components/          # Shared UI components
│   ├── context/             # Global state (PranaContext)
│   ├── data/                # Static/mock data
│   ├── pages/               # Route pages
│   ├── services/api.js      # API client
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── backend/                 # Flask backend
│   ├── routes/              # API route blueprints
│   ├── services/            # LLM, scraper, safety services
│   ├── data/                # Source data & red flags
│   ├── app.py               # Flask entry point
│   ├── config.py            # Configuration loader
│   ├── database.py          # SQLite database
│   ├── models.py            # Pydantic models
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── public/                  # Static assets
├── vercel.json              # Vercel deployment config
├── package.json             # Node dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind configuration
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect this repo to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `./` (project root)
3. Framework will be auto-detected as **Vite**
4. Add environment variable: `VITE_API_URL` = your deployed backend URL

### Backend
Deploy the `backend/` directory to any Python hosting service (Render, Railway, Fly.io, etc.):
1. Set the environment variables from `.env.example`
2. Start command: `python app.py`

---

## ⚠️ Disclaimer

PRANA provides retrieved, cited information from trusted medical and traditional-medicine sources. It does not constitute medical advice, diagnosis, or treatment.
