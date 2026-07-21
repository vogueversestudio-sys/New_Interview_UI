# Python Interview Prep — SDET (8+ Years) — PART 2: INTERMEDIATE
## Vikrant Mishra — SDET Interview Prep

> **Intermediate Python for SDETs:** OOP, decorators, generators, and exception handling are the most asked intermediate topics. Connect each concept to your test framework — e.g., BasePage class (OOP), pytest fixtures (context managers), @pytest.mark decorators (Python decorators).

---

# SECTION B — INTERMEDIATE LEVEL

---

## B1. Object-Oriented Programming (OOP)

### Q25. Four pillars of OOP in Python?

**Simple Answer:**
- **Encapsulation** = bundling data and methods together, hiding internal details (private attributes with `__`)
- **Inheritance** = a child class gets all methods/attributes of the parent class
- **Polymorphism** = different classes can respond to the same method name in different ways
- **Abstraction** = hiding implementation details, showing only what's necessary (abstract classes)

**💬 How to say it in an interview:**
> "I apply all four OOP pillars in my Selenium Page Object Model framework. Encapsulation: each page class hides its element locators as private/protected attributes. Inheritance: all page classes extend a BasePage class that has common methods like click(), sendKeys(), and waitForElement(). Polymorphism: different page classes implement a validate() method differently. Abstraction: the BasePage defines the interface while pages provide the implementation."

**1. Encapsulation:**
```python
class BankAccount:
    def __init__(self):
        self.__balance = 0       # private (name mangled)
        self._transactions = []  # protected (convention)

    def deposit(self, amount):
        self.__balance += amount

    def get_balance(self):
        return self.__balance
```

**2. Inheritance:**
```python
class Animal:
    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return "Woof!"
```

**3. Polymorphism:**
```python
class Cat(Animal):
    def speak(self):
        return "Meow!"

for animal in [Dog(), Cat()]:
    print(animal.speak())  # Woof! then Meow!
```

**4. Abstraction:**
```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    def area(self):
        return 3.14159 * self.radius ** 2
```

### Q26. What is MRO (Method Resolution Order)?

**Simple Answer:**
MRO is the order in which Python looks up methods in a class hierarchy. With multiple inheritance, Python follows the C3 Linearization algorithm. The simple rule: it goes left to right through parent classes, then up to grandparents. Use `ClassName.__mro__` to see the exact order.

Python uses **C3 Linearization** to determine method lookup order in multiple inheritance.

```python
class A:
    def show(self): print("A")

class B(A):
    def show(self): print("B")

class C(A):
    def show(self): print("C")

class D(B, C):
    pass

d = D()
d.show()  # "B"
print(D.__mro__)
# D → B → C → A → object
```

### Q27. `@staticmethod` vs `@classmethod` vs instance method?

**Simple Answer:**
- **Instance method** = regular method, has access to `self` (the instance) and everything in the class
- **Class method** = decorated with `@classmethod`, receives `cls` (the class itself), used for factory patterns
- **Static method** = decorated with `@staticmethod`, no access to instance or class, like a plain function inside a class

**💬 How to say it in an interview:**
> "In my Page Object Model framework, I use class methods as factory methods — for example, LoginPage.with_credentials(username, password) creates and returns a configured page object. I use static methods for utility functions that are logically related to the class but don't need any class or instance state — like a URL validator method in a BasePage."

```python
class MyClass:
    class_var = 0

    def instance_method(self):       # accesses instance & class
        return f"instance: {self}"

    @classmethod
    def class_method(cls):           # accesses class only
        cls.class_var += 1
        return cls.class_var

    @staticmethod
    def static_method(x, y):        # no access to instance/class
        return x + y
```

| Feature | Instance Method | Class Method | Static Method |
|---------|----------------|--------------|---------------|
| First param | `self` | `cls` | None |
| Access instance | Yes | No | No |
| Access class | Yes | Yes | No |

### Q28. Dunder (magic) methods?

**Simple Answer:**
Dunder (double underscore) methods are special Python methods that define how objects behave with built-in operations. `__init__` = constructor, `__str__` = what print() shows, `__eq__` = how `==` works, `__len__` = what len() returns. You override them to make your classes behave like built-in types.

**💬 How to say it in an interview:**
> "I implement `__repr__` in all my test data classes so that when a test fails, the object prints meaningfully in the error message. I also use `__eq__` when comparing API response objects — instead of comparing field by field, I override __eq__ to compare the key fields I care about. This makes assertions very clean: assert expected_user == actual_user."

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)

    def __getitem__(self, index):
        return (self.x, self.y)[index]

    def __call__(self):
        return self.x, self.y

    def __contains__(self, value):
        return value in (self.x, self.y)
```

**Key dunders:**
- `__init__`, `__new__`, `__del__`
- `__str__`, `__repr__`
- `__add__`, `__sub__`, `__mul__`, `__eq__`, `__lt__`, `__gt__`
- `__len__`, `__getitem__`, `__setitem__`, `__delitem__`
- `__iter__`, `__next__`
- `__enter__`, `__exit__` (context managers)
- `__call__`, `__hash__`

### Q29. `__str__` vs `__repr__`?

**Simple Answer:**
- `__str__` = for humans: readable, friendly format (used by print())
- `__repr__` = for developers: unambiguous, ideally valid Python that can recreate the object (used in REPL and logs)
- Rule: always implement `__repr__`. If `__str__` is not defined, Python falls back to `__repr__`.

- `__str__`: Human-readable, used by `print()`, `str()`
- `__repr__`: Unambiguous, used in REPL, containers. Ideally valid Python expression.

```python
import datetime
d = datetime.date(2026, 2, 7)
print(str(d))    # 2026-02-07
print(repr(d))   # datetime.date(2026, 2, 7)
```
**Rule:** Always implement `__repr__`. `__str__` falls back to `__repr__` if missing.

### Q30. Properties in Python?

**Simple Answer:**
Properties let you use attribute access syntax (object.attribute) while actually running getter/setter methods behind the scenes. This lets you add validation or transformation without changing how callers use the attribute.

**💬 How to say it in an interview:**
> "I use properties in my configuration classes. For example, a Config class might have a base_url property that reads from environment variables and validates the format. The caller just accesses config.base_url like a normal attribute, but behind the scenes it's checking the environment variable and raising an error if it's not set. This is much cleaner than calling config.get_base_url() everywhere."

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

t = Temperature(100)
print(t.fahrenheit)  # 212.0
t.celsius = 37       # uses setter
```

### Q31. Multiple inheritance & diamond problem?

**Simple Answer:**
The diamond problem occurs when a class inherits from two classes that both inherit from the same grandparent. Python resolves this with MRO (C3 linearization) — it always follows a consistent left-to-right, depth-first order. In practice, use `super()` to ensure cooperative multiple inheritance.

```python
class A:
    def greet(self): print("A")
class B(A):
    def greet(self): print("B")
class C(A):
    def greet(self): print("C")
class D(B, C):
    pass

d = D()
d.greet()  # "B" — resolved by MRO: D → B → C → A → object
```

Use `super()` for cooperative multiple inheritance.

---

## B2. Decorators

### Q32. What are decorators?

**Simple Answer:**
A decorator is a function that takes another function, adds some behavior before and/or after it, and returns a modified version. The `@decorator_name` syntax is shorthand for `function = decorator(function)`. Python's own `@property`, `@staticmethod`, `@classmethod` are all built-in decorators.

**💬 How to say it in an interview:**
> "I use decorators extensively in my test framework. I have a @retry decorator that automatically retries a function up to N times if it raises an exception — very useful for flaky API calls. I also use @timer to measure how long API calls take and log them. In pytest, all the @pytest.mark.* decorators are decorators. Understanding how decorators work helped me write cleaner, more reusable test utilities."

**⚡ Key Points:**
- Decorator = wraps a function to add behavior before/after
- Always use `@wraps(func)` from functools to preserve the function's metadata
- Common uses in SDET: retry, timer, logging, authentication setup

A function that wraps another function to extend its behavior.

```python
# Basic decorator
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

slow_function()
```

```python
# Decorator with arguments
def retry(max_attempts=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt} failed: {e}")
                    if attempt == max_attempts:
                        raise
        return wrapper
    return decorator

@retry(max_attempts=5)
def flaky_api_call():
    import random
    if random.random() < 0.7:
        raise ConnectionError("timeout")
    return "Success"
```

### Q33. Class-based decorators?

**Simple Answer:**
You can implement a decorator as a class by implementing `__init__` (receives the function) and `__call__` (called when the decorated function runs). Useful when the decorator needs to maintain state across calls (like a call counter).

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} called {self.count} times")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # say_hello called 1 times
say_hello()  # say_hello called 2 times
```

---

## B3. Generators & Iterators

### Q34. Generators?

**Simple Answer:**
A generator is a function that uses `yield` to produce values one at a time instead of returning a whole list at once. Generators are memory-efficient because they only compute the next value when asked. Use them when working with large datasets.

**💬 How to say it in an interview:**
> "I use generators in my test framework for large test data sets. Instead of loading 10,000 test records into memory as a list, I use a generator that reads them one at a time from a CSV or database. This is particularly useful in performance testing where I'm sending a large volume of API requests — the generator yields the next request payload without holding all of them in memory simultaneously."

**⚡ Key Points:**
- `yield` pauses execution and returns a value; resumes when `next()` is called again
- Generator expression: `(x**2 for x in range(n))` — lazy evaluation
- Memory efficient: only computes values on demand
- Once exhausted, a generator cannot be reused

Use `yield` to produce values lazily (one at a time).

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")  # 0 1 1 2 3 5 8 13 21 34

# Generator expression
squares = (x**2 for x in range(1000000))  # lazy, no memory
```

| Feature | Function | Generator |
|---------|----------|-----------|
| Returns | Value via `return` | Iterator via `yield` |
| Memory | All at once | One at a time |
| State | Lost after return | Preserved between yields |

### Q35. Iterator vs Iterable?

**Simple Answer:**
- **Iterable** = anything you can loop over: list, string, dict, set. Has `__iter__()` method.
- **Iterator** = has BOTH `__iter__()` AND `__next__()`. Keeps track of position. Lists are iterable but not iterators. Call `iter()` on a list to get an iterator.

- **Iterable:** has `__iter__()` → `list`, `str`, `dict`
- **Iterator:** has `__iter__()` AND `__next__()`

```python
my_list = [1, 2, 3]         # iterable
my_iter = iter(my_list)      # iterator
print(next(my_iter))  # 1
print(next(my_iter))  # 2
```

```python
# Custom iterator
class Countdown:
    def __init__(self, start):
        self.start = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

for num in Countdown(5):
    print(num, end=" ")  # 5 4 3 2 1
```

### Q36. `yield from`?

**Simple Answer:**
`yield from` delegates all yield operations to a sub-generator. Instead of looping over the sub-generator and yielding each value, `yield from` does it automatically and more efficiently.

Delegates to a sub-generator.
```python
def inner():
    yield 1
    yield 2

def outer():
    yield from inner()
    yield 3

list(outer())  # [1, 2, 3]
```

---

## B4. Exception Handling

### Q37. Exception handling syntax?

**Simple Answer:**
Python uses try/except/else/finally for exception handling. `except` catches the error, `else` runs only if NO exception occurred, `finally` ALWAYS runs (used for cleanup like closing files or drivers).

**💬 How to say it in an interview:**
> "Exception handling in test automation is critical. In my Selenium framework, I wrap critical operations in try/except to catch WebDriverException and take a screenshot before re-raising the error. The finally block always closes the driver — whether the test passes or fails. In my API tests, I catch specific exceptions like ConnectionError and fail the test with a meaningful message like 'Cannot connect to the test environment' instead of a cryptic stack trace."

**⚡ Key Points:**
- `else` = runs only if no exception occurred
- `finally` = ALWAYS runs, use for cleanup (driver.quit(), file.close())
- Catch specific exceptions first (ZeroDivisionError), general (Exception) last
- Never use bare `except:` — it catches even KeyboardInterrupt

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except (TypeError, ValueError) as e:
    print(f"Type/Value Error: {e}")
except Exception as e:
    print(f"Unexpected: {e}")
else:
    print("No exception")    # only if no exception
finally:
    print("Always executes") # cleanup
```

### Q38. Custom exceptions?

**Simple Answer:**
Create custom exceptions by subclassing the built-in `Exception` class. This makes your error messages more meaningful and lets callers catch your specific exception type rather than a generic Exception.

**💬 How to say it in an interview:**
> "In my test framework, I define custom exceptions for domain-specific failures. For example, ElementNotFoundError, APIValidationError, and TestDataError. These make test failure messages much more informative — instead of 'NoSuchElementException', you see 'ElementNotFoundError: submit button not found on /checkout'. Custom exceptions also allow callers to catch specific failure types and handle them differently."

```python
class TestExecutionError(Exception):
    def __init__(self, test_name, message="Test failed"):
        self.test_name = test_name
        super().__init__(f"{message}: {test_name}")

class ElementNotFoundError(TestExecutionError):
    def __init__(self, locator):
        super().__init__("Element Lookup", f"Not found: {locator}")

try:
    raise ElementNotFoundError("//button[@id='submit']")
except TestExecutionError as e:
    print(e)
```

### Q39. `raise` vs `raise from`?

**Simple Answer:**
- `raise ExceptionType` = raise a new exception
- `raise NewException from original` = raise a new exception AND preserve the original as context (chain them)
- `raise NewException from None` = raise a new exception and SUPPRESS the original context

```python
try:
    int("abc")
except ValueError as original:
    raise RuntimeError("Conversion failed") from original
    # "The above exception was the direct cause..."

try:
    int("abc")
except ValueError:
    raise RuntimeError("Failed") from None
    # Suppresses the original exception chain
```

---

## B5. File Handling

### Q40. File operations?

**Simple Answer:**
Always use `with open(...)` (context manager) for file operations — it automatically closes the file even if an error occurs. Modes: `r` = read, `w` = write (overwrites), `a` = append, `rb`/`wb` = binary read/write.

**💬 How to say it in an interview:**
> "File handling is common in my test automation — reading test data from CSV/JSON files, writing test results, reading config files. I always use the 'with' statement so the file is closed automatically even if an exception occurs. For test data, I read JSON files with json.load() and CSV files with csv.DictReader() — it returns each row as a dict with column names as keys, which is very clean."

```python
# Write
with open("report.txt", "w") as f:
    f.write("Test Results\n")

# Read
with open("report.txt", "r") as f:
    content = f.read()           # entire file
    # lines = f.readlines()      # list of lines
    # for line in f:             # line by line (memory efficient)

# Append
with open("report.txt", "a") as f:
    f.write("PASS: test_search\n")
```

### Q41. JSON and CSV handling?

**Simple Answer:**
- `json.load(file)` = parse JSON from a file object → Python dict/list
- `json.loads(string)` = parse JSON from a string → Python dict/list
- `json.dump(data, file)` = write Python dict/list to a JSON file
- `json.dumps(data)` = convert Python dict/list to a JSON string
- `csv.DictReader` = read CSV rows as dicts (keys are column headers)

```python
import json, csv

# JSON
data = {"test": "login", "status": "pass"}
with open("results.json", "w") as f:
    json.dump(data, f, indent=4)
with open("results.json", "r") as f:
    loaded = json.load(f)

json_str = json.dumps(data)
parsed = json.loads(json_str)

# CSV
with open("results.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["test", "status"])
    writer.writeheader()
    writer.writerow({"test": "login", "status": "pass"})

with open("results.csv", "r") as f:
    for row in csv.DictReader(f):
        print(row["test"], row["status"])
```

---

## B6. Context Managers

### Q42. What are context managers?

**Simple Answer:**
A context manager is an object that manages resource setup and teardown using the `with` statement. The `__enter__` method runs when entering the `with` block; `__exit__` runs when leaving (even if an exception occurred). `open()`, database connections, and WebDriver setups are all context managers.

**💬 How to say it in an interview:**
> "I use context managers extensively in my test framework. For WebDriver, I implemented a context manager that initialises the driver in __enter__ and quits it in __exit__ — this guarantees the browser is always closed. For API testing, I have a context manager that sets up and tears down test data in the database. The contextlib.contextmanager decorator makes it very easy to write these without creating a full class."

Manage resource setup/teardown (acquire/release).

```python
# Class-based
class DBConnection:
    def __init__(self, conn_str):
        self.conn_str = conn_str
    def __enter__(self):
        self.conn = "connected"
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn = None
        return False  # propagate exceptions

with DBConnection("localhost:5432") as db:
    print(db.conn)

# Using contextlib
from contextlib import contextmanager

@contextmanager
def timer(label):
    import time
    start = time.time()
    try:
        yield
    finally:
        print(f"{label}: {time.time()-start:.4f}s")

with timer("API Test"):
    time.sleep(0.5)
```

---

## B7. Regular Expressions

### Q43. Regex basics in Python?

**Simple Answer:**
Regular expressions (regex) are patterns for matching text. In test automation, they're used for log parsing, response validation, and input validation testing. Key functions: `re.search()` (find anywhere in string), `re.match()` (match from start), `re.findall()` (find all matches), `re.sub()` (replace matches).

**💬 How to say it in an interview:**
> "I use regex in my test automation for two main purposes: parsing log files to extract error codes and timestamps, and validating data format in API responses — like verifying an email field actually looks like an email, or a phone number matches the expected format. The patterns I use most: \d+ for numbers, [a-zA-Z]+ for letters, and named groups with (?P<name>pattern) to extract specific parts of a match."

```python
import re

text = "Error 404: Page not found at 2026-02-07 13:00:00"

# Search
match = re.search(r'\d{4}-\d{2}-\d{2}', text)
if match:
    print(match.group())  # 2026-02-07

# Find all
numbers = re.findall(r'\d+', text)  # ['404', '2026', '02', '07', '13', '00', '00']

# Match (anchored to start)
if re.match(r'Error', text):
    print("Starts with Error")

# Sub (replace)
clean = re.sub(r'\d+', 'X', text)  # "Error X: Page not found at X-X-X X:X:X"

# Compile (reusable)
pattern = re.compile(r'(\d{4})-(\d{2})-(\d{2})')
m = pattern.search(text)
print(m.group(1))  # 2026 (year)
print(m.groups())  # ('2026', '02', '07')

# Named groups
pattern = re.compile(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})')
m = pattern.search(text)
print(m.group('year'))  # 2026
```

**Common patterns for SDET:**
```python
# Email validation
email_pat = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# Phone (Indian)
phone_pat = r'^(\+91|91|0)?[6-9]\d{9}$'

# URL
url_pat = r'https?://(?:www\.)?[\w.-]+\.\w{2,}(?:/\S*)?'

# IP address
ip_pat = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'

# Log timestamp
log_pat = r'\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}'
```

---

## B8. Multithreading Basics

### Q44. Threading in Python?

**Simple Answer:**
Threading allows running multiple parts of your program concurrently. Python threads share the same memory. The GIL (Global Interpreter Lock) means only one thread executes Python code at a time — so threads are good for I/O-bound tasks (API calls, file reads) but NOT for CPU-bound tasks (calculations).

**💬 How to say it in an interview:**
> "I use ThreadPoolExecutor for parallel API test execution. For example, when I need to make 50 API calls to test a batch endpoint, I use ThreadPoolExecutor with 10 workers instead of sequential calls — this reduced that test's execution time from 50 seconds to about 6 seconds. Python's GIL means threads don't truly run in parallel for CPU work, but for API calls that spend most time waiting for the network, threading gives a huge speedup."

**⚡ Key Points:**
- Threading = good for I/O-bound tasks (API calls, file operations)
- GIL = prevents true parallel CPU execution in Python threads
- Use Lock to prevent race conditions when threads share data
- ThreadPoolExecutor = cleaner than raw threading for most test use cases

```python
import threading
import time

def download_file(filename):
    print(f"Downloading {filename}...")
    time.sleep(2)
    print(f"Downloaded {filename}")

# Create threads
threads = []
for f in ["file1.txt", "file2.txt", "file3.txt"]:
    t = threading.Thread(target=download_file, args=(f,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()  # wait for all to finish

print("All downloads complete")
```

```python
# Thread-safe with Lock
lock = threading.Lock()
counter = 0

def increment():
    global counter
    for _ in range(100000):
        with lock:
            counter += 1

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)
t1.start(); t2.start()
t1.join(); t2.join()
print(counter)  # 200000 (correct with lock)
```

### Q45. concurrent.futures?

**Simple Answer:**
`ThreadPoolExecutor` is for I/O-bound parallel work (API calls). `ProcessPoolExecutor` is for CPU-bound parallel work. Both provide a clean high-level interface over raw threading/multiprocessing. `as_completed()` lets you process results as they finish, not in submission order.

**💬 How to say it in an interview:**
> "I use concurrent.futures.ThreadPoolExecutor in my API test framework for parallel request execution. The key advantage over raw threading is the clean interface — submit() returns a Future object, and as_completed() lets me handle results as each thread finishes. This is how I run smoke test API checks in parallel after a deployment — 20 endpoint checks that used to take 40 seconds now run in under 5 seconds."

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed

# Thread pool (I/O-bound)
def fetch(url):
    import requests
    return requests.get(url).status_code

urls = ["https://httpbin.org/get"] * 5

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(fetch, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        print(f"{url}: {future.result()}")

# Process pool (CPU-bound)
def cpu_heavy(n):
    return sum(i*i for i in range(n))

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_heavy, [10**6]*4))
```
