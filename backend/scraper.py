import asyncio
import random

import pandas as pd
from playwright.async_api import async_playwright

from config import RAW_DATA_PATH

BASE_URL = "https://www.ouedkniss.com"
NUM_PAGES = 20
# Stop early if the site keeps blocking us (anti-bot), instead of wasting time
MAX_CONSECUTIVE_FAILURES = 3

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# Smooth scrolling so lazy-loaded cards have time to appear
SCROLL_SCRIPT = """
async () => {
    await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
            }
        }, 150);
    });
}
"""


async def parse_card(card):
    """Extract title, price and link from one announcement card."""
    title_el = card.locator("h3.o-announ-card-title")
    title = (await title_el.first.inner_text()).strip() if await title_el.count() > 0 else "N/A"

    price_el = card.locator("span.price")
    if await price_el.count() > 0:
        price = (await price_el.first.inner_text()).replace("\n", " ").strip()
    else:
        price = "Price not displayed"

    link = "N/A"
    link_el = card.locator("a.o-announ-card-content")
    if await link_el.count() > 0:
        href = await link_el.first.get_attribute("href")
        if href:
            # The href can be relative or already absolute
            link = href if href.startswith("http") else BASE_URL + href

    return {"Title": title, "Price": price, "Link": link}


async def scrape_page(page, page_number):
    """Scrape one listing page. Returns a list of cars, or None if the page failed."""
    url = f"{BASE_URL}/automobiles_vehicules/{page_number}"
    print(f"\n---> Page {page_number} : {url}")

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_selector("div.o-announ-card", timeout=15000)
        await page.evaluate(SCROLL_SCRIPT)
        await page.wait_for_timeout(2000)
    except Exception as e:
        print(f"⚠️ Page {page_number} failed (timeout or anti-bot): {e}")
        return None

    cars = []
    for card in await page.locator("div.o-announ-card").all():
        try:
            cars.append(await parse_card(card))
        except Exception:
            # Skip a broken card, keep the rest of the page
            continue

    print(f"Found {len(cars)} announcements.")
    return cars


def save_results(cars_list) -> bool:
    print("\n======================================")
    print(f"Total cars scraped : {len(cars_list)}")
    print("======================================")

    if not cars_list:
        print("⚠️ Anti-bot triggered or no cars found! Keeping the old data.")
        return False

    pd.DataFrame(cars_list).to_csv(RAW_DATA_PATH, index=False, encoding="utf-8-sig")
    print(f"✅ Data successfully saved in '{RAW_DATA_PATH}'.")
    return True


async def extract_cars_data() -> bool:
    """Scrape all pages. Returns True if new data was saved."""
    cars_list = []
    failures_in_a_row = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        )
        try:
            context = await browser.new_context(
                user_agent=USER_AGENT,
                viewport={"width": 1280, "height": 800},
            )
            page = await context.new_page()

            for page_number in range(1, NUM_PAGES + 1):
                cars = await scrape_page(page, page_number)

                if cars is None:
                    failures_in_a_row += 1
                    if failures_in_a_row >= MAX_CONSECUTIVE_FAILURES:
                        print("❌ Too many failed pages in a row, stopping the scraper.")
                        break
                    continue

                failures_in_a_row = 0
                cars_list.extend(cars)

                # Random pause between pages to stay polite
                sleep_time = random.uniform(3, 6)
                print(f"Waiting {sleep_time:.2f} seconds...")
                await page.wait_for_timeout(int(sleep_time * 1000))
        finally:
            await browser.close()

    return save_results(cars_list)


if __name__ == "__main__":
    asyncio.run(extract_cars_data())