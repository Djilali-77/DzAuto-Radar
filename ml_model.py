import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies():
    print("Loading cleaned data file...")
    df = pd.read_csv("cars_cleaned_data.csv")
    
    if len(df) < 50:
        print("⚠️ Warning: Small amount of data detected. Anomaly detection might not be accurate.")

    X = df[['Year', 'Price_Millions']]

    print("\nStarting anomaly detection model...")
    model = IsolationForest(contamination=0.1, random_state=42)

    df['Anomaly'] = model.fit_predict(X)

    # Isolation Forest labels anomalies as -1
    good_deals = df[df['Anomaly'] == -1]
    
    print("\n--- 🚨 Detected Anomalies / Good Deals ---")
    if len(good_deals) > 0:
        print(good_deals[['Title', 'Year', 'Price_Millions']])
    else:
        print("No anomalies detected.")

    df.to_csv("cars_with_predictions.csv", index=False, encoding='utf-8-sig')
    print("\nData successfully saved to 'cars_with_predictions.csv'.")

if __name__ == "__main__":
    detect_anomalies()