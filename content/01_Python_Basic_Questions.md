# Python Interview Prep — SDET (8+ Years) — PART 1: BASIC
## Covers: Noida | Hyderabad | Gurugram | Delhi | Pune | Chennai

---

# SECTION A — BASIC LEVEL (Theoretical)

## Q1. What is Python? Why popular for test automation?
Python is a high-level, interpreted, dynamically-typed language. Popular for SDET because:
- Simple readable syntax
- Rich testing ecosystem (pytest, unittest, robot framework, behave)
- Libraries for API (requests), UI (Selenium), mobile (Appium)
- Cross-platform, large community

## Q2. Python 2 vs Python 3?
| Feature | Python 2 | Python 3 |
|---------|----------|----------|
| Print | `print "hi"` | `print("hi")` |
| Division | `5/2 = 2` | `5/2 = 2.5` |
| Unicode | ASCII default | Unicode default |
| range() | Returns list | Returns iterator |
| Support | EOL Jan 2020 | Active |

## Q3. Built-in data types?
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
| Feature | List | Tuple | Set | Dict |
|---------|------|-------|-----|------|
| Mutable | Yes | No | Yes | Yes |
| Ordered | Yes | Yes | No | Yes (3.7+) |
| Duplicates | Yes | Yes | No | Keys:No |
| Syntax | `[1,2]` | `(1,2)` | `{1,2}` | `{k:v}` |

## Q5. `is` vs `==`?
- `==` checks **value equality** (calls `__eq__`)
- `is` checks **identity** (same object in memory)

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  (same value)
print(a is b)   # False (different objects)
```

## Q6. Mutable vs Immutable?
- **Immutable:** `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`, `bool`
- **Mutable:** `list`, `dict`, `set`, `bytearray`

## Q7. Shallow copy vs Deep copy?
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
- `*args` — positional args → **tuple**
- `**kwargs` — keyword args → **dict**

```python
def demo(*args, **kwargs):
    print(args)    # (1, 2, 3)
    print(kwargs)  # {'name': 'Vikrant'}
demo(1, 2, 3, name="Vikrant")
```

## Q9. List comprehensions?
```python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
sq_dict = {x: x**2 for x in range(5)}
```

## Q10. `append()` vs `extend()` vs `insert()`?
```python
lst = [1, 2, 3]
lst.append([4, 5])   # [1, 2, 3, [4, 5]]
lst = [1, 2, 3]
lst.extend([4, 5])   # [1, 2, 3, 4, 5]
lst = [1, 2, 3]
lst.insert(1, 99)    # [1, 99, 2, 3]
```

## Q11. `remove()` vs `pop()` vs `del`?
```python
lst = [10, 20, 30, 20]
lst.remove(20)       # Removes first occurrence → [10, 30, 20]
lst = [10, 20, 30]
val = lst.pop(1)     # Removes by index, returns value → val=20
del lst[0]           # Removes by index, no return
```

## Q12. Python memory management?
- **Private heap** for all objects
- **Reference counting** — primary mechanism
- **Garbage collector** — handles cyclic references (3 generations)
- **pymalloc** — small object allocator (≤512 bytes)

## Q13. `break`, `continue`, `pass`?
- `break` — exits loop entirely
- `continue` — skips current iteration
- `pass` — does nothing (placeholder)

## Q14. Namespaces & LEGB rule?
1. **L — Local:** Inside current function
2. **E — Enclosing:** Enclosing function (closures)
3. **G — Global:** Module-level
4. **B — Built-in:** Python built-ins

## Q15. `global` and `nonlocal`?
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
```python
name = "Vikrant"
print(f"{name} has {8}+ years exp")  # fastest, Python 3.6+
print("{} has {}+ years".format(name, 8))
print("%s has %d+ years" % (name, 8))
```

## Q17. Walrus operator `:=` (Python 3.8+)?
```python
while (data := input("Enter: ")) != "quit":
    print(data)
results = [y for x in range(10) if (y := x**2) > 20]
```

## Q18. Lambda functions?
```python
square = lambda x: x ** 2
sorted_nums = sorted([3,1,4], key=lambda x: -x)
```

## Q19. `map()`, `filter()`, `reduce()`?
```python
from functools import reduce
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
total = reduce(lambda a, b: a + b, nums)  # 15
```

## Q20. Closures?
```python
def multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply
double = multiplier(2)
print(double(5))  # 10
```

## Q21. String methods cheat sheet?
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
```python
s = "automation"
print(s[::-1])              # "noitamotua"
print("".join(reversed(s)))
```

## Q23. Check palindrome?
```python
def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]
```

## Q24. Function vs Method?
- **Function:** standalone `def greet(): ...`
- **Method:** bound to object `obj.greet()` — receives `self` or `cls`
