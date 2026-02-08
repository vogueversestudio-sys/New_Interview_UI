# Python Interview Prep — SDET (8+ Years) — PART 4: SDET-SPECIFIC
## Covers: Noida | Hyderabad | Gurugram | Delhi | Pune | Chennai

---

# SECTION D — SDET-SPECIFIC PYTHON QUESTIONS

---

## D1. Testing Frameworks

### Q69. pytest vs unittest?
| Feature | pytest | unittest |
|---------|--------|----------|
| Style | Function-based | Class-based (xUnit) |
| Assertions | Plain `assert` | `self.assertEqual` etc. |
| Fixtures | `@pytest.fixture` (flexible) | `setUp`/`tearDown` |
| Parametrize | `@pytest.mark.parametrize` | `subTest` (limited) |
| Plugins | 800+ plugins | Limited |
| Discovery | Auto `test_*` | Needs `unittest.main()` |
| Parallel | `pytest-xdist` | Not built-in |

```python
# pytest
import pytest

@pytest.fixture
def browser():
    driver = "ChromeDriver()"
    yield driver
    # driver.quit()

@pytest.mark.parametrize("user,pwd,expected", [
    ("admin", "admin123", True),
    ("user", "wrong", False),
    ("", "", False),
])
def test_login(browser, user, pwd, expected):
    assert login(browser, user, pwd) == expected
```

```python
# unittest
import unittest

class TestLogin(unittest.TestCase):
    def setUp(self):
        self.driver = "ChromeDriver()"

    def tearDown(self):
        pass  # self.driver.quit()

    def test_valid_login(self):
        self.assertTrue(login(self.driver, "admin", "admin123"))

    def test_invalid_login(self):
        self.assertFalse(login(self.driver, "user", "wrong"))
```

### Q70. pytest fixtures in detail?
```python
import pytest

# Scope: function (default), class, module, package, session
@pytest.fixture(scope="session")
def db_connection():
    conn = create_connection()
    yield conn
    conn.close()

@pytest.fixture(scope="function")
def clean_db(db_connection):
    db_connection.execute("BEGIN")
    yield db_connection
    db_connection.execute("ROLLBACK")

# autouse — applies to all tests
@pytest.fixture(autouse=True)
def log_test_name(request):
    print(f"\nRunning: {request.node.name}")
    yield
    print(f"\nFinished: {request.node.name}")

# Parametrized fixture
@pytest.fixture(params=["chrome", "firefox", "edge"])
def browser(request):
    driver = create_driver(request.param)
    yield driver
    driver.quit()

def test_homepage(browser):
    # Runs 3 times — once per browser
    assert browser.title == "Home"
```

### Q71. pytest markers?
```python
import pytest

@pytest.mark.skip(reason="Not implemented")
def test_feature_x(): pass

@pytest.mark.skipif(sys.platform == "win32", reason="Linux only")
def test_linux_feature(): pass

@pytest.mark.xfail(reason="Known bug JIRA-1234")
def test_known_bug():
    assert False

@pytest.mark.smoke
def test_login(): pass

@pytest.mark.regression
def test_search(): pass

# Run: pytest -m smoke
# Run: pytest -m "smoke and not regression"
```

**pytest.ini:**
```ini
[pytest]
markers =
    smoke: Smoke tests
    regression: Regression tests
    api: API tests
    ui: UI tests
```

### Q72. pytest conftest.py?
```python
# conftest.py — shared fixtures, hooks, plugins

import pytest

# Fixture sharing
@pytest.fixture(scope="session")
def base_url():
    return "https://staging.example.com"

# Hook — modify test collection
def pytest_collection_modifyitems(items):
    for item in items:
        if "api" in item.nodeid:
            item.add_marker(pytest.mark.api)

# Hook — add CLI options
def pytest_addoption(parser):
    parser.addoption("--browser", default="chrome", help="Browser name")
    parser.addoption("--env", default="staging", help="Environment")

@pytest.fixture
def browser_name(request):
    return request.config.getoption("--browser")

@pytest.fixture
def env(request):
    return request.config.getoption("--env")

# Hook — custom report
def pytest_terminal_summary(terminalreporter, exitstatus, config):
    passed = len(terminalreporter.stats.get('passed', []))
    failed = len(terminalreporter.stats.get('failed', []))
    print(f"\nCustom Summary: {passed} passed, {failed} failed")
```

### Q73. Test reports with pytest?
```python
# HTML Report
# pip install pytest-html
# pytest --html=report.html --self-contained-html

# Allure Report
# pip install allure-pytest
# pytest --alluredir=allure-results
# allure serve allure-results

import allure

@allure.feature("Login")
@allure.story("Valid Login")
@allure.severity(allure.severity_level.CRITICAL)
def test_valid_login():
    with allure.step("Enter username"):
        pass
    with allure.step("Enter password"):
        pass
    with allure.step("Click login"):
        pass
    allure.attach("screenshot_bytes", name="Login Page",
                  attachment_type=allure.attachment_type.PNG)
```

### Q74. Parallel test execution?
```bash
# pytest-xdist
pip install pytest-xdist
pytest -n 4              # 4 CPUs
pytest -n auto           # auto-detect
pytest -n 4 --dist loadfile   # by file
pytest -n 4 --dist loadscope  # by class
```

```python
# Thread-safe fixtures for parallel execution
import pytest
from filelock import FileLock

@pytest.fixture(scope="session")
def db_setup(tmp_path_factory, worker_id):
    if worker_id == "master":
        setup_database()
        return
    root_tmp_dir = tmp_path_factory.getbasetemp().parent
    lock = root_tmp_dir / "db.lock"
    with FileLock(str(lock)):
        if not is_db_ready():
            setup_database()
```

---

## D2. API Testing

### Q75. API testing with requests?
```python
import requests
import pytest

BASE_URL = "https://jsonplaceholder.typicode.com"

class TestUserAPI:

    def test_get_users(self):
        resp = requests.get(f"{BASE_URL}/users")
        assert resp.status_code == 200
        users = resp.json()
        assert len(users) > 0
        assert "email" in users[0]

    def test_create_user(self):
        payload = {"name": "Vikrant", "email": "vikrant@test.com"}
        resp = requests.post(f"{BASE_URL}/users", json=payload)
        assert resp.status_code == 201
        assert resp.json()["name"] == payload["name"]

    def test_update_user(self):
        resp = requests.put(f"{BASE_URL}/users/1", json={"name": "Updated"})
        assert resp.status_code == 200

    def test_delete_user(self):
        resp = requests.delete(f"{BASE_URL}/users/1")
        assert resp.status_code == 200

    def test_response_time(self):
        resp = requests.get(f"{BASE_URL}/users")
        assert resp.elapsed.total_seconds() < 2.0

    def test_json_schema(self):
        from jsonschema import validate
        schema = {
            "type": "object",
            "required": ["id", "name", "email"],
            "properties": {
                "id": {"type": "integer"},
                "name": {"type": "string"},
                "email": {"type": "string"}
            }
        }
        resp = requests.get(f"{BASE_URL}/users/1")
        validate(instance=resp.json(), schema=schema)
```

### Q76. requests.Session and authentication?
```python
import requests
from requests.auth import HTTPBasicAuth

# Basic Auth
resp = requests.get(url, auth=HTTPBasicAuth("user", "pass"))

# Bearer Token with Session
session = requests.Session()
session.headers.update({"Authorization": "Bearer eyJhbGci..."})
resp = session.get(url)

# API Key
resp = requests.get(url, headers={"X-API-Key": "your_key"})

# Session with cookies (auto-managed)
session = requests.Session()
session.post(login_url, json={"user": "admin", "pass": "admin123"})
resp = session.get(protected_url)  # cookies auto-sent

# Retry with requests
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

session = requests.Session()
retry = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503])
adapter = HTTPAdapter(max_retries=retry)
session.mount("http://", adapter)
session.mount("https://", adapter)
```

### Q77. API test framework structure?
```python
# base_api.py
import requests
import logging

class BaseAPI:
    def __init__(self, base_url, headers=None):
        self.session = requests.Session()
        self.base_url = base_url
        if headers:
            self.session.headers.update(headers)
        self.logger = logging.getLogger(self.__class__.__name__)

    def get(self, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        self.logger.info(f"GET {url}")
        resp = self.session.get(url, **kwargs)
        self.logger.info(f"Status: {resp.status_code}")
        return resp

    def post(self, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        self.logger.info(f"POST {url}")
        resp = self.session.post(url, **kwargs)
        self.logger.info(f"Status: {resp.status_code}")
        return resp

    def put(self, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        return self.session.put(url, **kwargs)

    def delete(self, endpoint, **kwargs):
        url = f"{self.base_url}{endpoint}"
        return self.session.delete(url, **kwargs)

# user_api.py
class UserAPI(BaseAPI):
    def get_users(self):
        return self.get("/users")

    def get_user(self, user_id):
        return self.get(f"/users/{user_id}")

    def create_user(self, data):
        return self.post("/users", json=data)

    def update_user(self, user_id, data):
        return self.put(f"/users/{user_id}", json=data)

    def delete_user(self, user_id):
        return self.delete(f"/users/{user_id}")
```

---

## D3. Mocking & Patching

### Q78. unittest.mock in detail?
```python
from unittest.mock import Mock, MagicMock, patch, call

# Basic Mock
mock_driver = Mock()
mock_driver.find_element.return_value = Mock(text="Hello")
print(mock_driver.find_element("id", "greeting").text)  # Hello

# MagicMock — supports magic methods
mock_list = MagicMock()
mock_list.__len__.return_value = 5
print(len(mock_list))  # 5

# Side effects — sequential returns
mock_api = Mock()
mock_api.get.side_effect = [
    {"status": 200},
    {"status": 404},
    ConnectionError("timeout"),
]
print(mock_api.get())  # {'status': 200}
print(mock_api.get())  # {'status': 404}
# mock_api.get()       # raises ConnectionError

# Assertions on mocks
mock_api.get.assert_called()
print(mock_api.get.call_count)  # 2
```

```python
# patch decorator
class WeatherService:
    def get_temperature(self, city):
        import requests
        return requests.get(f"https://api.weather.com/{city}").json()

@patch("requests.get")
def test_weather(mock_get):
    mock_get.return_value.json.return_value = {"temp": 25}
    service = WeatherService()
    result = service.get_temperature("Delhi")
    assert result["temp"] == 25
    mock_get.assert_called_once_with("https://api.weather.com/Delhi")

# patch as context manager
def test_weather_cm():
    with patch("requests.get") as mock_get:
        mock_get.return_value.json.return_value = {"temp": 30}
        service = WeatherService()
        result = service.get_temperature("Pune")
        assert result["temp"] == 30

# patch.object
def test_weather_object():
    service = WeatherService()
    with patch.object(service, "get_temperature", return_value={"temp": 22}):
        assert service.get_temperature("Chennai")["temp"] == 22
```

### Q79. Mock vs MagicMock vs patch?
| Feature | Mock | MagicMock | patch |
|---------|------|-----------|-------|
| Purpose | General mock | Mock + magic methods | Replace objects during test |
| Magic methods | Not supported | Supported | N/A |
| Usage | `m = Mock()` | `m = MagicMock()` | `@patch('module.Class')` |

### Q80. pytest-mock (mocker fixture)?
```python
# pip install pytest-mock

def test_api_call(mocker):
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {"data": "test"}

    import requests
    resp = requests.get("https://api.example.com")
    assert resp.status_code == 200

    # spy — wraps real function, but lets you assert calls
    mocker.spy(SomeClass, "some_method")
    obj = SomeClass()
    obj.some_method()
    SomeClass.some_method.assert_called_once()
```

---

## D4. Selenium with Python

### Q81. Selenium fundamentals for SDET?
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Setup
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(options=options)

# Locators
driver.find_element(By.ID, "username")
driver.find_element(By.NAME, "password")
driver.find_element(By.CLASS_NAME, "btn-submit")
driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
driver.find_element(By.XPATH, "//input[@id='email']")
driver.find_element(By.LINK_TEXT, "Sign Up")
driver.find_element(By.PARTIAL_LINK_TEXT, "Sign")
driver.find_element(By.TAG_NAME, "h1")

# Explicit Wait (preferred)
wait = WebDriverWait(driver, 10)
el = wait.until(EC.element_to_be_clickable((By.ID, "submit")))
el = wait.until(EC.visibility_of_element_located((By.ID, "msg")))
el = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".item")))
wait.until(EC.title_contains("Dashboard"))
wait.until(EC.url_contains("/dashboard"))

# Custom wait condition
class element_has_text:
    def __init__(self, locator, text):
        self.locator = locator
        self.text = text
    def __call__(self, driver):
        el = driver.find_element(*self.locator)
        return el if self.text in el.text else False

wait.until(element_has_text((By.ID, "status"), "Complete"))
```

```python
# Actions
actions = ActionChains(driver)
actions.move_to_element(element).click().perform()
actions.drag_and_drop(source, target).perform()
actions.double_click(element).perform()
actions.context_click(element).perform()  # right-click

# JavaScript execution
driver.execute_script("arguments[0].scrollIntoView();", element)
driver.execute_script("return document.readyState") == "complete"
driver.execute_script("arguments[0].click();", element)  # JS click

# Window handling
original = driver.current_window_handle
driver.switch_to.window(driver.window_handles[1])
driver.switch_to.window(original)

# Frame handling
driver.switch_to.frame("frame_name")
driver.switch_to.frame(0)  # by index
driver.switch_to.default_content()

# Alerts
alert = driver.switch_to.alert
alert.text
alert.accept()
alert.dismiss()
alert.send_keys("text")

# Screenshots
driver.save_screenshot("page.png")
element.screenshot("element.png")

# Select dropdown
from selenium.webdriver.support.ui import Select
select = Select(driver.find_element(By.ID, "dropdown"))
select.select_by_value("option1")
select.select_by_visible_text("Option 1")
select.select_by_index(0)

driver.quit()
```

### Q82. Page Object Model implementation?
```python
# base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()

    def type_text(self, locator, text):
        el = self.find(locator)
        el.clear()
        el.send_keys(text)

    def get_text(self, locator):
        return self.find(locator).text

    def is_visible(self, locator, timeout=5):
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator))
            return True
        except:
            return False

# login_page.py
from selenium.webdriver.common.by import By

class LoginPage(BasePage):
    URL = "https://example.com/login"
    USERNAME = (By.ID, "username")
    PASSWORD = (By.ID, "password")
    LOGIN_BTN = (By.CSS_SELECTOR, "button[type='submit']")
    ERROR_MSG = (By.CLASS_NAME, "error-message")

    def navigate(self):
        self.driver.get(self.URL)
        return self

    def login(self, username, password):
        self.type_text(self.USERNAME, username)
        self.type_text(self.PASSWORD, password)
        self.click(self.LOGIN_BTN)

    def get_error(self):
        return self.get_text(self.ERROR_MSG)

# test_login.py
class TestLogin:
    @pytest.fixture(autouse=True)
    def setup(self, browser):
        self.page = LoginPage(browser).navigate()

    def test_valid_login(self):
        self.page.login("admin", "admin123")
        assert "dashboard" in self.page.driver.current_url

    def test_invalid_login(self):
        self.page.login("admin", "wrong")
        assert "Invalid" in self.page.get_error()
```

---

## D5. BDD with Behave

### Q83. BDD with Behave?
```gherkin
# features/login.feature
Feature: User Login

  Background:
    Given the login page is open

  Scenario: Successful login
    When I enter username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard

  Scenario Outline: Invalid login
    When I enter username "<user>" and password "<pwd>"
    And I click the login button
    Then I should see error "<error>"

    Examples:
      | user  | pwd      | error                |
      | admin | wrong    | Invalid credentials  |
      |       | admin123 | Username required    |
```

```python
# features/steps/login_steps.py
from behave import given, when, then

@given("the login page is open")
def step_open_login(context):
    context.page = LoginPage(context.driver).navigate()

@when('I enter username "{user}" and password "{pwd}"')
def step_enter_creds(context, user, pwd):
    context.page.type_text(LoginPage.USERNAME, user)
    context.page.type_text(LoginPage.PASSWORD, pwd)

@when("I click the login button")
def step_click_login(context):
    context.page.click(LoginPage.LOGIN_BTN)

@then("I should see the dashboard")
def step_verify_dashboard(context):
    assert "dashboard" in context.driver.current_url

@then('I should see error "{error}"')
def step_verify_error(context, error):
    assert error in context.page.get_error()
```

```python
# features/environment.py — hooks
from selenium import webdriver

def before_all(context):
    context.config.setup_logging()

def before_scenario(context, scenario):
    context.driver = webdriver.Chrome()

def after_scenario(context, scenario):
    if scenario.status == "failed":
        context.driver.save_screenshot(f"screenshots/{scenario.name}.png")
    context.driver.quit()
```

---

## D6. Database Testing

### Q84. Database testing with Python?
```python
import sqlite3
import pytest

# SQLite example
@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE
        )
    """)
    conn.execute("INSERT INTO users VALUES (1, 'Admin', 'admin@test.com')")
    conn.commit()
    yield conn
    conn.close()

def test_user_exists(db):
    row = db.execute("SELECT * FROM users WHERE id=1").fetchone()
    assert row["name"] == "Admin"

def test_insert_user(db):
    db.execute("INSERT INTO users VALUES (2, 'New', 'new@test.com')")
    count = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    assert count == 2
```

```python
# MySQL / PostgreSQL with SQLAlchemy
from sqlalchemy import create_engine, text

engine = create_engine("postgresql://user:pass@localhost/testdb")

def test_query():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM orders"))
        count = result.scalar()
        assert count > 0
```

---

## D7. CI/CD Integration

### Q85. Framework structure for SDET?
```
project/
├── config/
│   ├── config.yaml
│   └── constants.py
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   └── dashboard_page.py
├── api/
│   ├── base_api.py
│   └── user_api.py
├── tests/
│   ├── conftest.py
│   ├── ui/
│   │   ├── test_login.py
│   │   └── test_dashboard.py
│   └── api/
│       └── test_user_api.py
├── utils/
│   ├── logger.py
│   ├── db_helper.py
│   └── data_generator.py
├── test_data/
│   ├── users.json
│   └── test_data.xlsx
├── reports/
├── requirements.txt
├── pytest.ini
├── Dockerfile
└── .github/workflows/ci.yml
```

### Q86. GitHub Actions CI for tests?
```yaml
# .github/workflows/ci.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/ -n auto --html=report.html --self-contained-html
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-report
          path: report.html
```

---

## D8. Logging in Test Frameworks

### Q87. Logging setup for test framework?
```python
import logging
import os
from datetime import datetime

def setup_logger(name, log_dir="logs"):
    os.makedirs(log_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # File handler
    fh = logging.FileHandler(f"{log_dir}/test_{timestamp}.log")
    fh.setLevel(logging.DEBUG)

    # Console handler
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)

    formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(message)s'
    )
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    logger.addHandler(fh)
    logger.addHandler(ch)
    return logger

# Usage
logger = setup_logger("TestSuite")
logger.info("Test started")
logger.error("Element not found: //button[@id='submit']")
```

---

## D9. Performance & Load Testing

### Q88. Python tools for performance testing?
```python
# Using locust for load testing
# pip install locust

from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task(3)
    def view_homepage(self):
        self.client.get("/")

    @task(1)
    def view_profile(self):
        self.client.get("/profile")

    def on_start(self):
        self.client.post("/login", json={
            "username": "testuser",
            "password": "testpass"
        })

# Run: locust -f locustfile.py --host=https://example.com
```

```python
# Simple performance measurement
import time
import statistics

def measure_performance(func, iterations=100):
    times = []
    for _ in range(iterations):
        start = time.perf_counter()
        func()
        elapsed = time.perf_counter() - start
        times.append(elapsed)

    return {
        "min": min(times),
        "max": max(times),
        "avg": statistics.mean(times),
        "median": statistics.median(times),
        "p95": sorted(times)[int(0.95 * len(times))],
        "p99": sorted(times)[int(0.99 * len(times))],
    }
```

---

## D10. Docker for Test Environments

### Q89. Dockerfile for test framework?
```dockerfile
FROM python:3.11-slim

# Install Chrome
RUN apt-get update && apt-get install -y \
    wget gnupg2 \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["pytest", "tests/", "-v", "--html=reports/report.html"]
```

```yaml
# docker-compose.yml for Selenium Grid
version: "3"
services:
  hub:
    image: selenium/hub:4.15
    ports:
      - "4442:4442"
      - "4443:4443"
      - "4444:4444"

  chrome:
    image: selenium/node-chrome:4.15
    depends_on:
      - hub
    environment:
      - SE_EVENT_BUS_HOST=hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
    deploy:
      replicas: 3

  firefox:
    image: selenium/node-firefox:4.15
    depends_on:
      - hub
    environment:
      - SE_EVENT_BUS_HOST=hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
```
