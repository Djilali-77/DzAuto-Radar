# 🚗 End-to-End Car Market Intelligence Pipeline

![Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![Machine Learning](https://img.shields.io/badge/Machine_Learning-Scikit_Learn-F7931E)

An automated, end-to-end data science and machine learning platform designed to scrape, analyze, and predict the Algerian car market prices. The project features automated data pipelines, anomaly detection to spot good deals or fake listings, and a dynamic React dashboard.

## ✨ Features

*   **🤖 Automated Web Scraping:** Uses `Playwright` to extract live car listings.
*   **🧹 Data Pipeline:** Cleans and processes raw data using `Pandas`.
*   **🚨 Anomaly Detection:** Utilizes an `IsolationForest` model to detect outliers (abnormally low or high prices).
*   **📈 Price Simulator:** A `RandomForestRegressor` model that predicts car prices based on Brand and Year.
*   **📊 Historical Trends:** Automatically tracks and visualizes the global market average price over time.
*   **⚙️ CI/CD Automation:** Fully automated via `GitHub Actions` to run the scraping and ML training every week.
*   **🎨 Modern Dashboard:** Built with React, Tailwind CSS, and Recharts, featuring a dynamic Dark/Light mode.

## 🏗️ Architecture & Tech Stack

*   **Frontend:** React, Tailwind CSS, Recharts, Axios, Lucide Icons (Deployed on **Vercel**).
*   **Backend:** Python, FastAPI, Uvicorn (Deployed on **Render**).
*   **Data Science:** Pandas, Scikit-Learn, Joblib.
*   **Automation:** GitHub Actions (Cron Jobs).

## 📂 Project Structure

    📦 car-market-pipeline
     ┣ 📂 .github/workflows      # GitHub Actions automation pipeline
     ┃ ┗ 📜 pipeline.yml
     ┣ 📂 frontend               # React UI Application
     ┃ ┗ 📜 App.jsx              # Main Dashboard Component
     ┣ 📜 scraper.py             # Playwright web scraper
     ┣ 📜 cleaner.py             # Pandas data cleaning script
     ┣ 📜 ml_model.py            # Isolation Forest (Anomaly Detection)
     ┣ 📜 regression.py          # Random Forest (Price Prediction)
     ┣ 📜 api.py                 # FastAPI backend server
     ┣ 📜 requirements.txt       # Python dependencies
     ┗ 📜 README.md

## 🚀 How to Run Locally

### 1. Backend & Data Pipeline
Ensure you have Python 3.10+ installed.

    # Install dependencies
    pip install -r requirements.txt
    playwright install chromium

    # Run the pipeline sequentially
    python scraper.py
    python cleaner.py
    python ml_model.py
    python regression.py

    # Start the API server
    uvicorn api:app --reload

The API will be available at http://127.0.0.1:8000.

### 2. Frontend
Open a new terminal and navigate to your frontend folder.

    # Install dependencies
    npm install

    # Start the React app
    npm run dev

## 🔄 Automation (GitHub Actions)
The data pipeline is fully automated. The `pipeline.yml` file is configured to run a cron job every Sunday at midnight (UTC).
It safely handles anti-bot blocks by keeping the previous week's dataset if no new cars are scraped, ensuring 100% uptime for the dashboard.

## 🤝 Author
Built by **Djilali**.
