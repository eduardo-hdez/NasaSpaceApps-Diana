# DIANA — Hunting Exoplanets with AI Precision

DIANA is a full-stack web application built for the **NASA Space Apps Challenge** that leverages machine learning to classify exoplanet candidates from NASA mission data. It provides an interactive dashboard where users can analyze observations from the **Kepler**, **K2**, and **TESS** space missions using pre-trained LightGBM classifiers.

## Features

- **Single Observation Analysis** — Input astronomical parameters manually and receive a classification with confidence scores, feature importance, and a natural-language explanation.
- **Batch Dataset Analysis** — Load pre-built NASA mission datasets or upload a custom CSV to classify hundreds of observations at once.
- **Explainable AI** — Every prediction includes feature attribution, probability distributions, and human-readable reasoning.
- **Interactive Dashboard** — Visualize results through precision/recall graphs, light-curve plots, and a searchable data table.
- **Guided Walkthrough** — A step-by-step flow that helps new users choose a model, enter data, or select a dataset before reaching the dashboard.

## Tech Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | React 19, Vite 7, React Router, Redux Toolkit, Recharts |
| Backend   | Python, FastAPI, Uvicorn                                |
| ML / Data | LightGBM, scikit-learn, pandas, NumPy, joblib           |
| Datasets  | NASA Kepler, K2, and TESS mission archives              |

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI application & endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── models/                  # Pre-trained .pkl model files
│   ├── resources/               # Raw + cleaned CSV datasets
│   │   └── clean/               # Preprocessed datasets ready for analysis
│   ├── services/
│   │   ├── analisis.py          # ML inference, feature importance, explanations
│   │   └── datasets.py          # Dataset loading & metadata
│   └── test.py                  # Model loading smoke test
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router & Redux provider
│   │   ├── components/          # Shared UI components (NavBar, cards)
│   │   ├── pages/
│   │   │   ├── home/            # Landing page with animated star field
│   │   │   ├── explore/         # Browse available NASA datasets
│   │   │   ├── walkthrough/     # Guided setup (model selection, data entry)
│   │   │   └── dashboard/       # Main analysis dashboard
│   │   │       ├── store.js     # Redux state (models, forms, results)
│   │   │       └── componentes/ # Dashboard-specific components
│   │   └── assets/              # Global styles
│   └── public/imgs/             # Mission imagery (Kepler, K2, TESS)
└── README.md
```

## API Endpoints

| Method | Route                  | Description                                             |
| ------ | ---------------------- | ------------------------------------------------------- |
| `GET`  | `/`                    | Health check                                            |
| `GET`  | `/datasets`            | List available dataset metadata                         |
| `GET`  | `/select-dataset/{id}` | Load a preprocessed dataset (kepler, tess)              |
| `POST` | `/analyze-dataset`     | Classify a full dataset with the selected model         |
| `POST` | `/analyze-observation` | Classify a single observation with detailed explanation |
| `POST` | `/upload-csv`          | Upload a custom CSV file                                |

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `/docs` for the interactive Swagger documentation.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## ML Models

DIANA ships with pre-trained **LightGBM** classifiers for both the TESS and Kepler pipelines. Each model was trained on cleaned mission data using TSFRESH feature engineering.

| Model  | Features                                                | Recall | AUC  |
| ------ | ------------------------------------------------------- | ------ | ---- |
| TESS   | 24 (transit depth, orbital period, star radius, etc.)   | 96%    | 94.8 |
| Kepler | 24 (KOI score, transit depth, number of transits, etc.) | 96%    | 94.8 |

Models are stored as serialized `.pkl` files in `backend/models/` and loaded on first request.

## Developed by

Team STARWARE
