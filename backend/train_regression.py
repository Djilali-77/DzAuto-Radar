import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from config import CLEAN_DATA_PATH, MODEL_PATH

MIN_ROWS = 30


def build_pipeline():
    """Brand is one-hot encoded, Year is passed through as a number."""
    preprocessor = ColumnTransformer(
        transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), ["Brand"])],
        remainder="passthrough",
    )
    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "regressor",
                RandomForestRegressor(
                    n_estimators=200, min_samples_leaf=2, random_state=42, n_jobs=-1
                ),
            ),
        ]
    )


def train_model() -> bool:
    print("Loading cleaned data file...")

    if not CLEAN_DATA_PATH.exists():
        print(f"❌ Error: {CLEAN_DATA_PATH} not found. Run cleaner.py first.")
        return False

    df = pd.read_csv(CLEAN_DATA_PATH)

    if len(df) < MIN_ROWS:
        print(f"⚠️ Insufficient data to train the model ({len(df)} rows, need {MIN_ROWS}).")
        return False

    X = df[["Brand", "Year"]]
    y = df["Price_Millions"]

    # Step 1: evaluate on data the model has never seen
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    evaluator = build_pipeline()
    evaluator.fit(X_train, y_train)
    predictions = evaluator.predict(X_test)
    print(f"Evaluation -> MAE: {mean_absolute_error(y_test, predictions):.2f} millions | "
          f"R2: {r2_score(y_test, predictions):.3f}")

    # Step 2: train the final model on all the data and save it
    print("Training final regression model...")
    final_model = build_pipeline()
    final_model.fit(X, y)

    joblib.dump(final_model, MODEL_PATH)
    print(f"Model successfully saved as '{MODEL_PATH}'.")
    return True


if __name__ == "__main__":
    train_model()