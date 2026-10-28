import datetime

import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import KFold, cross_val_predict

from config import CLEAN_DATA_PATH, HISTORY_PATH, PREDICTIONS_PATH
from train_regression import build_pipeline

MIN_ROWS = 30


def update_history(avg_price):
    """Keep one row per day: re-running the pipeline the same day replaces that day's value."""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    new_row = pd.DataFrame([{"Date": today, "Average_Price": avg_price}])

    if HISTORY_PATH.exists():
        history = pd.read_csv(HISTORY_PATH)
        history = history[history["Date"] != today]
        history = pd.concat([history, new_row], ignore_index=True)
    else:
        history = new_row

    history.to_csv(HISTORY_PATH, index=False)
    print("Historical average saved.")


def detect_anomalies() -> bool:
    print("Loading cleaned data file...")

    if not CLEAN_DATA_PATH.exists():
        print(f"❌ Error: {CLEAN_DATA_PATH} not found. Run cleaner.py first.")
        return False

    df = pd.read_csv(CLEAN_DATA_PATH)

    if len(df) < MIN_ROWS:
        print(f"⚠️ Not enough data for anomaly detection ({len(df)} rows, need {MIN_ROWS}).")
        return False

    X = df[["Brand", "Year"]]
    y = df["Price_Millions"]

    # Out-of-fold predictions: every car is priced by a model that never saw that car,
    # otherwise the Random Forest would just memorize the prices and show no discounts
    print("\nComputing fair prices (cross-validated)...")
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    df["Predicted_Price"] = cross_val_predict(build_pipeline(), X, y, cv=cv).round(2)

    # Positive discount = the listing is cheaper than the fair market price
    df["Discount_Pct"] = (
        (df["Predicted_Price"] - df["Price_Millions"]) / df["Predicted_Price"] * 100
    ).round(1)

    print("Starting anomaly detection model...")
    features = df[["Year", "Price_Millions", "Discount_Pct"]]
    outliers = IsolationForest(contamination=0.1, random_state=42).fit_predict(features)

    # Anomaly = -1 only for statistical outliers that are also UNDERPRICED ("good deals")
    df["Anomaly"] = 1
    df.loc[(outliers == -1) & (df["Discount_Pct"] > 0), "Anomaly"] = -1
    print(f"Good deals found: {(df['Anomaly'] == -1).sum()} / {len(df)}")

    update_history(round(df["Price_Millions"].mean(), 2))

    df.to_csv(PREDICTIONS_PATH, index=False, encoding="utf-8-sig")
    print(f"\nData successfully saved to '{PREDICTIONS_PATH}'.")
    return True


if __name__ == "__main__":
    detect_anomalies()