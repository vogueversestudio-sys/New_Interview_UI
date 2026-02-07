# Playwright Interview Questions & Answers — SDET India 2026
## Vikrant Mishra — SDET Interview Prep
## Companies: Accenture, Wipro, Capgemini, TCS, Infosys, Cognizant, HCL, Publicis Sapient, Deloitte, EPAM
## Locations: Noida, Pune, Hyderabad, Bangalore, Gurugram, Dubai

> **Playwright is the #1 trending test automation framework in 2026.**
> Companies across India are rapidly adopting it over Selenium for new projects.
> This file covers both **Python** and **JavaScript/TypeScript** Playwright — focus on Python as per your current stack.

---

# PLAYWRIGHT FUNDAMENTALS

---

## Q1. What is Playwright? Why is it gaining popularity over Selenium?

**Playwright** is an open-source, end-to-end test automation framework developed by **Microsoft**. It supports **Chromium, Firefox, and WebKit** with a single API.

**Why companies are switching to Playwright in 2026:**

| Feature | Selenium | Playwright |
|---------|----------|------------|
| **Auto-waiting** | No — need explicit waits | **Yes** — built-in smart waits |
| **Speed** | Slower (WebDriver protocol) | **Faster** (CDP / BiDi protocol) |
| **Browser install** | WebDriverManager / manual | `playwright install` (one command) |
| **Parallel execution** | Selenium Grid / TestNG threading | **Built-in** browser contexts |
| **Codegen (recording)** | No | **Yes** — AI-powered recording |
| **Trace viewer** | Screenshots only | **Full trace** — DOM snapshots, network, console |
| **API testing** | Need REST Assured separately | **Built-in** `request` context |
| **Network mocking** | Not built-in | **Built-in** route interception |
| **Shadow DOM** | Complex JavaScript needed | **Native support** |
| **iframes** | `switchTo().frame()` | `frame_locator()` — simpler |
| **Multi-tab/window** | Complex `getWindowHandles()` | **Native multi-page** support |
| **Mobile emulation** | Need Appium | **Built-in** device emulation |
| **Video recording** | Third-party tools | **Built-in** per-test video |
| **Downloads/Uploads** | Complex setup | **Simple API** |
| **Languages** | Java, Python, C#, JS, Ruby | JS/TS, Python, Java, .NET |

**When to still use Selenium:**
- Legacy projects already built on Selenium
- Need Ruby or specific language bindings
- Team has deep Selenium expertise
- Safari testing (Playwright supports WebKit but not Safari directly)

---

## Q2. How to install and set up Playwright?

**Python setup:**
```bash
# Install Playwright
pip install playwright

# Install browsers (Chromium, Firefox, WebKit)
playwright install

# Install with dependencies (for CI/CD — Linux)
playwright install --with-deps

# Create new project with pytest-playwright
pip install pytest-playwright
```

**JavaScript/TypeScript setup:**
```bash
# New project
npm init playwright@latest

# This creates:
# playwright.config.ts
# tests/example.spec.ts
# package.json with @playwright/test
```

**Project structure (Python):**
```
playwright-automation/
├── tests/
│   ├── test_login.py
│   ├── test_dashboard.py
│   └── test_api.py
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   └── dashboard_page.py
├── utils/
│   ├── config.py
│   └── helpers.py
├── test_data/
│   └── users.json
├── pytest.ini / pyproject.toml
├── conftest.py          → fixtures (browser, page, context)
├── requirements.txt
└── playwright.config.py
```

---

## Q3. Write a basic Playwright test (Python)

```python
# test_login.py
import pytest
from playwright.sync_api import Page, expect

def test_valid_login(page: Page):
    # Navigate
    page.goto("https://app.example.com/login")

    # Fill form — auto-waits for elements
    page.fill("#username", "admin")
    page.fill("#password", "admin123")

    # Click — auto-waits for button to be clickable
    page.click("#loginBtn")

    # Assert — auto-waits and retries until condition met or timeout
    expect(page).to_have_url("**/dashboard")
    expect(page.locator(".welcome-message")).to_have_text("Welcome, admin")


def test_invalid_login(page: Page):
    page.goto("https://app.example.com/login")
    page.fill("#username", "wrong")
    page.fill("#password", "wrong")
    page.click("#loginBtn")

    expect(page.locator(".error-message")).to_be_visible()
    expect(page.locator(".error-message")).to_have_text("Invalid credentials")
```

**JavaScript/TypeScript version:**
```typescript
import { test, expect } from '@playwright/test';

test('valid login', async ({ page }) => {
    await page.goto('https://app.example.com/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('#loginBtn');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.welcome-message')).toHaveText('Welcome, admin');
});
```

---

## Q4. What are Playwright locator strategies?

**Playwright recommends user-facing locators (more resilient than CSS/XPath):**

```python
# 1. GET BY ROLE — BEST practice (accessibility-based)
page.get_by_role("button", name="Submit")
page.get_by_role("link", name="Sign Up")
page.get_by_role("textbox", name="Email")
page.get_by_role("checkbox", name="Remember me")
page.get_by_role("heading", name="Dashboard")

# 2. GET BY LABEL — for form fields
page.get_by_label("Email")
page.get_by_label("Password")

# 3. GET BY PLACEHOLDER
page.get_by_placeholder("Enter your email")

# 4. GET BY TEXT — for buttons, links, paragraphs
page.get_by_text("Login")
page.get_by_text("Welcome", exact=False)  # partial match

# 5. GET BY TEST ID — when data-testid attribute exists (recommended for automation)
page.get_by_test_id("login-button")
page.get_by_test_id("email-input")

# 6. GET BY ALT TEXT — for images
page.get_by_alt_text("Company Logo")

# 7. GET BY TITLE
page.get_by_title("Close dialog")

# 8. CSS SELECTOR — fallback
page.locator("css=#username")
page.locator("input[type='email']")
page.locator(".btn-primary")

# 9. XPATH — last resort
page.locator("xpath=//button[contains(text(), 'Submit')]")

# 10. CHAINING / FILTERING
page.locator(".card").filter(has_text="Premium").get_by_role("button", name="Buy")
page.locator("tr").filter(has_text="Vikrant").locator("td:nth-child(3)")
```

**Locator priority (Playwright recommendation):**
1. `get_by_role()` — accessibility, most resilient
2. `get_by_label()` — form fields
3. `get_by_test_id()` — custom test attributes
4. `get_by_text()` — visible text
5. `get_by_placeholder()` — input placeholders
6. CSS selector — when above don't work
7. XPath — only when CSS can't do it

---

## Q5. What is auto-waiting in Playwright? How is it different from Selenium waits?

**Playwright auto-waits before every action:**

| Action | What Playwright waits for automatically |
|--------|----------------------------------------|
| `click()` | Element is visible, stable (not animating), enabled, not obscured |
| `fill()` | Element is visible, enabled, editable |
| `check()` | Element is visible, enabled, unchecked |
| `expect()` | Re-checks condition until timeout (default 5s) |
| `goto()` | Page reaches `load` state |

**Comparison:**

```python
# SELENIUM — need explicit waits everywhere
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(EC.element_to_be_clickable((By.ID, "loginBtn")))
element.click()

# PLAYWRIGHT — NO waits needed
page.click("#loginBtn")  # auto-waits for clickable, then clicks
```

**Custom timeout when needed:**
```python
# Override timeout for a specific action
page.click("#slowButton", timeout=30000)  # 30 seconds

# Override globally
browser = playwright.chromium.launch()
context = browser.new_context()
context.set_default_timeout(15000)  # 15 seconds for all actions

# Wait for specific state
page.wait_for_load_state("networkidle")  # wait for all network requests to finish
page.wait_for_selector("#results", state="visible")
page.wait_for_url("**/dashboard")
```

---

## Q6. Explain Playwright architecture — Browser, Context, Page

```
Playwright
├── Browser (Chromium / Firefox / WebKit)
│   ├── BrowserContext 1 (like incognito — isolated session)
│   │   ├── Page 1 (tab)
│   │   ├── Page 2 (tab)
│   │   └── Page 3 (tab)
│   └── BrowserContext 2 (separate cookies, storage)
│       ├── Page 1
│       └── Page 2
└── Browser 2
    └── ...
```

**Key concepts:**

| Component | What it is | Isolation |
|-----------|-----------|-----------|
| **Browser** | Browser instance (Chrome, Firefox, WebKit) | Shared |
| **BrowserContext** | Isolated session (like incognito window) | **Cookies, storage, sessions are isolated** |
| **Page** | Single tab within a context | Shares context's cookies/storage |

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Launch browser
    browser = p.chromium.launch(headless=False)

    # Create isolated context (like incognito)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        locale="en-IN",
        timezone_id="Asia/Kolkata"
    )

    # Create page (tab) within context
    page = context.new_page()
    page.goto("https://example.com")

    # Create another context — completely isolated
    admin_context = browser.new_context(storage_state="admin-auth.json")
    admin_page = admin_context.new_page()

    # Cleanup
    context.close()
    admin_context.close()
    browser.close()
```

**Why BrowserContext matters:**
- **Parallel testing** — each test gets its own context (isolated cookies, no shared state)
- **Multi-user testing** — test admin and user simultaneously
- **No interference** — tests don't affect each other
- **Fast** — creating a new context is much faster than launching a new browser

---

## Q7. How to handle assertions in Playwright?

```python
from playwright.sync_api import expect

# PAGE-LEVEL ASSERTIONS
expect(page).to_have_url("https://example.com/dashboard")
expect(page).to_have_url(re.compile(r".*/dashboard"))     # regex
expect(page).to_have_title("Dashboard - MyApp")
expect(page).to_have_title(re.compile(r"Dashboard.*"))

# ELEMENT ASSERTIONS
locator = page.locator("#welcome")
expect(locator).to_be_visible()
expect(locator).to_be_hidden()
expect(locator).to_be_enabled()
expect(locator).to_be_disabled()
expect(locator).to_be_checked()          # checkbox/radio
expect(locator).to_have_text("Welcome")
expect(locator).to_contain_text("Welc")  # partial
expect(locator).to_have_value("admin")   # input value
expect(locator).to_have_attribute("class", "active")
expect(locator).to_have_class(re.compile(r".*active.*"))
expect(locator).to_have_count(5)         # number of matching elements
expect(locator).to_have_css("color", "rgb(255, 0, 0)")

# NEGATIVE ASSERTIONS — use not_to_
expect(locator).not_to_be_visible()
expect(locator).not_to_have_text("Error")

# SOFT ASSERTIONS — don't stop test on failure (collect all failures)
expect(locator).to_be_visible()  # hard — stops on failure
# Soft assertions in Python use pytest-check or custom approach
```

**Key difference from Selenium assertions:**
- Playwright assertions **auto-retry** until timeout (default 5s)
- Selenium assertions fail **immediately** if condition not met
- No need for `WebDriverWait` + `ExpectedConditions` pattern

---

# PLAYWRIGHT ADVANCED FEATURES

---

## Q8. How to handle iframes in Playwright?

```python
# SELENIUM — complex switching
driver.switch_to.frame("iframe-name")
driver.find_element(By.id("btn")).click()
driver.switch_to.default_content()

# PLAYWRIGHT — simple frame_locator
frame = page.frame_locator("#iframe-id")
frame.get_by_role("button", name="Submit").click()
# No need to switch back! Works directly

# Nested iframes
page.frame_locator("#outer").frame_locator("#inner").locator("#btn").click()

# By URL
frame = page.frame(url=re.compile(r".*payment.*"))
frame.locator("#card-number").fill("4111111111111111")
```

---

## Q9. How to handle multiple tabs/windows?

```python
# SELENIUM — complex window handle switching
original = driver.current_window_handle
driver.find_element(By.link_text("Open New Tab")).click()
for handle in driver.window_handles:
    if handle != original:
        driver.switch_to.window(handle)
        break

# PLAYWRIGHT — elegant popup/new page handling
# Wait for new page to open
with page.expect_popup() as popup_info:
    page.click("a[target='_blank']")  # click link that opens new tab
new_page = popup_info.value

# Work with new page directly
new_page.wait_for_load_state()
print(new_page.title())
new_page.locator("#form").fill("data")

# Go back to original page — no switching needed
page.locator("#original-element").click()  # still works

# Close new page
new_page.close()
```

---

## Q10. How to handle dialogs (alerts, confirms, prompts)?

```python
# SELENIUM
driver.switch_to.alert.accept()
driver.switch_to.alert.dismiss()
driver.switch_to.alert.send_keys("text")

# PLAYWRIGHT — event-based (register handler BEFORE triggering dialog)
# Accept alert
page.on("dialog", lambda dialog: dialog.accept())
page.click("#triggerAlert")

# Dismiss confirm
page.on("dialog", lambda dialog: dialog.dismiss())
page.click("#triggerConfirm")

# Enter text in prompt
page.on("dialog", lambda dialog: dialog.accept("my input"))
page.click("#triggerPrompt")

# Capture dialog message
def handle_dialog(dialog):
    print(f"Dialog message: {dialog.message}")
    assert dialog.message == "Are you sure?"
    dialog.accept()

page.on("dialog", handle_dialog)
page.click("#deleteBtn")

# One-time handler using expect_event
with page.expect_event("dialog") as dialog_info:
    page.click("#deleteBtn")
dialog = dialog_info.value
assert dialog.message == "Are you sure?"
dialog.accept()
```

---

## Q11. How to handle file uploads and downloads?

```python
# FILE UPLOAD
# Method 1: set_input_files (recommended)
page.set_input_files("input[type='file']", "path/to/file.pdf")

# Multiple files
page.set_input_files("input[type='file']", ["file1.pdf", "file2.pdf"])

# Clear file selection
page.set_input_files("input[type='file']", [])

# Method 2: For non-input upload buttons (using file chooser)
with page.expect_file_chooser() as fc_info:
    page.click("#uploadBtn")
file_chooser = fc_info.value
file_chooser.set_files("path/to/file.pdf")


# FILE DOWNLOAD
# Method 1: Wait for download event
with page.expect_download() as download_info:
    page.click("#downloadBtn")
download = download_info.value

# Save to specific path
download.save_as("downloads/report.pdf")

# Get download info
print(download.suggested_filename)  # "report.pdf"
print(download.url)
```

---

## Q12. How to do API testing with Playwright?

**Playwright has built-in API testing — no need for REST Assured or requests library.**

```python
# Using APIRequestContext
def test_api_create_user(playwright):
    api = playwright.request.new_context(
        base_url="https://reqres.in"
    )

    # POST request
    response = api.post("/api/users", data={
        "name": "Vikrant",
        "job": "SDET"
    })
    assert response.status == 201
    body = response.json()
    assert body["name"] == "Vikrant"
    assert "id" in body

    # GET request
    response = api.get("/api/users/2")
    assert response.status == 200
    assert response.json()["data"]["email"] is not None

    # PUT request
    response = api.put("/api/users/2", data={
        "name": "Vikrant Updated",
        "job": "Lead SDET"
    })
    assert response.status == 200

    # DELETE request
    response = api.delete("/api/users/2")
    assert response.status == 204

    api.dispose()


# Combined: Create user via API, verify via UI
def test_create_user_api_verify_ui(page, playwright):
    # Step 1: Create user via API (fast)
    api = playwright.request.new_context(base_url="https://api.example.com")
    response = api.post("/users", data={"name": "Vikrant", "email": "v@test.com"})
    user_id = response.json()["id"]

    # Step 2: Verify user appears in UI
    page.goto(f"https://app.example.com/users/{user_id}")
    expect(page.locator(".user-name")).to_have_text("Vikrant")

    # Step 3: Cleanup via API
    api.delete(f"/users/{user_id}")
    api.dispose()
```

---

## Q13. How to mock API responses / intercept network requests?

```python
# MOCK API response (return fake data instead of real API call)
def test_with_mocked_api(page):
    # Intercept API call and return mock data
    page.route("**/api/users", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[{"id": 1, "name": "Mock User", "email": "mock@test.com"}]'
    ))

    page.goto("https://app.example.com/users")
    expect(page.locator(".user-card")).to_have_count(1)
    expect(page.locator(".user-name")).to_have_text("Mock User")


# MODIFY API response (change specific fields)
def test_with_modified_response(page):
    def modify_response(route):
        response = route.fetch()  # get real response
        body = response.json()
        body["data"][0]["name"] = "Modified Name"  # change field
        route.fulfill(response=response, body=json.dumps(body))

    page.route("**/api/users*", modify_response)
    page.goto("https://app.example.com/users")


# BLOCK requests (images, CSS, analytics)
page.route("**/*.{png,jpg,jpeg,gif}", lambda route: route.abort())
page.route("**/analytics/**", lambda route: route.abort())
# Results in faster test execution


# WAIT for specific API response
with page.expect_response("**/api/users") as response_info:
    page.click("#loadUsers")
response = response_info.value
assert response.status == 200
users = response.json()
```

---

## Q14. How to take screenshots and record videos?

```python
# SCREENSHOTS
# Full page screenshot
page.screenshot(path="screenshots/full-page.png", full_page=True)

# Element screenshot
page.locator("#loginForm").screenshot(path="screenshots/login-form.png")

# Screenshot on failure (in conftest.py)
@pytest.fixture(autouse=True)
def screenshot_on_failure(page, request):
    yield
    if request.node.rep_call.failed:
        page.screenshot(path=f"screenshots/{request.node.name}.png")


# VIDEO RECORDING
# In conftest.py or pytest config
@pytest.fixture(scope="function")
def context(browser):
    context = browser.new_context(
        record_video_dir="videos/",
        record_video_size={"width": 1280, "height": 720}
    )
    yield context
    context.close()  # video saved on close


# TRACING — captures everything (screenshots, DOM, network, console)
context.tracing.start(screenshots=True, snapshots=True, sources=True)

# ... run test actions ...

# Stop and save trace
context.tracing.stop(path="traces/login-test.zip")

# View trace in browser
# Command: playwright show-trace traces/login-test.zip
```

---

## Q15. How to run tests in parallel?

```python
# pytest-playwright runs tests in parallel using pytest-xdist

# Install
# pip install pytest-xdist

# Run 4 workers in parallel
# pytest tests/ -n 4

# Run with specific browser
# pytest tests/ --browser chromium --browser firefox

# Each test gets its own BrowserContext — fully isolated
```

**playwright.config (JavaScript — for reference):**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 2,               // retry failed tests
    workers: 4,               // parallel workers

    use: {
        baseURL: 'https://app.example.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },

    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit' } },
        { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    ],
});
```

---

## Q16. What is Playwright Codegen? How to use it?

**Codegen** = AI-powered test recorder. Records your actions in the browser and generates test code automatically.

```bash
# Start codegen — opens browser + inspector
npx playwright codegen https://example.com

# With specific viewport
npx playwright codegen --viewport-size=1280,720 https://example.com

# With device emulation
npx playwright codegen --device="iPhone 13" https://example.com

# Generate Python code (default is JavaScript)
npx playwright codegen --target python https://example.com

# With authentication state
npx playwright codegen --load-storage=auth.json https://example.com
```

**What codegen generates:**
- Uses **recommended locators** (`get_by_role`, `get_by_label`, `get_by_text`)
- Auto-generates assertions
- Produces clean, readable code
- Generates in Python, JavaScript, TypeScript, Java, or .NET

**Interview tip:** "I use codegen for quick prototyping and to discover the best locators. I then refactor the generated code into our Page Object Model framework."

---

# PAGE OBJECT MODEL IN PLAYWRIGHT

---

## Q17. How to implement Page Object Model (POM) in Playwright Python?

```python
# pages/base_page.py
from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def navigate(self, path: str):
        self.page.goto(path)

    def get_title(self) -> str:
        return self.page.title()

    def take_screenshot(self, name: str):
        self.page.screenshot(path=f"screenshots/{name}.png")


# pages/login_page.py
class LoginPage(BasePage):
    URL = "/login"

    def __init__(self, page: Page):
        super().__init__(page)
        # Locators — defined as properties
        self.username_input = page.get_by_label("Email")
        self.password_input = page.get_by_label("Password")
        self.login_button = page.get_by_role("button", name="Login")
        self.error_message = page.locator(".error-message")
        self.remember_me = page.get_by_label("Remember me")

    def goto(self):
        self.navigate(self.URL)
        return self

    def login(self, email: str, password: str):
        self.username_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()
        return DashboardPage(self.page)

    def login_with_remember(self, email: str, password: str):
        self.username_input.fill(email)
        self.password_input.fill(password)
        self.remember_me.check()
        self.login_button.click()
        return DashboardPage(self.page)

    def get_error(self) -> str:
        return self.error_message.text_content()

    def is_error_visible(self) -> bool:
        return self.error_message.is_visible()


# pages/dashboard_page.py
class DashboardPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.welcome_text = page.locator(".welcome-message")
        self.logout_button = page.get_by_role("button", name="Logout")
        self.nav_links = page.locator("nav a")

    def is_loaded(self) -> bool:
        expect(self.welcome_text).to_be_visible()
        return True

    def get_welcome_message(self) -> str:
        return self.welcome_text.text_content()

    def logout(self):
        self.logout_button.click()
        return LoginPage(self.page)


# tests/test_login.py
import pytest
from pages.login_page import LoginPage

class TestLogin:
    def test_valid_login(self, page):
        login_page = LoginPage(page).goto()
        dashboard = login_page.login("admin@test.com", "admin123")
        assert dashboard.is_loaded()
        assert "Welcome" in dashboard.get_welcome_message()

    def test_invalid_login(self, page):
        login_page = LoginPage(page).goto()
        login_page.login("wrong@test.com", "wrong")
        assert login_page.is_error_visible()
        assert login_page.get_error() == "Invalid credentials"

    def test_empty_credentials(self, page):
        login_page = LoginPage(page).goto()
        login_page.login("", "")
        assert login_page.is_error_visible()
```

---

## Q18. How to use fixtures in Playwright with pytest?

```python
# conftest.py — shared fixtures for all tests
import pytest
from playwright.sync_api import sync_playwright, Page, BrowserContext
from pages.login_page import LoginPage

# Browser fixture — launch once per session
@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()

# Context fixture — fresh context per test (isolated cookies/storage)
@pytest.fixture(scope="function")
def context(browser):
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir="videos/"
    )
    yield context
    context.close()

# Page fixture — fresh page per test
@pytest.fixture(scope="function")
def page(context):
    page = context.new_page()
    yield page
    page.close()

# Authenticated page fixture — skip login for tests that need auth
@pytest.fixture(scope="function")
def authenticated_page(browser):
    # Load saved authentication state
    context = browser.new_context(storage_state="auth-state.json")
    page = context.new_page()
    yield page
    context.close()

# Save authentication state (run once)
@pytest.fixture(scope="session", autouse=False)
def save_auth_state(browser):
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://app.example.com/login")
    page.fill("#email", "admin@test.com")
    page.fill("#password", "admin123")
    page.click("#loginBtn")
    page.wait_for_url("**/dashboard")
    context.storage_state(path="auth-state.json")
    context.close()

# Base URL fixture
@pytest.fixture(autouse=True)
def setup_base_url(page):
    page.goto("https://app.example.com")
```

---

# PLAYWRIGHT SPECIFIC SCENARIOS

---

## Q19. How to handle dropdowns in Playwright?

```python
# SELECT element (HTML <select>)
page.select_option("#country", "India")                  # by value
page.select_option("#country", label="India")            # by visible text
page.select_option("#country", index=3)                  # by index

# Multi-select
page.select_option("#skills", ["Java", "Python", "SQL"])

# Custom dropdown (non-select element — div/ul/li based)
page.click("#dropdownToggle")                            # open dropdown
page.get_by_role("option", name="India").click()         # select option

# Searchable dropdown
page.click("#searchableDropdown")
page.fill("#searchInput", "India")
page.get_by_text("India", exact=True).click()
```

---

## Q20. How to handle authentication / login state across tests?

```python
# PROBLEM: Every test needs login — wastes time
# SOLUTION: Save and reuse authentication state

# Step 1: Create auth state (run once)
def save_login_state():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://app.example.com/login")
        page.fill("#email", "admin@test.com")
        page.fill("#password", "admin123")
        page.click("#loginBtn")
        page.wait_for_url("**/dashboard")

        # Save cookies, localStorage, sessionStorage
        context.storage_state(path="auth-state.json")
        browser.close()

# Step 2: Reuse in all tests — NO login needed
@pytest.fixture
def auth_page(browser):
    context = browser.new_context(storage_state="auth-state.json")
    page = context.new_page()
    yield page
    context.close()

def test_dashboard_loads(auth_page):
    auth_page.goto("https://app.example.com/dashboard")
    expect(auth_page.locator(".dashboard")).to_be_visible()
    # Already logged in — no login steps needed!
```

---

## Q21. How to do mobile testing with Playwright?

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Use predefined device
    iphone = p.devices["iPhone 13"]
    browser = p.webkit.launch()
    context = browser.new_context(**iphone)
    page = context.new_page()

    page.goto("https://app.example.com")
    # Tests run in iPhone 13 viewport, user-agent, touch events

    # Custom device
    context = browser.new_context(
        viewport={"width": 375, "height": 812},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0...)",
        is_mobile=True,
        has_touch=True,
        device_scale_factor=3
    )

    # Geolocation
    context = browser.new_context(
        geolocation={"latitude": 28.6139, "longitude": 77.2090},  # Delhi
        permissions=["geolocation"]
    )
```

**Available devices:** iPhone 13, Pixel 5, Galaxy S21, iPad Pro, and 50+ more.

---

## Q22. How to handle waits and timeouts in Playwright?

```python
# GLOBAL TIMEOUT — for all actions
context.set_default_timeout(15000)           # 15 seconds
context.set_default_navigation_timeout(30000) # 30 seconds for page loads

# SPECIFIC WAIT — for individual actions
page.click("#slowBtn", timeout=30000)
page.fill("#input", "text", timeout=10000)

# WAIT FOR ELEMENT
page.wait_for_selector("#results", state="visible")
page.wait_for_selector("#spinner", state="hidden")
page.wait_for_selector("#newElement", state="attached")

# WAIT FOR URL
page.wait_for_url("**/dashboard")
page.wait_for_url(re.compile(r".*/users/\d+"))

# WAIT FOR LOAD STATE
page.wait_for_load_state("domcontentloaded")
page.wait_for_load_state("load")
page.wait_for_load_state("networkidle")     # no network activity for 500ms

# WAIT FOR NETWORK RESPONSE
with page.expect_response("**/api/users") as resp_info:
    page.click("#loadData")
response = resp_info.value
assert response.status == 200

# WAIT FOR FUNCTION (custom condition)
page.wait_for_function("() => document.querySelectorAll('.item').length > 5")

# EXPLICIT WAIT (rare — usually auto-wait is enough)
page.locator("#element").wait_for(state="visible", timeout=10000)
```

---

## Q23. How to run Playwright tests in CI/CD?

**GitHub Actions:**
```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install playwright pytest pytest-playwright pytest-xdist
          playwright install --with-deps

      - name: Run tests
        run: pytest tests/ -n 4 --browser chromium --browser firefox

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            screenshots/
            videos/
            traces/
```

**Jenkins:**
```groovy
pipeline {
    agent { docker { image 'mcr.microsoft.com/playwright/python:v1.42.0' } }
    stages {
        stage('Install') {
            steps { sh 'pip install -r requirements.txt' }
        }
        stage('Test') {
            steps { sh 'pytest tests/ -n 4 --browser chromium' }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'screenshots/**,videos/**', allowEmptyArchive: true
        }
    }
}
```

**Docker:**
```dockerfile
FROM mcr.microsoft.com/playwright/python:v1.42.0

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["pytest", "tests/", "-n", "4", "--browser", "chromium"]
```

---

# PLAYWRIGHT vs SELENIUM — INTERVIEW COMPARISON

---

## Q24. Common interview comparison questions

**Q: When would you choose Playwright over Selenium?**

| Choose Playwright | Choose Selenium |
|-------------------|----------------|
| New project (greenfield) | Existing Selenium framework |
| Need fast execution | Safari browser testing required |
| API + UI testing in one framework | Ruby language required |
| Need built-in video/trace/screenshots | Large team with Selenium expertise |
| Mobile web testing without Appium | Integration with existing Selenium Grid |
| Modern SPA applications (React, Angular) | Cross-browser support needed (older browsers) |

**Q: Can Playwright replace Selenium completely?**

"Not completely, but for new projects in 2026, Playwright is the preferred choice. Key reasons:
- **95% of Selenium's capabilities** + more features
- **Faster** execution and less flakiness
- **Less code** needed (auto-waiting, built-in features)
- **Better developer experience** (codegen, trace viewer)

But Selenium still has a place for:
- Legacy projects with existing investment
- Safari-specific testing
- Very large enterprises with Selenium Grid infrastructure"

---

## Q25. Write Playwright equivalents of common Selenium actions

| Action | Selenium (Java) | Playwright (Python) |
|--------|-----------------|---------------------|
| Open URL | `driver.get("url")` | `page.goto("url")` |
| Click | `driver.findElement(By.id("btn")).click()` | `page.click("#btn")` |
| Type | `element.sendKeys("text")` | `page.fill("#input", "text")` |
| Get text | `element.getText()` | `page.locator("#el").text_content()` |
| Get attribute | `element.getAttribute("href")` | `page.locator("#el").get_attribute("href")` |
| Check visibility | `element.isDisplayed()` | `page.locator("#el").is_visible()` |
| Wait for element | `WebDriverWait + ExpectedConditions` | `page.wait_for_selector("#el")` (or auto-wait) |
| Take screenshot | `((TakesScreenshot) driver).getScreenshotAs(...)` | `page.screenshot(path="img.png")` |
| Handle alert | `driver.switchTo().alert().accept()` | `page.on("dialog", lambda d: d.accept())` |
| Handle iframe | `driver.switchTo().frame("name")` | `page.frame_locator("#id")` |
| Handle dropdown | `new Select(element).selectByText("opt")` | `page.select_option("#sel", label="opt")` |
| Execute JS | `((JavascriptExecutor) driver).executeScript(...)` | `page.evaluate("js code")` |
| Hover | `Actions(driver).moveToElement(el).perform()` | `page.hover("#el")` |
| Drag & drop | `Actions(driver).dragAndDrop(src, tgt).perform()` | `page.drag_and_drop("#src", "#tgt")` |
| Scroll | `js.executeScript("window.scrollBy(0,500)")` | `page.mouse.wheel(0, 500)` |
| Double click | `Actions(driver).doubleClick(el).perform()` | `page.dblclick("#el")` |
| Right click | `Actions(driver).contextClick(el).perform()` | `page.click("#el", button="right")` |
| Keyboard | `element.sendKeys(Keys.ENTER)` | `page.keyboard.press("Enter")` |
| Clear field | `element.clear()` | `page.fill("#input", "")` |
| Close browser | `driver.quit()` | `browser.close()` |

---

# RAPID-FIRE PLAYWRIGHT QUESTIONS

---

## Q26. Quick Q&A — frequently asked in interviews

| Question | Answer |
|----------|--------|
| Who developed Playwright? | **Microsoft** (same team that built Puppeteer at Google) |
| Which browsers does Playwright support? | **Chromium**, **Firefox**, **WebKit** (Safari engine) |
| Is Playwright open source? | **Yes** — MIT license, fully free |
| Which languages are supported? | **JavaScript/TypeScript**, **Python**, **Java**, **.NET (C#)** |
| What protocol does Playwright use? | **Chrome DevTools Protocol (CDP)** and **WebDriver BiDi** — faster than Selenium's WebDriver protocol |
| Can Playwright test mobile apps? | **Mobile web** — yes (device emulation). **Native apps** — no (use Appium) |
| Can Playwright do API testing? | **Yes** — built-in `request` context, no external library needed |
| What is `expect` in Playwright? | Auto-retrying assertion library — waits until condition is met or timeout |
| What is `page.evaluate()`? | Executes JavaScript in the browser context — like Selenium's JavaScriptExecutor |
| Can Playwright run in Docker? | **Yes** — Microsoft provides official Docker images |
| What is Playwright Inspector? | Built-in debugging tool — step through tests, inspect locators |
| What is trace viewer? | Records screenshots, DOM, network, console for every action — replay test execution |
| How does Playwright handle Shadow DOM? | **Natively** — locators pierce shadow DOM by default |
| Does Playwright support Selenium Grid? | No — it has its own parallel execution via browser contexts |
| Can you use Playwright with pytest? | **Yes** — `pytest-playwright` plugin provides `page`, `browser`, `context` fixtures |
| How to debug Playwright tests? | `PWDEBUG=1 pytest test.py` — opens Playwright Inspector |
| What is `storage_state`? | Saves/loads cookies, localStorage, sessionStorage — used for auth state reuse |
| How to retry failed tests? | `pytest --retries 2` or in config: `retries: 2` |
| Can Playwright intercept network? | **Yes** — `page.route()` for mocking, blocking, modifying requests |
| What is codegen? | AI-powered test recorder — records browser actions and generates test code |
