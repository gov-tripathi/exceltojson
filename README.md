# Excel → JSON Converter

A modern, AI-ready Excel to JSON converter with a beautiful UI. Extract formulas, tables, named ranges, and RAG-optimized chunks from your Excel files.

## Features

- **Formula Extraction**: Capture formulas with dependency graphs
- **Cell Mapping**: Full cell-by-cell data with types
- **Comments & Hyperlinks**: Extract cell comments and hyperlink targets
- **Named Ranges**: Include workbook-level named ranges
- **Excel Tables**: Structured table extraction with headers
- **Text Section Inference**: Auto-detect contiguous text regions
- **RAG Chunks**: Pre-chunked output optimized for embedding models

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git repository
cd "EXCEL to JSON"
git init
git add .
git commit -m "Initial commit: Excel to JSON converter"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/excel-to-json.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `excel-to-json` repository
4. Vercel will auto-detect the settings from `vercel.json`
5. Click **"Deploy"**

Your app will be live at `https://your-project.vercel.app`

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
excel-to-json/
├── api/
│   └── convert.py          # Vercel serverless function
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Local development server
│   ├── main.py
│   └── requirements.txt
├── vercel.json             # Vercel configuration
├── requirements.txt        # Python dependencies for Vercel
└── README.md
```

## API Usage

### POST /api/convert

Convert an Excel file to JSON.

**Request**: `multipart/form-data`
- `file`: Excel file (.xlsx, .xlsm)
- `include_formulas`: boolean (default: true)
- `include_cells`: boolean (default: true)
- `include_comments`: boolean (default: true)
- `include_named_ranges`: boolean (default: true)
- `include_excel_tables`: boolean (default: true)
- `include_inferred_sections`: boolean (default: true)
- `chunk_max_cells`: integer (default: 400)

**Response**: JSON with workbook data, sheets, cells, and chunks

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Python, FastAPI (local), Vercel Serverless (production)
- **Libraries**: pandas, openpyxl

## License

MIT
