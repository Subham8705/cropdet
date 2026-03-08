from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CropWise AI Backend")

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000", # React default port
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CropWise AI Backend"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from ai_engine import detector
from fastapi import File, UploadFile
import uvicorn

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = detector.predict(image_bytes)
    return result

from yield_engine import yield_engine, YieldInput

@app.post("/predict/yield")
def predict_yield(data: YieldInput):
    result = yield_engine.predict(data)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
