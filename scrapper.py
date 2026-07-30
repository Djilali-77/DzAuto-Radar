import asyncio
import pandas as pd
import random
from playwright.async_api import async_playwright

async def extract_cars_data():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        liste_voitures = []
        nombre_de_pages = 100
        
        for i in range(1, nombre_de_pages + 1):
            url = f"https://www.ouedkniss.com/automobiles/{i}"
            print(f"\n---> Page {i} : {url}")
            
            try:
                await page.goto(url, wait_until="domcontentloaded")
                
                await page.wait_for_timeout(4000)
                
                cartes = await page.locator("div.o-announ-card").all()
                
                if not cartes:
                    print("No announce.")
                    break
                
                for carte in cartes:
                    try:
                        titre_element = carte.locator("h3.o-announ-card-title")
                        titre = await titre_element.inner_text() if await titre_element.count() > 0 else "N/A"
                        
                        prix_element = carte.locator("span.price")
                        if await prix_element.count() > 0:
                            prix = (await prix_element.inner_text()).replace('\n', ' ')
                        else:
                            prix = "Prix non affiché"
                        
                        lien_element = carte.locator("a.v-card--link")
                        if await lien_element.count() > 0:
                            lien = "https://www.ouedkniss.com" + await lien_element.get_attribute("href")
                        else:
                            lien = "N/A"
                        
                        liste_voitures.append({
                            "Titre": titre.strip(),
                            "Prix": prix.strip(),
                            "Lien": lien
                        })
                        
                    except Exception as e:
                        continue
                
                sleep_time = random.uniform(2, 5)
                print(f"Nstnaw {sleep_time:.2f} secondes bach nroho l'page li moraha...")
                await page.wait_for_timeout(int(sleep_time * 1000))
                
            except Exception as e:
                print(f"Erreur f la page {i}: {e}")
                continue
                
        df = pd.DataFrame(liste_voitures)
        print(f"\n======================================")
        print(f"Total of cars : {len(df)}")
        print(f"======================================")
        
        df.to_csv("cars_raw_data_multi.csv", index=False, encoding='utf-8-sig')
        print("Les données t'sauvgardaw f 'cars_raw_data_multi.csv'.")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(extract_cars_data())