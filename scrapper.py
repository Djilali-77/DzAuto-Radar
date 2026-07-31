import asyncio
import pandas as pd
import random
from playwright.async_api import async_playwright

async def extract_cars_data():
    async with async_playwright() as p:
        # headless=False opens the browser visibly. Set to True to hide it.
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        cars_list = []
        num_pages = 100
        
        for i in range(1, num_pages + 1):
            url = f"https://www.ouedkniss.com/automobiles/{i}"
            print(f"\n---> Page {i} : {url}")
            
            try:
                await page.goto(url, wait_until="domcontentloaded")
                await page.wait_for_timeout(4000)
                
                cards = await page.locator("div.o-announ-card").all()
                
                if not cards:
                    print("No announcements found.")
                    break
                
                for card in cards:
                    try:
                        title_element = card.locator("h3.o-announ-card-title")
                        title = await title_element.inner_text() if await title_element.count() > 0 else "N/A"
                        
                        price_element = card.locator("span.price")
                        if await price_element.count() > 0:
                            price = (await price_element.inner_text()).replace('\n', ' ')
                        else:
                            price = "Price not displayed"
                        
                        link_element = card.locator("a.v-card--link")
                        if await link_element.count() > 0:
                            link = "https://www.ouedkniss.com" + await link_element.get_attribute("href")
                        else:
                            link = "N/A"
                        
                        cars_list.append({
                            "Title": title.strip(),
                            "Price": price.strip(),
                            "Link": link
                        })
                        
                    except Exception as e:
                        continue
                
                sleep_time = random.uniform(2, 5)
                print(f"Waiting {sleep_time:.2f} seconds...")
                await page.wait_for_timeout(int(sleep_time * 1000))
                
            except Exception as e:
                print(f"Error on page {i}: {e}")
                continue
                
        df = pd.DataFrame(cars_list)
        print(f"\n======================================")
        print(f"Total cars scraped : {len(df)}")
        print(f"======================================")
        
        df.to_csv("cars_raw_data_multi.csv", index=False, encoding='utf-8-sig')
        print("Data saved in 'cars_raw_data_multi.csv'.")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(extract_cars_data())