import argparse
import asyncio
import sys

from cleaner import clean_data
from ml_model import detect_anomalies
from scraper import extract_cars_data
from train_regression import train_model


def main():
    parser = argparse.ArgumentParser(description="Run the full DzAuto-Radar pipeline.")
    parser.add_argument("--skip-scrape", action="store_true",
                        help="Reuse the existing raw CSV instead of scraping again.")
    args = parser.parse_args()

    if args.skip_scrape:
        print("\n=== [1/4] Scraping skipped ===")
    else:
        print("\n=== [1/4] Scraping ===")
        if not asyncio.run(extract_cars_data()):
            print("⚠️ Scraping saved nothing, continuing with the previous raw data (if any).")

    print("\n=== [2/4] Cleaning ===")
    if not clean_data():
        sys.exit("Pipeline stopped at the cleaning step.")

    print("\n=== [3/4] Training regression model ===")
    if not train_model():
        sys.exit("Pipeline stopped at the training step.")

    print("\n=== [4/4] Detecting good deals ===")
    if not detect_anomalies():
        sys.exit("Pipeline stopped at the anomaly detection step.")

    print("\n✅ Pipeline finished successfully.")


if __name__ == "__main__":
    main()