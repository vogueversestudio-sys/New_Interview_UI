# Python Interview Prep — SDET (8+ Years) — PART 1: BASIC
## Vikrant Mishra — SDET Interview Prep

> **Python for SDETs:** Python is now the #1 language for test automation. If you know Java from your Selenium work, Python will feel similar but simpler. In your interviews, connect every Python concept back to test automation — pytest, fixtures, data-driven testing, API testing with requests. That's what impresses interviewers.

---

# SECTION A — BASIC LEVEL (Theoretical)

## Q1. What is Python? Why popular for test automation?

**Simple Answer:**
Python is a programming language that is easy to read and write. It is very popular for test automation because it has simple syntax, great testing libraries like pytest, and powerful tools for API testing (requests), UI automation (Selenium, Playwright), and data handling.

**💬 How to say it in an interview:**
> "I use Python as my primary automation language at PersonifyHealth. Python was the right choice because pytest is a very powerful test framework with fixtures and parameterisation, the requests library makes REST API testing simple, and Playwright for Python is excellent for UI automation. Python's readability also means my test code is clean and easy for the team to review in pull requests."

**⚡ Key Points:**
- High-level, interpreted, dynamically typed
- Popular for SDET: pytest, Selenium, Playwright, requests, Robot Framework
- Simple syntax = faster test writing and easier code reviews

Python is a high-level, interpreted, dynamically-typed language. Popular for SDET because:
- Simple readable syntax
- Rich testing ecosystem (pytest, unittest, robot framework, behave)
- Libraries for API (requests), UI (Selenium), mobile (Appium)
- Cross-platform, large community

## Q2. Python 2 vs Python 3?

**Simple Answer:**
Always use Python 3. Python 2 reached end-of-life in January 2020 — it no longer receives updates or security patches. The main differences: print is a function in Python 3, integer division returns a float (5/2=2.5), and strings are Unicode by default.

| Feature | Python 2 | Python 3 |
|---------|----------|----------|
| Print | `print "hi"` | `print("hi")` |
| Division | `5/2 = 2` | `5/2 = 2.5` |
| Unicode | ASCII default | Unicode default |
| range() | Returns list | Returns iterator |
| Support | EOL Jan 2020 | Active |

## Q3. Built-in data types?

**Simple Answer:**
Python has several built-in types. The ones you use most in automation: `str` for strings, `list` for sequences, `dict` for key-value pairs (JSON responses), `bool` for assertions, and `None` for missing values. Know them and when to use each.

| Category | Types |
|----------|-------|
| Numeric | `int`, `float`, `complex`, `bool` |
| Sequence | `list`, `tuple`, `range` |
| Text | `str` |
| Set | `set`, `frozenset` |
| Mapping | `dict` |
| Binary | `bytes`, `bytearray`, `memoryview` |
| None | `NoneType` |

## Q4. list vs tuple vs set vs dict?

**Simple Answer:**
- **List** = ordered, changeable, allows duplicates. Use for test data collections.
- **Tuple** = ordered, NOT changeable. Use for data that shouldn't change (config values).
- **Set** = unordered, NO duplicates. Use to find unique items.
- **Dict** = key-value pairs. Use for JSON responses and test data objects.

**💬 How to say it in an interview:**
> "In my test automation, I use these constantly. Dicts are what JSON API responses become when I parse them with json.loads(). Lists store test cases and expected values. Tuples I use for fixtures that shouldn't be modified. Sets are great for checking duplicates — for example, if I have a list of API-returned user IDs, converting to a set instantly tells me if any are duplicated."

| Feature | List | Tuple | Set | Dict |
|---------|------|-------|-----|------|
| Mutable | Yes | No | Yes | Yes |
| Ordered | Yes | Yes | No | Yes (3.7+) |
| Duplicates | Yes | Yes | No | Keys:No |
| Syntax | `[1,2]` | `(1,2)` | `{1,2}` | `{k:v}` |

## Q5. `is` vs `==`?

**Simple Answer:**
- `==` checks if two variables have the **same value**
- `is` checks if two variables point to the **exact same object in memory**
- In automation, ALWAYS use `==` for value comparison. Only use `is` to check `if x is None`.

**💬 How to say it in an interview:**
> "This trips up a lot of people. == compares values. is compares identity — are they literally the same object in memory? The only place I use 'is' in my test code is for None checks: 'if response is None'. For everything else, I use ==. Python caches small integers (-5 to 256) so 'is' might work for those by coincidence, but relying on that is a bug waiting to happen."

- `==` checks **value equality** (calls `__eq__`)
- `is` checks **identity** (same object in memory)

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  (same value)
print(a is b)   # False (different objects)
```

## Q6. Mutable vs Immutable?

**Simple Answer:**
Mutable = can be changed after creation (list, dict, set). Immutable = cannot be changed (str, tuple, int, float). This matters in automation because if you pass a mutable object to a function and modify it inside, the original is also changed — this can cause hard-to-find test bugs.

**⚡ Key Points:**
- Immutable: `int`, `float`, `str`, `tuple`, `frozenset`, `bool`
- Mutable: `list`, `dict`, `set`
- Strings are immutable — every modification creates a NEW string
- Use tuple instead of list for read-only data (like test config values)

- **Immutable:** `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`, `bool`
- **Mutable:** `list`, `dict`, `set`, `bytearray`

## Q7. Shallow copy vs Deep copy?

**Simple Answer:**
- **Shallow copy** = creates a new outer container, but inner objects are still shared (same reference)
- **Deep copy** = creates a completely independent copy, including all nested objects

**💬 How to say it in an interview:**
> "Shallow vs deep copy is important in test data management. If I have a base test data dictionary with nested objects and I shallow copy it for each test case, modifying nested data in one test case will affect others. In my pytest fixtures, I use deepcopy() for complex test data objects to ensure each test case gets a completely independent copy."

```python
import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)       # inner objects shared
deep = copy.deepcopy(original)      # completely independent
original[0][0] = 999
print(shallow)  # [[999, 2], [3, 4]]
print(deep)     # [[1, 2], [3, 4]]
```

## Q8. `*args` and `**kwargs`?

**Simple Answer:**
- `*args` = accept any number of positional arguments (they come in as a tuple)
- `**kwargs` = accept any number of keyword arguments (they come in as a dict)
- Use them when you don't know in advance how many arguments a function will receive

**💬 How to say it in an interview:**
> "I use *args and **kwargs in my test utilities. For example, I have a generic API request helper that accepts **kwargs for optional parameters like headers, auth, and timeout — the caller only passes what they need. In pytest, fixtures use these patterns internally. It makes utility functions very flexible."

- `*args` — positional args → **tuple**
- `**kwargs` — keyword args → **dict**

```python
def demo(*args, **kwargs):
    print(args)    # (1, 2, 3)
    print(kwargs)  # {'name': 'Vikrant'}
demo(1, 2, 3, name="Vikrant")
```

## Q9. List comprehensions?

**Simple Answer:**
List comprehension is a concise way to create a list in one line. Instead of a for loop with append, you write the expression and the loop in square brackets. It's faster and more Pythonic. Use it for filtering and transforming lists.

**💬 How to say it in an interview:**
> "I use list comprehensions a lot in test data setup. For example, to get all test IDs from a list of response objects: test_ids = [item['id'] for item in response_data]. Or to filter only failed tests: failures = [t for t in test_results if t.status == 'FAIL']. Much cleaner than a 3-line for loop."

```python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
sq_dict = {x: x**2 for x in range(5)}
```

## Q10. `append()` vs `extend()` vs `insert()`?

**Simple Answer:**
- `append(x)` = adds x as a SINGLE item at the end (even if x is a list, it adds the list as one item)
- `extend(iterable)` = unpacks and adds each item of the iterable at the end
- `insert(i, x)` = inserts x at position i

```python
lst = [1, 2, 3]
lst.append([4, 5])   # [1, 2, 3, [4, 5]]
lst = [1, 2, 3]
lst.extend([4, 5])   # [1, 2, 3, 4, 5]
lst = [1, 2, 3]
lst.insert(1, 99)    # [1, 99, 2, 3]
```

## Q11. `remove()` vs `pop()` vs `del`?

**Simple Answer:**
- `remove(value)` = removes the FIRST occurrence of a value (by value, not index)
- `pop(index)` = removes by index AND returns the removed value
- `del list[index]` = removes by index, does NOT return anything

```python
lst = [10, 20, 30, 20]
lst.remove(20)       # Removes first occurrence → [10, 30, 20]
lst = [10, 20, 30]
val = lst.pop(1)     # Removes by index, returns value → val=20
del lst[0]           # Removes by index, no return
```

## Q12. Python memory management?

**Simple Answer:**
Python automatically manages memory. The main mechanism is reference counting — when an object has zero references pointing to it, it gets freed. Python also has a garbage collector for cyclic references (objects that reference each other).

**💬 How to say it in an interview:**
> "Python uses reference counting as the primary memory management mechanism. When you do del x, you remove one reference. When the count hits zero, the object is freed. Python also has a cyclic garbage collector because reference counting can't handle cases where object A references B and B references A — neither count would reach zero. As an SDET, I'm aware of this because in large test suites, WebDriver instances and file handles need to be properly closed — not just relied on garbage collection."

- **Private heap** for all objects
- **Reference counting** — primary mechanism
- **Garbage collector** — handles cyclic references (3 generations)
- **pymalloc** — small object allocator (≤512 bytes)

## Q13. `break`, `continue`, `pass`?

**Simple Answer:**
- `break` = exit the loop immediately
- `continue` = skip the rest of this iteration and go to the next one
- `pass` = do nothing (placeholder when syntax requires a block but you don't want any code yet)

**💬 How to say it in an interview:**
> "I use continue in test loops when I want to skip certain test cases based on a condition without breaking the whole loop. For example: if test is None: continue. I use break when I find what I'm looking for and don't need to process the rest. pass I use as a placeholder in abstract-like base classes or when stubbing out methods."

- `break` — exits loop entirely
- `continue` — skips current iteration
- `pass` — does nothing (placeholder)

## Q14. Namespaces & LEGB rule?

**Simple Answer:**
When Python encounters a variable name, it looks for it in this order: Local (inside the current function) → Enclosing (outer function if it's a nested function) → Global (module level) → Built-in (Python's built-in names). This is the LEGB rule.

1. **L — Local:** Inside current function
2. **E — Enclosing:** Enclosing function (closures)
3. **G — Global:** Module-level
4. **B — Built-in:** Python built-ins

## Q15. `global` and `nonlocal`?

**Simple Answer:**
- `global` = tells Python to use the module-level variable, not create a new local one
- `nonlocal` = tells Python to use the variable from the immediately enclosing function (not global)
- In tests, avoid global variables — use fixtures or class variables instead.

```python
count = 0
def increment():
    global count
    count += 1

def outer():
    x = 10
    def inner():
        nonlocal x
        x += 5
    inner()
    print(x)  # 15
```

## Q16. f-strings?

**Simple Answer:**
f-strings (formatted string literals) are the modern and fastest way to embed variables inside strings in Python 3.6+. Always prefer f-strings over .format() or % formatting.

```python
name = "Vikrant"
print(f"{name} has {8}+ years exp")  # fastest, Python 3.6+
print("{} has {}+ years".format(name, 8))
print("%s has %d+ years" % (name, 8))
```

## Q17. Walrus operator `:=` (Python 3.8+)?

**Simple Answer:**
The walrus operator `:=` assigns a value AND returns it in one step. It's useful in while loops and comprehensions where you want to assign and check a value in the same expression.

```python
while (data := input("Enter: ")) != "quit":
    print(data)
results = [y for x in range(10) if (y := x**2) > 20]
```

## Q18. Lambda functions?

**Simple Answer:**
A lambda is a small, anonymous function defined in one line. Use it when you need a simple function just once — most commonly as a key in sort() or sorted(), or with map() and filter().

**💬 How to say it in an interview:**
> "I use lambdas for simple one-liners, like sorting a list of API response objects by a specific field: sorted(users, key=lambda u: u['name']). They're clean and readable for simple cases, but for anything complex I write a proper named function."

```python
square = lambda x: x ** 2
sorted_nums = sorted([3,1,4], key=lambda x: -x)
```

## Q19. `map()`, `filter()`, `reduce()`?

**Simple Answer:**
- `map(function, list)` = apply a function to every item and return transformed items
- `filter(function, list)` = keep only items where the function returns True
- `reduce(function, list)` = reduce a list to a single value by repeatedly applying the function
- In modern Python, list comprehensions are usually preferred over map/filter for readability.

```python
from functools import reduce
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
total = reduce(lambda a, b: a + b, nums)  # 15
```

## Q20. Closures?

**Simple Answer:**
A closure is a function that remembers the variables from its enclosing scope, even after the outer function has finished executing. Used to create factory functions and decorators.

**💬 How to say it in an interview:**
> "Closures are important in test automation for creating factory functions. For example, I create a make_api_caller(base_url) closure that returns a function with the base_url baked in. All tests that use that environment share the same base_url without having to pass it every time. This is the foundation of how Python decorators work too."

```python
def multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply
double = multiplier(2)
print(double(5))  # 10
```

## Q21. String methods cheat sheet?

**Simple Answer:**
These are the most important string methods for SDET work. In API testing, you use strip(), lower(), split(), and in/contains checks constantly when validating response data.

```python
s = "  Hello, World!  "
s.strip()       # "Hello, World!"
s.lower()       # "  hello, world!  "
s.split(",")    # ['  Hello', ' World!  ']
",".join(["a","b"])  # "a,b"
s.find("World") # 9 (-1 if not found)
s.replace("World", "Python")
s.startswith("  He")  # True
s.isdigit()     # False
```

## Q22. Reverse a string?

**Simple Answer:**
The cleanest Python way is `s[::-1]` using slice notation with step -1. This is the answer interviewers expect in a Python interview.

```python
s = "automation"
print(s[::-1])              # "noitamotua"
print("".join(reversed(s)))
```

## Q23. Check palindrome?

**Simple Answer:**
A palindrome reads the same forwards and backwards. The Python approach: clean the string (lowercase, remove spaces), then compare it to its reverse. If equal, it's a palindrome.

```python
def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]
```

## Q24. Function vs Method?

**Simple Answer:**
- **Function** = standalone, not attached to any class (def greet(): ...)
- **Method** = a function that belongs to a class and always receives the object as first argument (self or cls)

**⚡ Key Points:**
- Both are defined with `def`
- Methods always have `self` (instance) or `cls` (class) as first parameter
- Static methods in a class have neither (they behave like regular functions)

- **Function:** standalone `def greet(): ...`
- **Method:** bound to object `obj.greet()` — receives `self` or `cls`
