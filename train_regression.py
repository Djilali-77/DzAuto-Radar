import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

def train_model():
    print("Loading cleaned data file...")
    df = pd.read_csv("cars_cleaned_data.csv")
    
    if len(df) < 10:
        print("⚠️ Warning: Insufficient data to train the model.")
        return

    X = df[['Brand', 'Year']]
    y = df['Price_Millions']

    # Preprocessing: OneHotEncode the 'Brand' column
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Brand'])
        ],
        remainder='passthrough'
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    print("Starting regression model training...")
    model.fit(X, y)

    joblib.dump(model, "car_price_model.pkl")
    print("Model successfully saved as 'car_price_model.pkl'.")

if __name__ == "__main__":
    train_model()