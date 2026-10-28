import re
from datetime import datetime

import pandas as pd

from config import CLEAN_DATA_PATH, RAW_DATA_PATH
from utils import brand_from_title

MIN_PRICE_MILLIONS = 50
MIN_YEAR = 1980


def extract_price(price_str):
    """Convert a raw price string to 'millions' (1 million = 10,000 DA).

    Examples: '350 Millions' -> 350, '3 500 000 DA' -> 350, '1,5 Milliards' -> 1500
    """
    text = str(price_str).lower().replace("\xa0", " ")
    # Glue digit groups written with spaces: '3 500 000' -> '3500000'
    text = re.sub(r"(?<=\d)\s+(?=\d)", "", text)

    # Case 1: the price already has a unit (millions / milliards)
    match = re.search(r"(\d+(?:[.,]\d+)?)\s*(milliards?|millions?)", text)
    if match:
        value = float(match.group(1).replace(",", "."))
        return value * 1000 if match.group(2).startswith("milliard") else value

    # Case 2: a plain number in dinars
    match = re.search(r"\d+", text)
    if not match:
        return None
    value = int(match.group())
    return round(value / 10000, 2) if value > 50000 else value


def extract_year(title_str):
    """Find a realistic manufacturing year (1980 -> next year) inside the title."""
    max_year = datetime.now().year + 1
    for match in re.finditer(r"\b(19[89]\d|20\d{2})\b", str(title_str)):
        year = int(match.group())
        if MIN_YEAR <= year <= max_year:
            return year
    return None


def clean_data() -> bool:
    print("Loading raw data file...")

    if not RAW_DATA_PATH.exists():
        print(f"❌ Error: {RAW_DATA_PATH} not found. Run scraper.py first.")
        return False

    df = pd.read_csv(RAW_DATA_PATH)
    print(f"Total records before cleaning: {len(df)}")

    df_clean = df[df["Price"] != "Price not displayed"].copy()

    df_clean["Price_Millions"] = df_clean["Price"].apply(extract_price)
    df_clean["Year"] = df_clean["Title"].apply(extract_year)
    df_clean["Brand"] = df_clean["Title"].apply(brand_from_title)

    df_clean = df_clean.dropna(subset=["Price_Millions", "Year"])
    df_clean = df_clean.drop_duplicates(subset=["Title", "Price_Millions"], keep="first")

    df_clean["Year"] = df_clean["Year"].astype(int)
    df_clean = df_clean[df_clean["Price_Millions"] >= MIN_PRICE_MILLIONS]

    print(f"\nTotal records after cleaning: {len(df_clean)}")

    if df_clean.empty:
        print("❌ No valid records left after cleaning.")
        return False

    df_clean.to_csv(CLEAN_DATA_PATH, index=False, encoding="utf-8-sig")
    print(f"Data successfully saved to '{CLEAN_DATA_PATH}'.")
    return True


if __name__ == "__main__":
    clean_data()