import os
from datetime import datetime

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from config import HISTORY_PATH, MODEL_PATH, PREDICTIONS_PATH
from utils import normalize_brand

MIN_YEAR = 1980
MAX_YEAR = datetime.now().year + 1

app = FastAPI(
    title="Car Market API",
    description="API to read car announcements, prices, and anomalies.",
)

# Allowed frontend origins (comma separated), the Vite dev server by default
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple file cache: a file is reloaded only when it changed on disk,
# so re-running the pipeline never requires restarting the API
_cache = {}


def load_cached(key, path, loader):
    if not path.exists():
        return None
    mtime = path.stat().st_mtime
    cached_mtime, cached_value = _cache.get(key, (None, None))
    if cached_mtime != mtime:
        cached_value = loader(path)
        _cache[key] = (mtime, cached_value)
    return cached_value


def get_cars_df() -> pd.DataFrame:
    df = load_cached("cars", PREDICTIONS_PATH, pd.read_csv)
    if df is None:
        raise HTTPException(
            status_code=503,
            detail="Data file not found. Please run the pipeline first (python run_all.py).",
        )
    return df


def get_model():
    model = load_cached("model", MODEL_PATH, joblib.load)
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="The regression model has not been trained yet. Please run the pipeline first.",
        )
    return model


def get_known_brands(model):
    """Brands the model saw during training (read from the one-hot encoder)."""
    encoder = model.named_steps["preprocessor"].named_transformers_["cat"]
    return sorted(str(brand) for brand in encoder.categories_[0])


def to_records(df: pd.DataFrame):
    """DataFrame -> list of dicts, with NaN replaced by None (NaN is not valid JSON)."""
    return df.astype(object).where(pd.notnull(df), None).to_dict(orient="records")


@app.get("/api/cars")
def get_all_cars(limit: int = Query(50, ge=1, le=500)):
    return to_records(get_cars_df().head(limit))


@app.get("/api/anomalies")
def get_anomalies():
    df = get_cars_df()
    deals = df[df["Anomaly"] == -1].sort_values("Discount_Pct", ascending=False)
    return to_records(deals)


@app.get("/api/stats")
def get_stats():
    df = get_cars_df()
    return {
        "total_cars": int(len(df)),
        "total_anomalies": int((df["Anomaly"] == -1).sum()),
        "average_price_millions": round(float(df["Price_Millions"].mean()), 2),
    }


@app.get("/api/brands")
def get_brands():
    return get_known_brands(get_model())


@app.get("/api/predict")
def predict_price(
    brand: str = Query(..., min_length=1),
    year: int = Query(..., ge=MIN_YEAR, le=MAX_YEAR),
):
    model = get_model()
    formatted_brand = normalize_brand(brand)

    if formatted_brand not in get_known_brands(model):
        raise HTTPException(
            status_code=404,
            detail=f"Brand '{formatted_brand}' was not seen during training. See /api/brands.",
        )

    input_data = pd.DataFrame({"Brand": [formatted_brand], "Year": [year]})
    try:
        predicted_price = model.predict(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return {
        "brand": formatted_brand,
        "year": year,
        "estimated_price_millions": round(float(predicted_price[0]), 2),
    }


@app.get("/api/history")
def get_history():
    if not HISTORY_PATH.exists():
        return []
    df_hist = pd.read_csv(HISTORY_PATH)
    df_hist = df_hist.groupby("Date", as_index=False)["Average_Price"].mean()
    df_hist["Average_Price"] = df_hist["Average_Price"].round(2)
    return to_records(df_hist.sort_values("Date"))


@app.api_route("/ping", methods=["GET", "HEAD"])
def ping():
    return {"status": "alive", "message": "Server is alive"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)