# 🌾 CropWise AI

AI-powered crop disease detection and yield prediction system built for farmers — no login required.

## Features

- **🔬 Disease Detection** — Upload a leaf image and get instant AI diagnosis with treatment recommendations
- **📊 Yield Prediction** — Enter environmental data (temp, rainfall, humidity, soil) to get yield estimates with risk levels
- **📈 Dashboard** — Track your detection and prediction history (stored locally on your device)
- **☁️ Weather Integration** — Auto-fetch temperature & humidity from OpenWeatherMap by location

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Python, FastAPI, Uvicorn |
| Disease Model | TensorFlow/Keras, MobileNetV2 (transfer learning) |
| Yield Engine | Rule-based scoring with agronomic knowledge base |
| Dataset | PlantVillage (54,000+ labeled crop images, 38 classes) |
| Data Storage | Browser localStorage (no database needed) |

## Getting Started

### Prerequisites

- Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.10+ & pip

### Frontend

```bash
# Clone the repo
git clone https://github.com/Subham8705/cropdet.git
cd cropdet

# Install dependencies
npm install

# Start dev server (runs on http://localhost:8080)
npm run dev
```

### Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server (runs on http://localhost:8000)
uvicorn main:app --reload
```

### Train the Disease Model (Optional)

If you want to train the CNN model from scratch using the PlantVillage dataset:

```bash
cd backend

# Train (default: 20 epochs)
python train_model.py --dataset "plantvillage dataset/color" --epochs 20

# Resume training from a checkpoint
python train_model.py --resume --epochs 40
```

The trained model is saved to `backend/models/plant_disease_model.h5`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/predict/disease` | Upload image → disease diagnosis |
| `POST` | `/predict/yield` | JSON body → yield prediction |

## Supported Crops

**Disease Detection:** Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

**Yield Prediction:** Wheat, Rice, Corn/Maize, Soybean, Cotton, Sugarcane, Potato, Tomato, Onion, Barley

## Project Structure

```
cropwise-ai/
├── src/                    # React frontend
│   ├── pages/              # Page components
│   ├── components/         # UI components
│   └── lib/history.ts      # localStorage utility
├── backend/                # Python backend
│   ├── main.py             # FastAPI app
│   ├── ai_engine.py        # Disease detection CNN
│   ├── yield_engine.py     # Yield prediction engine
│   └── train_model.py      # Model training script
└── index.html              # Entry point
```

