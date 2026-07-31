from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os

app = FastAPI(title="Car Market API", description="API to read car announcements, prices, and anomalies.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data():
    try:
        df = pd.read_csv("cars_with_predictions.csv")
        return df.to_dict(orient="records")
    except FileNotFoundError:
        return {"error": "The CSV data file does not exist. Please run the scraper and models first."}

@app.get("/api/cars")
def get_all_cars(limit: int = Query(50)):
    data = load_data()
    if isinstance(data, list):
        return data[:limit]
    return data

@app.get("/api/anomalies")
def get_anomalies():
    data = load_data()
    if isinstance(data, list):
        return [car for car in data if car.get("Anomaly") == -1]
    return data

@app.get("/api/stats")
def get_stats():
    try:
        df = pd.read_csv("cars_with_predictions.csv")
        return {
            "total_cars": len(df),
            "total_anomalies": len(df[df['Anomaly'] == -1]),
            "average_price_millions": round(df['Price_Millions'].mean(), 2)
        }
    except Exception as e:
        return {"error": str(e)}

# Attempt to load the model on startup
try:
    price_model = joblib.load("car_price_model.pkl")
except:
    price_model = None

@app.get("/api/predict")
def predict_price(brand: str, year: int):
    if not price_model:
        return {"error": "The regression model has not been trained yet. Please run regression.py first."}
    
    # Important Fix: Capitalize the first letter so it matches the format in the trained model
    formatted_brand = brand.strip().capitalize()
    
    input_data = pd.DataFrame({'Brand': [formatted_brand], 'Year': [year]})
    
    try:
        predicted_price = price_model.predict(input_data)
        return {
            "brand": formatted_brand,
            "year": year,
            "estimated_price_millions": round(float(predicted_price[0]), 2)
        }
    except Exception as e:
        # Fallback if the brand was never seen in training
        return {
            "estimated_price_millions": 0, 
            "message": "Brand not recognized by the model or prediction failed.", 
            "details": str(e)
        }

@app.get("/api/history")
def get_history():
    try:
        # On lit l'historique
        df_hist = pd.read_csv("price_history.csv")
        # S'il y a plusieurs tests le même jour, on regroupe par date pour garder 1 seule ligne par jour
        df_hist = df_hist.groupby("Date", as_index=False).mean()
        # On arrondit
        df_hist["Average_Price"] = df_hist["Average_Price"].round(2)
        return df_hist.to_dict(orient="records")
    except FileNotFoundError:
        # Si le fichier n'existe pas encore
        return []


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)