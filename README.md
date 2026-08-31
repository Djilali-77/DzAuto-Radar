# 🚙 DzAuto-Radar (Ouedkniss Car Market Pipeline)

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-00a393)
![Scikit-Learn](https://img.shields.io/badge/Machine_Learning-Scikit_Learn-orange)
![Playwright](https://img.shields.io/badge/Scraping-Playwright-green)
![Pandas](https://img.shields.io/badge/Data_Processing-Pandas-150458)

## 📌 Overview
**DzAuto-Radar** is an end-to-end data pipeline and machine learning project that scrapes car market data from the Algerian platform **Ouedkniss**. It cleans the data, detects market anomalies (identifying exceptionally good deals), trains a machine learning model to predict car prices, and serves the results through a fast and modern API.

## ✨ Features
*   **🕸️ Web Scraping:** Uses `Playwright` (async) to scrape car listings (titles, prices, links) efficiently while handling dynamic content.
*   **🧹 Data Cleaning:** Processes raw data using `Pandas` and regular expressions to extract clean numeric values for years and prices (in millions).
*   **🚨 Anomaly Detection:** Utilizes `Isolation Forest` to detect price anomalies and highlight potential "Good Deals" in the market.
*   **🤖 Price Prediction:** Trains a `Random Forest Regressor` model to estimate the price of a car based on its brand and manufacturing year.
*   **⚡ FastAPI Backend:** Exposes clean REST API endpoints for cars, market stats, price history, anomaly detection, and real-time price prediction.

## 📂 Project Structure
Based on the repository layout:

```text
📦 DzAuto-Radar
 ┣ 📜 scrapper.py             # Playwright script to scrape Ouedkniss data
 ┣ 📜 cleaner.py              # Cleans and formats the raw CSV data
 ┣ 📜 train_regression.py     # Trains the Random Forest price prediction model
 ┣ 📜 ml_model.py             # Runs Isolation Forest for anomaly/good deal detection
 ┣ 📜 api.py                  # FastAPI server and endpoints
 ┣ 📜 requirements.txt        # Python dependencies
 ┣ 📜 Procfile                # Deployment configuration
 ┣ 📂 frontend                # Frontend assets/code (if applicable)
 ┗ 📂 venv                    # Python virtual environment
```

## 🚀 How to Run the Project

### 1. Prerequisites
Make sure you have Python installed, then clone the repository and install the dependencies:

```bash
git clone [https://github.com/YOUR_USERNAME/DzAuto-Radar.git](https://github.com/YOUR_USERNAME/DzAuto-Radar.git)
cd DzAuto-Radar
pip install -r requirements.txt
playwright install chromium
```

### 2. Execute the Pipeline
You must run the scripts in this specific order to generate the datasets and models:

**Step A: Scrape the data**
```bash
python scrapper.py
```

**Step B: Clean the data**
```bash
python cleaner.py
```

**Step C: Train the Prediction Model**
```bash
python train_regression.py
```

**Step D: Run Anomaly Detection**
```bash
python ml_model.py
```

### 3. Start the API
Once all data and models are ready, launch the FastAPI server:

```bash
uvicorn api:app --reload
```
The API will be available at: `http://127.0.0.1:8000`

## 📡 API Endpoints
You can explore the interactive API documentation (Swagger UI) by navigating to `http://127.0.0.1:8000/docs` in your browser.

*   `GET /api/cars?limit=50` : Fetch a list of cleaned car records.
*   `GET /api/stats` : Get general market statistics (total cars, average price, etc.).
*   `GET /api/anomalies` : Retrieve detected market anomalies (good deals).
*   `GET /api/predict?brand=Peugeot&year=2018` : Predict the price of a specific car.
*   `GET /api/history` : Get the daily average market price history.

## 🛠️ Built With
*   **Python**
*   **FastAPI** & **Uvicorn**
*   **Pandas** & **Scikit-Learn**
*   **Playwright**

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
