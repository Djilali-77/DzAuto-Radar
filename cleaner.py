import pandas as pd
import re

def clean_data():
    print("Loading raw data file...")
    df = pd.read_csv("cars_raw_data_multi.csv")
    print(f"Total records before cleaning: {len(df)}")

    # Remove rows where price is not displayed
    df_clean = df[df['Price'] != 'Price not displayed'].copy()

    def extract_price(price_str):
        numbers = re.findall(r'\d+', str(price_str))
        if numbers:
            return int(''.join(numbers))
        return None

    df_clean['Price_Millions'] = df_clean['Price'].apply(extract_price)

    def extract_year(title_str):
        match = re.search(r'(19|20)\d{2}', str(title_str))
        if match:
            return int(match.group())
        return None

    df_clean['Year'] = df_clean['Title'].apply(extract_year)

    # Extract brand (assuming it's the first word of the title)
    df_clean['Brand'] = df_clean['Title'].apply(lambda x: str(x).split()[0] if len(str(x).split()) > 0 else "Other")

    # Drop missing values and duplicates
    df_clean = df_clean.dropna(subset=['Price_Millions', 'Year'])
    df_clean = df_clean.drop_duplicates(subset=['Title', 'Price_Millions'], keep='first')
    
    # Ensure year is an integer
    df_clean['Year'] = df_clean['Year'].astype(int)

    print(f"\nTotal records after cleaning: {len(df_clean)}")
    
    print("\n--- Sample of Cleaned Cars ---")
    print(df_clean[['Title', 'Year', 'Price_Millions']].head())

    df_clean.to_csv("cars_cleaned_data.csv", index=False, encoding='utf-8-sig')
    print("\nData successfully saved to 'cars_cleaned_data.csv'.")

if __name__ == "__main__":
    clean_data()