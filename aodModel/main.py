import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset
df = pd.read_csv("FINALIST_2.csv")
df_cleaned = df.drop(columns=["Time_Period"])
y = df_cleaned["AOD_055"]

# Top 10 features
top_10_features = [
    "zust", "BA", "tsr", "tisr", "LST",
    "t at 1000 hPa", "d at 850 hPa", "NDVI", "ptype", "ws_100m"
]
X = df_cleaned[top_10_features]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train RandomForest model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save model
joblib.dump(rf_model, "rf_model.pkl")

# Load model for API
model = joblib.load("rf_model.pkl")

class Features(BaseModel):
    features: list[float]

@app.post("/predict")
def predict(data: Features):
    prediction = model.predict([data.features])
    return {"prediction": float(prediction[0])}
