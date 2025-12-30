from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # frontend can be hosted anywhere
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model (already created locally)
model = joblib.load("rf_model.pkl")

class Features(BaseModel):
    features: list[float]

@app.get("/")
def health():
    return {"status": "AOD ML API running"}

@app.post("/predict")
def predict(data: Features):
    prediction = model.predict([data.features])
    return {"prediction": float(prediction[0])}
