import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

def train_model():
    print("Fichier ...")
    df = pd.read_csv("cars_cleaned_data.csv")
    
    if len(df) < 10:
        print("⚠️ Alert: small amount fo data ")
        return

    X = df[['Marque', 'Annee']]
    y = df['Prix_Millions']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Marque'])
        ],
        remainder='passthrough'
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    print("Regression start ...")
    model.fit(X, y)

    joblib.dump(model, "car_price_model.pkl")
    print("Done 'car_price_model.pkl'.")

if __name__ == "__main__":
    train_model()