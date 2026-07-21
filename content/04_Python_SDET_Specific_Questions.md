# Python Interview Prep — SDET (8+ Years) — PART 4: SDET-SPECIFIC
## Vikrant Mishra — SDET Interview Prep

> **SDET-Specific Python:** This is the most important section for your interviews. Every question here maps directly to your daily work. Know pytest deeply — fixtures, markers, conftest, parametrize. Know mocking with unittest.mock. Know POM with Selenium. These WILL be asked.

---

# SECTION D — SDET-SPECIFIC PYTHON QUESTIONS

---

## D1. Testing Frameworks

### Q69. pytest vs unittest?

**Simple Answer:**
pytest is the modern standard for Python test automation. It has a simpler syntax (plain assert instead of self.assertEqual), powerful fixtures, parameterisation, 800+ plugins, and auto-discovers test files. unittest is the built-in Python testing framework, class-based, works like JUnit. In 2024+, always use pytest unless the project requires unittest.

**💬 How to say it in an interview:**
> "I use pytest as my primary testing framework. The key advantages over unittest are: fixtures are much more powerful and composable than setUp/tearDown, parametrize makes data-driven tests clean and concise, plugins like pytest-html and allure-pytest give great reporting, and pytest-xdist adds parallel execution. At PersonifyHealth, I migrated our test suite from unittest to pytest which reduced test maintenance time significantly and improved CI/CD pipeline speed."

**⚡ Key Points:**
- pytest = simpler syntax, more features, 800+ plugins, preferred for new projects
- unittest = built-in, class-based, needs TestCase, good for legacy codebases
- pytest can run unittest tests (backwards compatible)
- Use `@pytest.fixture` instead of setUp/tearDown — fixtures are more flexible

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

**Simple Answer:**
pytest fixtures are functions that provide shared setup and teardown for tests. They use `yield` to separate setup (before yield) from teardown (after yield). Fixtures have scope levels: `function` (default, runs for each test), `class`, `module`, `session` (runs once for the whole test run).

**💬 How to say it in an interview:**
> "Fixtures are the most powerful feature of pytest. I use session-scoped fixtures for expensive setup like creating a database connection or getting an auth token — this happens once and is shared. I use function-scoped fixtures for test data that needs to be fresh per test. autouse=True fixtures run automatically for all tests — I use this for logging test names and resetting state. Parametrized fixtures let me run the same test against multiple environments or browsers with zero code duplication."

**⚡ Key Points:**
- `scope='session'` = runs once for the whole run (auth token, DB connection)
- `scope='function'` = runs for each test (fresh test data)
- `yield` = code before yield is setup, code after yield is teardown
- `autouse=True` = applies to all tests automatically
- Fixtures can depend on other fixtures (dependency injection)

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

**Simple Answer:**
Markers are labels you attach to test functions to categorise and control them. Use `@pytest.mark.smoke` to tag smoke tests, then run only smoke tests with `pytest -m smoke`. Built-in markers: `skip`, `skipif`, `xfail`, `parametrize`.

**💬 How to say it in an interview:**
> "I use markers extensively in my framework to organise tests. Smoke tests are tagged @pytest.mark.smoke and run after every deployment. Regression tests are tagged @pytest.mark.regression and run on a schedule. I also use @pytest.mark.xfail for known bugs that are logged in JIRA — this prevents false failure noise while the bug is being fixed. Custom markers are registered in pytest.ini to avoid warnings."

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

**Simple Answer:**
`conftest.py` is a special pytest file where you put shared fixtures, hooks, and plugins that are automatically available to all tests in the same directory and subdirectories. No import needed — pytest discovers it automatically. Use it for browser fixtures, base_url, auth setup, and CLI options.

**💬 How to say it in an interview:**
> "conftest.py is the central configuration file for my test framework. I have a root-level conftest.py with session-scoped fixtures for auth token and base_url, and a CLI option for --env to switch between staging and production. Sub-folder conftest files add more specific fixtures. The pytest_addoption hook lets me pass --browser and --env from the command line, which Jenkins uses to run tests against different environments in parallel."

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

**Simple Answer:**
Two main reporting options for pytest: `pytest-html` for a simple self-contained HTML report, and `allure-pytest` for rich, detailed reports with screenshots, steps, and history. Allure is the professional standard for CI/CD pipelines.

**💬 How to say it in an interview:**
> "I use Allure reports in my CI/CD pipeline. Allure gives a beautiful dashboard showing pass/fail rates, test history trends, broken tests, and flaky tests. I decorate tests with @allure.feature, @allure.story, and @allure.severity so the report is organised by feature area. I also attach screenshots to failed tests using allure.attach() — so when a test fails in Jenkins, the developer can see exactly what the browser showed at the time of failure."

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

**Simple Answer:**
`pytest-xdist` runs tests in parallel across multiple CPUs. Use `-n auto` to automatically use all available cores. Each worker is a separate process (not a thread), so they bypass the GIL and have full isolation. Use `--dist loadfile` to keep tests from the same file on the same worker (important for shared state).

**💬 How to say it in an interview:**
> "I implemented parallel test execution using pytest-xdist in my framework, which reduced our regression suite runtime from 45 minutes to 12 minutes on a 4-core Jenkins agent. The key challenge was making fixtures thread-safe — especially the database setup. I solved this with a session-scoped fixture combined with a file lock, so only one worker initialises the database while others wait."

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

**Simple Answer:**
The Python `requests` library is the standard for API testing in Python. It's simpler than REST Assured for quick tests. Use `requests.Session()` for maintaining state (auth tokens, cookies) across multiple requests. Always assert status code, response body fields, and response time.

**💬 How to say it in an interview:**
> "I use the requests library for Python-based API testing, combined with pytest for test organisation. My BaseAPI class wraps requests.Session and adds logging, retry logic (via urllib3 Retry), and common headers. Each API resource has its own class that extends BaseAPI — like UserAPI, OrderAPI. Tests are clean and readable: response = user_api.get_user(1); assert response.status_code == 200. This is the same separation of concerns as POM but for APIs."

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

**Simple Answer:**
`requests.Session` persists headers, cookies, and authentication across multiple requests. Use it instead of repeated `requests.get()` calls when tests need to maintain a logged-in state or share authentication headers.

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

**Simple Answer:**
A clean API test framework has: a BaseAPI class for shared session/logging, resource-specific API classes that inherit from BaseAPI, test files that use those API classes, and conftest.py for shared fixtures (auth tokens, base_url). This mirrors the POM pattern but for APIs.

**💬 How to say it in an interview:**
> "My Python API test framework follows the same layered architecture as my Selenium POM framework. The BaseAPI class manages the session, logging, and retry. Resource classes like UserAPI and OrderAPI inherit BaseAPI and define endpoint-specific methods. Tests are clean and don't know about HTTP at all — they just call user_api.create_user(data) and assert the result. This makes tests readable, reusable, and easy to maintain when the API changes."

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

**Simple Answer:**
Mocking replaces real objects with fake ones during testing. Use `Mock` for simple objects, `MagicMock` when you need magic methods (like `__len__`), and `@patch` to temporarily replace a real module/class during a test. This lets you test code in isolation without hitting real APIs or databases.

**💬 How to say it in an interview:**
> "I use unittest.mock extensively for unit testing my framework utilities. When testing the retry logic in my BaseAPI class, I mock requests.get to simulate network failures — I set side_effect to raise ConnectionError for the first two calls and return a success on the third. This lets me verify the retry mechanism works correctly without any real network dependency. I also mock the WebDriver in unit tests for BasePage methods."

**⚡ Key Points:**
- `Mock()` = simple mock object, records all calls
- `MagicMock()` = Mock + support for magic methods (__len__, __str__, etc.)
- `@patch('module.ClassName')` = replaces the class for the duration of the test
- `side_effect` = raise exception or return different values on each call
- `assert_called_once_with()` = verify the mock was called correctly

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

**Simple Answer:**
- `Mock` = simple mock for regular methods and attributes
- `MagicMock` = Mock + support for Python magic methods (use this by default)
- `patch` = context manager/decorator that temporarily replaces an object in a module

| Feature | Mock | MagicMock | patch |
|---------|------|-----------|-------|
| Purpose | General mock | Mock + magic methods | Replace objects during test |
| Magic methods | Not supported | Supported | N/A |
| Usage | `m = Mock()` | `m = MagicMock()` | `@patch('module.Class')` |

### Q80. pytest-mock (mocker fixture)?

**Simple Answer:**
`pytest-mock` provides a `mocker` fixture that gives you `mocker.patch()` and `mocker.spy()` directly in tests. It automatically reverses all patches after the test, cleaner than using `@patch` decorators.

**💬 How to say it in an interview:**
> "I prefer pytest-mock's mocker fixture over the @patch decorator because it's cleaner in pytest-style tests. I can call mocker.patch() inside the test function and it auto-cleans up after. For spying — where I want to call the real function but also track the calls — I use mocker.spy() instead of a full mock. This is useful for verifying that internal methods are called with the correct arguments without mocking the actual behavior."

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

**Simple Answer:**
Python Selenium has the same concepts as Java Selenium but with Python syntax. Key imports: `webdriver`, `By`, `WebDriverWait`, `expected_conditions as EC`, `ActionChains`. Always use Explicit Wait with EC, never use `time.sleep()`. Locators: ID > CSS > XPath (in preference order).

**💬 How to say it in an interview:**
> "My Python Selenium setup uses ChromeOptions with headless mode for CI/CD, WebDriverWait with ExpectedConditions for all waits, and By.CSS_SELECTOR as the preferred locator strategy. I wrap all common Selenium interactions in BasePage methods so tests never call driver.find_element directly — they call self.click(locator) which internally handles the wait. This pattern keeps tests clean and eliminates duplication."

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

**Simple Answer:**
In Python POM: BasePage holds the driver and common actions (find, click, type). Each page class inherits BasePage and defines locators as class variables (tuples of (By.X, 'value')). Tests instantiate page objects and call their action methods. Tests never touch driver.find_element directly.

**💬 How to say it in an interview:**
> "My Python POM implementation has BasePage with explicit wait built in — every find() call waits for the element. Locators are defined as class-level tuples so they can be reused across multiple methods. I use the fluent interface pattern where page action methods return the next page object — so LoginPage.login() returns a DashboardPage. This makes test flows read like a user story."

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

**Simple Answer:**
Behave is Python's BDD framework, equivalent to Java's Cucumber. Feature files use Gherkin syntax (Given-When-Then). Step definition files map each Gherkin step to a Python function. The `context` object shares state between steps in the same scenario.

**💬 How to say it in an interview:**
> "I use Behave for BDD testing when the project requires non-technical stakeholders to read or write tests. The Gherkin feature files serve as living documentation — QA and Business Analysts can review them. The step definitions reuse the same Page Object classes from my regular Selenium tests, so there's no duplication. The environment.py file handles browser setup in before_scenario and cleanup in after_scenario, including capturing screenshots on failure."

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

**Simple Answer:**
Database testing verifies that API and UI operations correctly modify the database. Use it to validate backend persistence after a POST request or UI form submission. Python tools: `sqlite3` for local/test databases, `SQLAlchemy` for production databases (MySQL, PostgreSQL).

**💬 How to say it in an interview:**
> "I use database testing as a validation layer on top of API testing. After calling the POST /orders endpoint, I query the database to verify the order was actually saved with the correct values — not just checking the API response. This catches bugs where the API returns 201 but doesn't actually write to the database. I use SQLAlchemy with a pytest fixture that wraps each test in a transaction and rolls it back after — so the database is always clean for the next test."

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

**Simple Answer:**
A well-structured Python SDET framework follows separation of concerns: `pages/` for POM classes, `api/` for API client classes, `tests/` for test files, `config/` for settings, `utils/` for helpers. This structure makes it easy to find code, add new tests, and onboard new team members.

**💬 How to say it in an interview:**
> "My framework has a clear layered architecture. The pages/ directory has POM classes. The api/ directory has REST client classes following the same pattern. tests/ is split into ui/ and api/ subdirectories. conftest.py at the root provides session-level fixtures like auth token and browser. The config/ directory has environment-specific settings loaded from YAML or environment variables. This structure means adding a new feature requires creating one page class, one API class, and test files — nothing else needs to change."

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

**Simple Answer:**
GitHub Actions runs your tests automatically on every push or pull request. The workflow YAML file defines: checkout code, setup Python, install dependencies, run pytest, upload the HTML report as an artifact. This is the same concept as Jenkins Pipelines but in YAML instead of Groovy.

**💬 How to say it in an interview:**
> "I set up GitHub Actions CI for my Python test framework. The pipeline runs on every pull request: checkout code, setup Python 3.11, install requirements, run pytest with -n auto for parallel execution, and upload the Allure report. I use secrets for credentials so they're never hardcoded. The pipeline also supports manual triggers with environment selection — staging or production — using workflow_dispatch inputs."

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

**Simple Answer:**
Python's built-in `logging` module is all you need for test framework logging. Set up two handlers: FileHandler (DEBUG level, logs everything) and StreamHandler (INFO level, logs to console). Use a single logger per module via `logging.getLogger(__name__)`.

**💬 How to say it in an interview:**
> "My test framework uses Python's built-in logging module. I set up a logger with two handlers: a file handler that captures DEBUG and above for full traceability, and a console handler that shows INFO and above to keep the terminal clean. The log file uses a timestamp in the name so each run has its own log. In pytest conftest.py, I log the test name at the start and end of each test, which makes log analysis very easy when debugging failures."

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

**Simple Answer:**
`Locust` is the most popular Python load testing tool. You write user behaviour as Python code (not XML like JMeter), which makes it easy to version-control and review. Locust spins up virtual users that execute your test scenarios against the target server.

**💬 How to say it in an interview:**
> "I've used Locust for API load testing. The advantage over JMeter is that test scenarios are written in Python, which I already know, and they can reuse my existing API client classes. At Aflac, I wrote Locust tests for the claims submission API to verify it could handle 500 concurrent submissions within the SLA. The @task decorator defines user actions, and the between() function sets realistic think time between actions."

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

**Simple Answer:**
A Dockerfile packages your test framework into a container that can run anywhere — on your laptop, CI server, or cloud. It includes Python, Chrome, ChromeDriver, and your test dependencies. Docker Compose can set up a full Selenium Grid with hub and multiple browser nodes.

**💬 How to say it in an interview:**
> "I containerised my test framework using Docker so it runs consistently across all environments. The Dockerfile installs Python, Chrome, and all test dependencies. In Jenkins, the pipeline runs docker build and then docker run to execute the tests. Docker Compose sets up a Selenium Grid with 3 Chrome nodes and 1 Firefox node — my tests point to localhost:4444 and the Grid distributes them across the nodes. This eliminated the 'works on my machine' problem entirely."

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
