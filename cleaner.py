import pandas as pd
import re

def clean_data():
    print("Fichier ...")
    df = pd.read_csv("cars_raw_data_multi.csv")
    print(f"Total before clean: {len(df)}")

    df_clean = df[df['Prix'] != 'Prix non affiché'].copy()

    def extract_price(prix_str):
        numeros = re.findall(r'\d+', str(prix_str))
        if numeros:
            return int(''.join(numeros))
        return None

    df_clean['Prix_Millions'] = df_clean['Prix'].apply(extract_price)

    def extract_year(titre_str):
        match = re.search(r'(19|20)\d{2}', str(titre_str))
        if match:
            return int(match.group())
        return None

    df_clean['Annee'] = df_clean['Titre'].apply(extract_year)

    
    df_clean['Marque'] = df_clean['Titre'].apply(lambda x: str(x).split()[0] if len(str(x).split()) > 0 else "Autre")

    df_clean = df_clean.dropna(subset=['Prix_Millions', 'Annee'])
    
    df_clean = df_clean.drop_duplicates(subset=['Titre', 'Prix_Millions'], keep='first')
    # ++++++++++++++++++++++++++++++++++
    
    df_clean['Annee'] = df_clean['Annee'].astype(int)

    print(f"\nTotal after clean: {len(df_clean)}")
    
    print("\n--- Cars ---")
    print(df_clean[['Titre', 'Annee', 'Prix_Millions']].head())

    df_clean.to_csv("cars_cleaned_data.csv", index=False, encoding='utf-8-sig')
    print("\nDone 'cars_cleaned_data.csv'.")

if __name__ == "__main__":
    clean_data()