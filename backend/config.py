import os
from pathlib import Path

# Project root = parent folder of "backend" (used when running locally)
BASE_DIR = Path(__file__).resolve().parent.parent

# In Docker these are overridden with environment variables (see docker-compose.yml)
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
MODELS_DIR = Path(os.getenv("MODELS_DIR", BASE_DIR / "models"))

# Make sure the folders exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Every file path of the pipeline lives here, so no script hardcodes paths
RAW_DATA_PATH = DATA_DIR / "cars_raw_data_multi.csv"
CLEAN_DATA_PATH = DATA_DIR / "cars_cleaned_data.csv"
PREDICTIONS_PATH = DATA_DIR / "cars_with_predictions.csv"
HISTORY_PATH = DATA_DIR / "price_history.csv"
MODEL_PATH = MODELS_DIR / "car_price_model.pkl"