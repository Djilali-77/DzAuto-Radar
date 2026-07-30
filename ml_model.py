import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies():
    print("Fichier ...")
    df = pd.read_csv("cars_cleaned_data.csv")
    
    if len(df) < 50:
        print("⚠️ Alert: small amount fo data ")

    
    X = df[['Annee', 'Prix_Millions']]

    print("\nStarting model ...")
    model = IsolationForest(contamination=0.1, random_state=42)

    df['Anomalie'] = model.fit_predict(X)

    bonnes_affaires = df[df['Anomalie'] == -1]
    
    print("\n--- 🚨 Les Anomalies ---")
    if len(bonnes_affaires) > 0:
        print(bonnes_affaires[['Titre', 'Annee', 'Prix_Millions']])
    else:
        print("No anomalies.")

    df.to_csv("cars_with_predictions.csv", index=False, encoding='utf-8-sig')
    print("\nDone 'cars_with_predictions.csv'.")

if __name__ == "__main__":
    detect_anomalies()