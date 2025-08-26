from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080/")
        page.wait_for_selector("h1") # Wait for the main heading to be visible
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

if __name__ == "__main__":
    run()
