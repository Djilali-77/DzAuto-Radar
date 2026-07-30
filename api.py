from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

app = FastAPI(title="Car Market API", description="API pour lire les annonces et les anomalies")

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
        return {"erreur": "L'fichier CSV ma yexistich."}

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
        return [car for car in data if car.get("Anomalie") == -1]
    return data

@app.get("/api/stats")
def get_stats():
    try:
        df = pd.read_csv("cars_with_predictions.csv")
        return {
            "total_cars": len(df),
            "total_anomalies": len(df[df['Anomalie'] == -1]),
            "prix_moyen_millions": round(df['Prix_Millions'].mean(), 2)
        }
    except Exception as e:
        return {"erreur": str(e)}

try:
    price_model = joblib.load("car_price_model.pkl")
except:
    price_model = None

@app.get("/api/predict")
def predict_price(marque: str, annee: int):
    if not price_model:
        return {"erreur": "L'modèle ta3 regression mazal ma t'entrainach."}
    
    # Correction Mohima: N'rodo l'harf lowel Majuscule bach y'matchi m3a l'modèle
    marque_formatee = marque.strip().capitalize()
    
    input_data = pd.DataFrame({'Marque': [marque_formatee], 'Annee': [annee]})
    
    try:
        predicted_price = price_model.predict(input_data)
        return {
            "marque": marque_formatee,
            "annee": annee,
            "prix_estime_millions": round(float(predicted_price[0]), 2)
        }
    except Exception as e:
        # Ida la marque ma kanets t'entrainatch gaç f l'modèle
        return {"prix_estime_millions": 0, "message": "Marque non reconnue par le modèle"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)