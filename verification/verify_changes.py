from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/")

        # Give it a moment to load
        page.wait_for_timeout(2000)

        # Screenshot the initial Home tab
        page.screenshot(path="verification/step1_home.png")
        print("Home tab screenshot saved.")

        # Click on Lab tab (using the Flask icon/aria-label)
        # Assuming the button has "Laboratorium" text hidden (sr-only) but we can try locating by SVG or parent button
        # The code has <span className="sr-only">Laboratorium</span>
        lab_button = page.get_by_role("button", name="Laboratorium")
        if lab_button.count() > 0:
            lab_button.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/step2_lab.png")
            print("Lab tab screenshot saved.")
        else:
            print("Lab button not found!")

        # Check for Research Items
        # Should see "Badania nad Kofeiną"
        if page.get_by_text("Badania nad Kofeiną").is_visible():
            print("Research 'Badania nad Kofeiną' is visible.")
        else:
            print("Research 'Badania nad Kofeiną' NOT visible.")

        # Check for Evolutions - should see empty state message or evolutions
        # "Kup podstawowe przedmioty (Kreda, Gąbka, Kartkówka) w sklepie, aby odblokować ewolucje."
        if page.get_by_text("Kup podstawowe przedmioty").is_visible():
             print("Evolution empty state visible (correct).")

        # Click on Hardware tab
        hw_button = page.get_by_role("button", name="Serwerownia")
        hw_button.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/step3_hardware.png")

        # Check for new categories: RAM, Chłodzenie, Zasilanie
        if page.get_by_text("RAM").is_visible():
            print("RAM category visible.")
        if page.get_by_text("Chłodzenie").is_visible():
            print("Cooling category visible.")
        if page.get_by_text("Zasilanie").is_visible():
            print("Power category visible.")

        browser.close()

if __name__ == "__main__":
    verify_app()
