# Python Interview Prep — SDET (8+ Years) — PART 3: ADVANCED
## Vikrant Mishra — SDET Interview Prep

> **Advanced Python for SDETs:** These topics come up in senior SDET interviews. Focus on Design Patterns (Singleton, Factory, POM, Builder) and the GIL/concurrency topics as they directly relate to test framework architecture. Metaclasses and descriptors are rarely asked but good to know.

---

# SECTION C — ADVANCED LEVEL

---

## C1. Metaclasses

### Q46. What are metaclasses?

**Simple Answer:**
A metaclass is a class that creates other classes. Just as objects are instances of a class, classes are instances of a metaclass. The default metaclass in Python is `type`. Metaclasses are used for framework-level code like enforcing coding rules, auto-registering classes, or creating Singletons. In SDET interviews, Singleton via metaclass is the most asked pattern.

A metaclass is a class whose instances are classes. Default metaclass is `type`.

```python
print(type(int))   # <class 'type'>
print(type(str))   # <class 'type'>

# Creating class dynamically
MyClass = type('MyClass', (object,), {'x': 10, 'greet': lambda self: "Hello"})

# Custom metaclass — Singleton example
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "connected"

db1 = Database()
db2 = Database()
print(db1 is db2)  # True
```

### Q47. `__new__` vs `__init__`?

**Simple Answer:**
- `__new__` = **creates** and returns the new object instance (called first)
- `__init__` = **initialises** the already-created object (called after `__new__`)
- Usually you only need `__init__`. Use `__new__` when you need to control object creation — like implementing the Singleton pattern.

- `__new__`: **Creates** and returns a new instance (static method, called before `__init__`)
- `__init__`: **Initializes** the instance (called after `__new__`)

```python
class Singleton:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        self.value = 42

s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # True
```

---

## C2. GIL (Global Interpreter Lock)

### Q48. What is the GIL?

**Simple Answer:**
The GIL (Global Interpreter Lock) is a mutex in CPython that allows only ONE thread to execute Python code at a time, even on multi-core machines. This means Python threads cannot truly run in parallel for CPU-heavy tasks. For I/O tasks (like API calls), the GIL is released while waiting, so threading still helps.

**💬 How to say it in an interview:**
> "The GIL is a known limitation of CPython. For test automation, it mostly doesn't matter because our tasks are I/O-bound — waiting for web pages to load, waiting for API responses. Threading works great for those. If I needed true parallelism for CPU-intensive test data generation, I'd use multiprocessing.Pool instead of threading. In practice, pytest-xdist handles parallel test execution by spawning separate processes, which bypasses the GIL entirely."

**⚡ Key Points:**
- GIL = only one thread runs Python code at a time (CPython limitation)
- Doesn't matter for I/O-bound work (API calls, Selenium clicks)
- Use multiprocessing (not threading) for true CPU parallelism
- pytest-xdist uses processes, not threads — so it bypasses the GIL

The **Global Interpreter Lock** is a mutex in CPython allowing only one thread to execute Python bytecode at a time.

**Impact:**
- CPU-bound multithreaded programs don't benefit from multiple cores
- I/O-bound programs are fine (GIL released during I/O)

**Solutions for CPU-bound:**
```python
from multiprocessing import Pool

def cpu_heavy(n):
    return sum(i * i for i in range(n))

with Pool(4) as pool:
    results = pool.map(cpu_heavy, [10**6] * 4)
```

**I/O-bound (threading works):**
```python
from concurrent.futures import ThreadPoolExecutor
import requests

def fetch(url):
    return requests.get(url).status_code

with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch, ["https://httpbin.org/get"] * 10))
```

---

## C3. Concurrency & Async

### Q49. Threading vs Multiprocessing vs Asyncio?

**Simple Answer:**
- **Threading** = multiple threads, shared memory, good for I/O tasks, limited by GIL
- **Multiprocessing** = multiple processes, separate memory, bypasses GIL, good for CPU tasks
- **Asyncio** = single thread, cooperative, extremely efficient for many concurrent I/O operations (like 1000 simultaneous API calls)

**💬 How to say it in an interview:**
> "For my test framework, I use threading via ThreadPoolExecutor for parallel API calls during smoke tests — it's the simplest solution and works well since the bottleneck is network wait time. For running Selenium tests in parallel, I use pytest-xdist which uses separate processes — bypassing the GIL and giving true isolation between tests. I've experimented with asyncio for bulk API load tests using aiohttp, which can handle hundreds of concurrent requests in a single thread."

| Feature | Threading | Multiprocessing | Asyncio |
|---------|-----------|-----------------|---------|
| Type | Preemptive | Parallelism | Cooperative |
| GIL | Affected | Not affected | Affected |
| Best for | I/O-bound | CPU-bound | Many I/O connections |
| Memory | Shared | Separate | Shared |
| Overhead | Low | High | Very low |

### Q50. What are coroutines?

**Simple Answer:**
Coroutines are functions defined with `async def` that can be paused with `await` and resumed later. They enable asynchronous programming — when one coroutine is waiting (e.g., for a network response), another can run. Use `asyncio.gather()` to run multiple coroutines concurrently.

Functions defined with `async def`, paused/resumed with `await`.

```python
import asyncio

async def fetch_data(delay, name):
    print(f"Starting {name}")
    await asyncio.sleep(delay)
    print(f"Finished {name}")
    return f"{name}: data"

async def main():
    results = await asyncio.gather(
        fetch_data(2, "API-1"),
        fetch_data(1, "API-2"),
        fetch_data(3, "API-3"),
    )
    print(results)

asyncio.run(main())
# Total time ≈ 3s (not 6s)
```

### Q51. Async API testing example?

**Simple Answer:**
Use `aiohttp` with `asyncio` for high-throughput API testing. This is ideal for performance/load testing where you need to fire many requests concurrently without spawning hundreds of threads.

```python
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.json()

async def main():
    urls = ["https://httpbin.org/get"] * 10
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    return results

asyncio.run(main())
```

---

## C4. Descriptors & Slots

### Q52. What are descriptors?

**Simple Answer:**
Descriptors are objects that control how attribute access (get/set/delete) works on a class. Python's `@property`, `@staticmethod`, and `@classmethod` are all implemented using descriptors. In SDET work, you can use descriptors to create reusable attribute validators (e.g., a timeout that must be between 1 and 300).

Objects defining `__get__`, `__set__`, or `__delete__` to customize attribute access.

```python
class Validator:
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        return getattr(obj, f"_{self.name}", None)

    def __set__(self, obj, value):
        if not self.min_val <= value <= self.max_val:
            raise ValueError(f"{self.name} must be {self.min_val}-{self.max_val}")
        setattr(obj, f"_{self.name}", value)

class TestConfig:
    timeout = Validator(1, 300)
    retries = Validator(0, 10)

config = TestConfig()
config.timeout = 30   # OK
config.retries = 3    # OK
config.timeout = 500  # ValueError!
```

**Descriptor types:**
- **Data descriptor:** `__get__` + `__set__`/`__delete__`
- **Non-data descriptor:** only `__get__`
- **Priority:** Data descriptor > Instance `__dict__` > Non-data descriptor

### Q53. What are `__slots__`?

**Simple Answer:**
`__slots__` restricts which attributes an instance can have, and removes the per-instance `__dict__`. This saves memory when you create millions of objects. In test automation, use it for high-volume data objects like test result records.

Restricts instance attributes, saves memory by avoiding `__dict__`.

```python
class WithSlots:
    __slots__ = ['x', 'y']
    def __init__(self, x, y):
        self.x = x
        self.y = y

b = WithSlots(1, 2)
b.z = 3  # AttributeError!
# No __dict__ → less memory per instance
```

---

## C5. Design Patterns for SDET

> **Why Design Patterns matter for SDETs:** Interviewers love asking about design patterns in the context of test frameworks. Know these by heart and always tie them to your framework: Singleton for WebDriverManager, Factory for browser creation, POM for UI tests, Builder for test data.

### Q54. Singleton Pattern

**Simple Answer:**
Singleton ensures only ONE instance of a class exists throughout the application. In test automation, use it for the WebDriver instance — so all page objects share the same browser session without creating new drivers.

**💬 How to say it in an interview:**
> "I implemented the Singleton pattern for WebDriverManager in my framework. When a test starts, the first call to WebDriverManager.get_driver() creates a ChromeDriver instance. All subsequent calls return the same instance. This ensures all page objects in a test share one browser session, which is the correct behavior for end-to-end test flows."

```python
class WebDriverManager:
    _instance = None
    _driver = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_driver(self):
        if self._driver is None:
            self._driver = "ChromeDriver()"
        return self._driver
```

### Q55. Factory Pattern

**Simple Answer:**
Factory pattern creates objects without specifying the exact class. In test automation, use it to create the correct WebDriver based on a browser parameter. The test code just says BrowserFactory.create('chrome') and the factory handles the rest.

**💬 How to say it in an interview:**
> "My BrowserFactory class takes a browser name as input and returns the correct WebDriver. The test framework reads the browser type from a config file or CI/CD parameter, passes it to the factory, and gets back the correct driver. Adding a new browser — like Edge — means just adding one line to the factory, with zero changes to the tests."

```python
class BrowserFactory:
    @staticmethod
    def create_driver(browser_type):
        drivers = {
            "chrome": lambda: "ChromeDriver()",
            "firefox": lambda: "FirefoxDriver()",
            "safari": lambda: "SafariDriver()",
        }
        creator = drivers.get(browser_type.lower())
        if not creator:
            raise ValueError(f"Unsupported: {browser_type}")
        return creator()
```

### Q56. Page Object Model (POM)

**Simple Answer:**
POM is a design pattern where each web page is represented by a class. The class contains the page's locators and the actions you can perform on it. Tests interact only with the page class methods, not directly with Selenium. This makes tests readable and easy to maintain.

**💬 How to say it in an interview:**
> "POM is the foundation of my Selenium framework. Each page has its own class with locators defined as class variables at the top and methods that represent user actions. My BasePage class contains all the common helper methods like find, click, type_text, and is_visible. When a locator changes on the page, I update just the one line in the page class — all tests that use that page automatically get the fix. This is the single most important framework design decision for maintainability."

```python
class BasePage:
    def __init__(self, driver):
        self.driver = driver
    def find_element(self, locator):
        return self.driver.find_element(*locator)
    def click(self, locator):
        self.find_element(locator).click()
    def enter_text(self, locator, text):
        el = self.find_element(locator)
        el.clear()
        el.send_keys(text)

class LoginPage(BasePage):
    USERNAME = ("id", "username")
    PASSWORD = ("id", "password")
    LOGIN_BTN = ("id", "login-btn")

    def login(self, username, password):
        self.enter_text(self.USERNAME, username)
        self.enter_text(self.PASSWORD, password)
        self.click(self.LOGIN_BTN)
        return DashboardPage(self.driver)
```

### Q57. Strategy Pattern

**Simple Answer:**
Strategy pattern defines a family of algorithms and makes them interchangeable. In test automation, use it for wait strategies (explicit vs fluent wait), browser strategies, or reporting strategies. The framework chooses the right strategy at runtime.

```python
from abc import ABC, abstractmethod

class WaitStrategy(ABC):
    @abstractmethod
    def wait_for(self, driver, locator, timeout): pass

class ExplicitWait(WaitStrategy):
    def wait_for(self, driver, locator, timeout=10):
        pass  # WebDriverWait implementation

class FluentWait(WaitStrategy):
    def wait_for(self, driver, locator, timeout=10):
        pass  # Custom polling

class ElementFinder:
    def __init__(self, strategy: WaitStrategy):
        self.strategy = strategy
    def find(self, driver, locator, timeout=10):
        return self.strategy.wait_for(driver, locator, timeout)
```

### Q58. Builder Pattern (for test data)

**Simple Answer:**
Builder pattern constructs complex objects step by step. In test automation, use it for test data creation. Instead of a constructor with 10 parameters, you chain simple method calls and call .build() at the end. Tests read like natural language: UserBuilder().with_name("Admin").with_role("admin").build()

**💬 How to say it in an interview:**
> "I use the Builder pattern for test data in my API tests. Without it, I'd have a User constructor with 8 parameters and tests would be hard to read. With Builder, each test builds only the data it needs: a positive test uses the full builder, a negative test for missing email just skips the .with_email() call. It makes test intent crystal clear and makes data creation reusable across tests."

```python
class UserBuilder:
    def __init__(self):
        self._name = "Default User"
        self._email = "default@test.com"
        self._role = "user"
        self._active = True

    def with_name(self, name):
        self._name = name
        return self

    def with_email(self, email):
        self._email = email
        return self

    def with_role(self, role):
        self._role = role
        return self

    def inactive(self):
        self._active = False
        return self

    def build(self):
        return {
            "name": self._name,
            "email": self._email,
            "role": self._role,
            "active": self._active,
        }

# Usage
admin = UserBuilder().with_name("Admin").with_role("admin").build()
inactive = UserBuilder().with_name("Old User").inactive().build()
```

---

## C6. Dataclasses & Typing

### Q59. Dataclasses?

**Simple Answer:**
Dataclasses (Python 3.7+) auto-generate `__init__`, `__repr__`, and `__eq__` based on class annotations. Use them for test data objects and API response models. They're cleaner than regular classes for simple data containers.

**💬 How to say it in an interview:**
> "I use dataclasses for test data models. Instead of writing a constructor, repr, and equality method manually, I just annotate fields with their types. For API response mapping, I use dataclasses with frozen=True so test data is immutable — preventing accidental modification between test steps."

```python
from dataclasses import dataclass, field, asdict
from typing import List, Optional

@dataclass
class TestResult:
    test_name: str
    status: str
    duration: float
    error_message: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    @property
    def passed(self):
        return self.status == "PASS"

result = TestResult("test_login", "PASS", 2.5, tags=["smoke"])
print(asdict(result))
print(result.passed)  # True

# Frozen (immutable)
@dataclass(frozen=True)
class Config:
    base_url: str
    timeout: int = 30
```

### Q60. Type hinting?

**Simple Answer:**
Type hints (Python 3.5+) are annotations that tell IDEs and type checkers what type a variable or function parameter should be. They don't enforce types at runtime but catch bugs early when combined with mypy or IDE checks. Always use type hints in shared framework code.

```python
from typing import List, Dict, Optional, Union, Callable, Any, TypeVar, Protocol

def run_tests(
    test_names: List[str],
    config: Dict[str, Any],
    timeout: Optional[int] = None,
    callback: Callable[[str, bool], None] = None
) -> Dict[str, bool]:
    results: Dict[str, bool] = {}
    for name in test_names:
        results[name] = True
        if callback:
            callback(name, True)
    return results

# TypeVar for generics
T = TypeVar('T')
def first_element(items: List[T]) -> Optional[T]:
    return items[0] if items else None

# Protocol (structural subtyping, Python 3.8+)
class Clickable(Protocol):
    def click(self) -> None: ...

def interact(element: Clickable) -> None:
    element.click()
```

---

## C7. Advanced Concepts

### Q61. `__getattr__` vs `__getattribute__` vs `__setattr__`?

**Simple Answer:**
- `__getattribute__` = called for EVERY attribute access (even for existing ones)
- `__getattr__` = called ONLY when the attribute is NOT found normally
- `__setattr__` = called for EVERY attribute assignment
- In test frameworks, `__getattr__` is used to create dynamic proxy objects or lazy-loading page components.

```python
class LoggingObject:
    def __getattribute__(self, name):
        # Called for EVERY attribute access
        print(f"Accessing: {name}")
        return super().__getattribute__(name)

    def __getattr__(self, name):
        # Called ONLY when attribute NOT found
        return f"{name} not found"

    def __setattr__(self, name, value):
        # Called for EVERY attribute assignment
        print(f"Setting {name} = {value}")
        super().__setattr__(name, value)
```

### Q62. Monkey patching?

**Simple Answer:**
Monkey patching means changing the behavior of a class or module at runtime, without modifying its source code. In test automation, this is what `unittest.mock.patch` does — it temporarily replaces a real function with a mock for the duration of a test.

Dynamically modifying a class/module at runtime.
```python
class APIClient:
    def get(self, url):
        import requests
        return requests.get(url)

# Patch for testing
def mock_get(self, url):
    return {"status": 200, "data": "mocked"}

APIClient.get = mock_get
client = APIClient()
print(client.get("https://api.example.com"))  # mocked
```

### Q63. `collections` module?

**Simple Answer:**
The `collections` module provides specialised container types beyond list/dict/set. The ones most useful in SDET work: `defaultdict` (no KeyError for missing keys), `Counter` (count occurrences), `namedtuple` (lightweight objects with named fields), `deque` (fast appends/pops from both ends).

```python
from collections import defaultdict, Counter, namedtuple, deque, ChainMap, OrderedDict

# defaultdict
word_count = defaultdict(int)
for w in "hello world hello".split():
    word_count[w] += 1  # {'hello': 2, 'world': 1}

# Counter
c = Counter("abracadabra")
c.most_common(3)  # [('a', 5), ('b', 2), ('r', 2)]

# namedtuple
TC = namedtuple("TestCase", ["id", "name", "priority"])
tc = TC(1, "Login Test", "High")
print(tc.name)  # Login Test

# deque (O(1) both ends)
d = deque([1, 2, 3], maxlen=5)
d.appendleft(0)
d.append(4)

# ChainMap
defaults = {"timeout": 30, "retries": 3}
overrides = {"timeout": 60}
config = ChainMap(overrides, defaults)
print(config["timeout"])  # 60
print(config["retries"])  # 3
```

### Q64. `itertools` module?

**Simple Answer:**
`itertools` provides functions for efficient iteration. The most useful for SDETs: `product()` for cartesian combinations (e.g., all browser × environment combinations), `groupby()` for grouping test results by status, `chain()` for combining multiple test data lists.

```python
import itertools

# chain
list(itertools.chain([1,2], [3,4]))  # [1,2,3,4]

# product (cartesian)
list(itertools.product(["chrome","firefox"], ["staging","prod"]))
# [('chrome','staging'), ('chrome','prod'), ('firefox','staging'), ('firefox','prod')]

# combinations & permutations
list(itertools.combinations([1,2,3], 2))  # [(1,2), (1,3), (2,3)]
list(itertools.permutations([1,2,3], 2))  # 6 results

# groupby
data = sorted([("pass","t1"), ("fail","t2"), ("pass","t3")], key=lambda x: x[0])
for status, tests in itertools.groupby(data, key=lambda x: x[0]):
    print(status, list(tests))

# islice
list(itertools.islice(range(100), 5, 10))  # [5,6,7,8,9]

# accumulate
list(itertools.accumulate([1,2,3,4]))  # [1,3,6,10]
```

### Q65. `functools` module?

**Simple Answer:**
`functools` provides tools for higher-order functions. Most useful for SDETs: `@lru_cache` for memoising expensive function calls (e.g., config loading), `partial` for pre-filling function arguments, `@wraps` inside decorators to preserve the original function's metadata.

```python
from functools import lru_cache, partial, reduce, wraps, total_ordering

# lru_cache — memoization
@lru_cache(maxsize=128)
def expensive_call(n):
    return sum(range(n))

# partial — freeze some arguments
import requests
get_api = partial(requests.get, headers={"Accept": "application/json"})
# get_api("https://api.example.com")  # headers already set

# reduce
total = reduce(lambda a, b: a + b, [1,2,3,4,5])  # 15

# total_ordering — define __eq__ and one comparison, get the rest free
@total_ordering
class Priority:
    def __init__(self, level):
        self.level = level
    def __eq__(self, other):
        return self.level == other.level
    def __lt__(self, other):
        return self.level < other.level
```

### Q66. Weak references?

**Simple Answer:**
A weak reference to an object doesn't prevent it from being garbage collected. When the referenced object is deleted, the weak reference returns None. Useful in frameworks to hold references to objects without preventing cleanup — e.g., caching page objects without keeping them alive indefinitely.

```python
import weakref

class ExpensiveObject:
    def __init__(self, name):
        self.name = name

obj = ExpensiveObject("test")
weak = weakref.ref(obj)

print(weak())       # <ExpensiveObject object>
print(weak().name)  # test

del obj
print(weak())       # None — object garbage collected
```

### Q67. Abstract Base Classes (ABC)?

**Simple Answer:**
ABC (Abstract Base Class) is a class that defines the interface (what methods must exist) but doesn't implement them. Subclasses MUST implement the abstract methods or they'll get an error. In test automation, use ABCs for BasePage, BaseAPI, or TestRunner to enforce consistent structure across the framework.

**💬 How to say it in an interview:**
> "I use ABC in my framework's BasePage and BaseAPI classes. Any class that extends BasePage must implement a validate() method — if a developer creates a new page object and forgets, Python raises a TypeError immediately when the class is imported. This enforces framework contracts and catches architectural mistakes early, before any test even runs."

```python
from abc import ABC, abstractmethod

class TestRunner(ABC):
    @abstractmethod
    def setup(self):
        pass

    @abstractmethod
    def run(self):
        pass

    @abstractmethod
    def teardown(self):
        pass

    def execute(self):  # template method
        self.setup()
        try:
            result = self.run()
        finally:
            self.teardown()
        return result

class SeleniumTestRunner(TestRunner):
    def setup(self):
        self.driver = "ChromeDriver()"

    def run(self):
        return "test passed"

    def teardown(self):
        pass  # self.driver.quit()
```

### Q68. Enums?

**Simple Answer:**
Enums (Enumerations) are named constants grouped together. Use them for values that have a fixed set of options — like test status (PASS/FAIL/SKIP), priority (LOW/MEDIUM/HIGH), environment (STAGING/PROD). Enums prevent typos and make code more readable than plain strings.

**💬 How to say it in an interview:**
> "I use Enums throughout my test framework for fixed-value constants. Instead of passing the string 'chrome' to my browser factory and risking typos, I pass BrowserType.CHROME. Instead of comparing status == 'PASS', I compare status == TestStatus.PASS. Enums also make it easy to iterate over all options — for example, to run tests on all supported browsers."

```python
from enum import Enum, auto, IntEnum

class TestStatus(Enum):
    PASS = "pass"
    FAIL = "fail"
    SKIP = "skip"
    ERROR = "error"

class Priority(IntEnum):
    LOW = auto()      # 1
    MEDIUM = auto()   # 2
    HIGH = auto()     # 3
    CRITICAL = auto() # 4

# Usage
status = TestStatus.PASS
print(status.value)  # "pass"
print(status.name)   # "PASS"

# Comparison
print(Priority.HIGH > Priority.LOW)  # True

# Iteration
for s in TestStatus:
    print(s.name, s.value)
```
