# Python Interview Prep — SDET (8+ Years) — PART 5: CODING PROBLEMS
## Covers: Noida | Hyderabad | Gurugram | Delhi | Pune | Chennai

---

# SECTION E — CODING PROBLEMS (Basic to Advanced)

> These are the most frequently asked coding problems in SDET interviews across
> Indian tech hubs (TCS, Infosys, Wipro, HCL, Accenture, Cognizant, Capgemini,
> Amazon, Flipkart, Paytm, Zomato, Swiggy, Microsoft, Google, Myntra, etc.)

---

## E1. STRING PROBLEMS

### CP1. Find duplicate characters in a string
```python
def find_duplicates(s):
    from collections import Counter
    return {ch: cnt for ch, cnt in Counter(s).items() if cnt > 1}

print(find_duplicates("automation"))  # {'a': 2, 't': 2, 'o': 2}
```

### CP2. Check if two strings are anagrams
```python
def is_anagram(s1, s2):
    from collections import Counter
    return Counter(s1.lower()) == Counter(s2.lower())

print(is_anagram("listen", "silent"))  # True
print(is_anagram("hello", "world"))    # False
```

### CP3. First non-repeating character
```python
def first_non_repeating(s):
    from collections import Counter
    count = Counter(s)
    for ch in s:
        if count[ch] == 1:
            return ch
    return None

print(first_non_repeating("aabbcdd"))  # 'c'
print(first_non_repeating("aabb"))     # None
```

### CP4. Reverse words in a string
```python
def reverse_words(s):
    return " ".join(s.split()[::-1])

print(reverse_words("Hello World Python"))  # "Python World Hello"
```

### CP5. Longest substring without repeating characters
```python
def longest_unique_substring(s):
    char_index = {}
    start = max_len = 0
    result = ""

    for end, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= start:
            start = char_index[ch] + 1
        char_index[ch] = end
        if end - start + 1 > max_len:
            max_len = end - start + 1
            result = s[start:end+1]

    return result

print(longest_unique_substring("abcabcbb"))   # "abc"
print(longest_unique_substring("bbbbb"))       # "b"
print(longest_unique_substring("pwwkew"))      # "wke"
```

### CP6. String compression (Run-Length Encoding)
```python
def compress(s):
    if not s:
        return s
    result = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append(f"{s[i-1]}{count}")
            count = 1
    result.append(f"{s[-1]}{count}")
    compressed = "".join(result)
    return compressed if len(compressed) < len(s) else s

print(compress("aabcccccaaa"))  # "a2b1c5a3"
print(compress("abc"))          # "abc" (not shorter)
```

### CP7. Check if string is a valid palindrome (ignoring non-alphanumeric)
```python
def is_valid_palindrome(s):
    cleaned = ''.join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]

print(is_valid_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_valid_palindrome("race a car"))                       # False
```

### CP8. Count vowels and consonants
```python
def count_vowels_consonants(s):
    vowels = set("aeiouAEIOU")
    v = c = 0
    for ch in s:
        if ch.isalpha():
            if ch in vowels:
                v += 1
            else:
                c += 1
    return {"vowels": v, "consonants": c}

print(count_vowels_consonants("Hello World"))  # {'vowels': 3, 'consonants': 7}
```

### CP9. Remove duplicates from string (preserve order)
```python
def remove_dup_chars(s):
    seen = set()
    return ''.join(ch for ch in s if not (ch in seen or seen.add(ch)))

print(remove_dup_chars("programming"))  # "progamin"
```

### CP10. Check if string contains only digits
```python
def is_numeric(s):
    # Multiple approaches
    return s.isdigit()            # True for "123"
    # return s.isnumeric()        # True for "123", "²" (superscript)
    # return s.isdecimal()        # True for "123" only

# Handling negative/decimal
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

print(is_number("-3.14"))  # True
print(is_number("abc"))    # False
```

### CP11. Longest common prefix
```python
def longest_common_prefix(strs):
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix

print(longest_common_prefix(["flower", "flow", "flight"]))  # "fl"
```

### CP12. String permutations
```python
def permutations(s):
    if len(s) <= 1:
        return [s]
    result = []
    for i, ch in enumerate(s):
        remaining = s[:i] + s[i+1:]
        for perm in permutations(remaining):
            result.append(ch + perm)
    return result

print(permutations("abc"))
# ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
```

---

## E2. LIST / ARRAY PROBLEMS

### CP13. Two Sum — find two numbers adding to target
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
```

### CP14. Remove duplicates (preserve order)
```python
def remove_duplicates(lst):
    seen = set()
    return [x for x in lst if not (x in seen or seen.add(x))]

# Using dict.fromkeys (Python 3.7+)
def remove_duplicates_v2(lst):
    return list(dict.fromkeys(lst))

print(remove_duplicates([1, 3, 2, 3, 1, 4, 2]))  # [1, 3, 2, 4]
```

### CP15. Flatten nested list
```python
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

# Generator version
def flatten_gen(lst):
    for item in lst:
        if isinstance(item, list):
            yield from flatten_gen(item)
        else:
            yield item

print(flatten([1, [2, [3, 4], 5], [6, 7]]))  # [1, 2, 3, 4, 5, 6, 7]
```

### CP16. Find missing number in 1 to N
```python
def find_missing(arr, n):
    expected = n * (n + 1) // 2
    return expected - sum(arr)

# XOR approach (no overflow)
def find_missing_xor(arr, n):
    xor = 0
    for i in range(1, n + 1):
        xor ^= i
    for num in arr:
        xor ^= num
    return xor

print(find_missing([1, 2, 4, 5, 6], 6))  # 3
```

### CP17. Second largest element
```python
def second_largest(arr):
    if len(arr) < 2:
        return None
    first = second = float('-inf')
    for num in arr:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num
    return second if second != float('-inf') else None

print(second_largest([10, 5, 20, 8, 20]))  # 10
```

### CP18. Rotate array by K positions
```python
def rotate_array(arr, k):
    k = k % len(arr)
    return arr[-k:] + arr[:-k]

print(rotate_array([1, 2, 3, 4, 5], 2))  # [4, 5, 1, 2, 3]
```

### CP19. Merge two sorted arrays
```python
def merge_sorted(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result

print(merge_sorted([1, 3, 5], [2, 4, 6]))  # [1, 2, 3, 4, 5, 6]
```

### CP20. Find all pairs with given sum
```python
def find_pairs(arr, target):
    seen = set()
    pairs = []
    for num in arr:
        complement = target - num
        if complement in seen:
            pairs.append((min(num, complement), max(num, complement)))
        seen.add(num)
    return pairs

print(find_pairs([1, 5, 7, -1, 5], 6))  # [(1, 5), (7, -1), (1, 5)]
```

### CP21. Move zeros to end
```python
def move_zeros(arr):
    pos = 0
    for i in range(len(arr)):
        if arr[i] != 0:
            arr[pos], arr[i] = arr[i], arr[pos]
            pos += 1
    return arr

print(move_zeros([0, 1, 0, 3, 12]))  # [1, 3, 12, 0, 0]
```

### CP22. Find intersection of two arrays
```python
def intersection(a, b):
    return list(set(a) & set(b))

# With duplicates preserved
from collections import Counter
def intersection_with_dups(a, b):
    count_a = Counter(a)
    count_b = Counter(b)
    return list((count_a & count_b).elements())

print(intersection([1,2,2,1], [2,2]))             # [2]
print(intersection_with_dups([1,2,2,1], [2,2]))   # [2, 2]
```

### CP23. Maximum subarray sum (Kadane's Algorithm)
```python
def max_subarray_sum(arr):
    max_sum = current = arr[0]
    for num in arr[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    return max_sum

print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6 ([4,-1,2,1])
```

### CP24. Find the leader elements (greater than all to its right)
```python
def find_leaders(arr):
    leaders = []
    max_right = arr[-1]
    leaders.append(max_right)
    for i in range(len(arr)-2, -1, -1):
        if arr[i] > max_right:
            leaders.append(arr[i])
            max_right = arr[i]
    return leaders[::-1]

print(find_leaders([16, 17, 4, 3, 5, 2]))  # [17, 5, 2]
```

---

## E3. DICTIONARY PROBLEMS

### CP25. Group anagrams
```python
def group_anagrams(words):
    from collections import defaultdict
    groups = defaultdict(list)
    for word in words:
        key = tuple(sorted(word))
        groups[key].append(word)
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

### CP26. Most frequent element
```python
def most_frequent(lst):
    from collections import Counter
    return Counter(lst).most_common(1)[0]

print(most_frequent([1, 3, 2, 1, 4, 1, 3]))  # (1, 3)
```

### CP27. Invert a dictionary
```python
def invert_dict(d):
    return {v: k for k, v in d.items()}

# Handle duplicate values
from collections import defaultdict
def invert_dict_safe(d):
    inv = defaultdict(list)
    for k, v in d.items():
        inv[v].append(k)
    return dict(inv)

print(invert_dict({"a": 1, "b": 2}))  # {1: 'a', 2: 'b'}
```

### CP28. Merge two dictionaries
```python
# Python 3.9+
merged = {"a": 1} | {"b": 2}  # {'a': 1, 'b': 2}

# Python 3.5+
merged = {**{"a": 1}, **{"b": 2}}

# Deep merge
def deep_merge(d1, d2):
    result = d1.copy()
    for key, value in d2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result
```

### CP29. Find common keys between two dicts
```python
def common_keys(d1, d2):
    return set(d1.keys()) & set(d2.keys())

def common_items(d1, d2):
    return {k: d1[k] for k in d1 if k in d2 and d1[k] == d2[k]}
```

### CP30. Sort dictionary by value
```python
d = {"banana": 3, "apple": 1, "cherry": 2}

# Ascending
sorted_d = dict(sorted(d.items(), key=lambda x: x[1]))
# {'apple': 1, 'cherry': 2, 'banana': 3}

# Descending
sorted_d = dict(sorted(d.items(), key=lambda x: x[1], reverse=True))
```

---

## E4. SORTING & SEARCHING

### CP31. Binary search
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))  # 3
```

### CP32. Sorting algorithms
```python
# Quick Sort
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result

# Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Selection Sort
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Insertion Sort
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr
```

### CP33. Search in rotated sorted array
```python
def search_rotated(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[left] <= arr[mid]:  # left half sorted
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # right half sorted
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))  # 4
```

---

## E5. RECURSION & DYNAMIC PROGRAMMING

### CP34. Fibonacci (multiple approaches)
```python
# Recursive O(2^n)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Memoized O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1: return n
    return fib_memo(n-1) + fib_memo(n-2)

# Iterative O(n) time, O(1) space
def fib_iter(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b

# Generator
def fib_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
```

### CP35. Factorial
```python
def factorial(n):
    if n <= 1: return 1
    return n * factorial(n-1)

# Iterative
def factorial_iter(n):
    result = 1
    for i in range(2, n+1):
        result *= i
    return result
```

### CP36. Power of a number (fast exponentiation)
```python
def power(base, exp):
    if exp == 0: return 1
    if exp < 0: return 1 / power(base, -exp)
    if exp % 2 == 0:
        half = power(base, exp // 2)
        return half * half
    return base * power(base, exp - 1)

print(power(2, 10))  # 1024
print(power(2, -2))  # 0.25
```

### CP37. Longest Common Subsequence (LCS)
```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]

    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # Backtrack for the actual subsequence
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            result.append(s1[i-1])
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))

print(lcs("ABCBDAB", "BDCAB"))  # "BCAB"
```

### CP38. Coin change (minimum coins)
```python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 5, 10, 25], 30))  # 2 (25 + 5)
```

### CP39. Climbing stairs (ways to reach top)
```python
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n+1):
        a, b = b, a + b
    return b

print(climb_stairs(5))  # 8
```

### CP40. 0/1 Knapsack
```python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]

    for i in range(1, n+1):
        for w in range(capacity+1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    dp[i-1][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                )
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

print(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))  # 7
```

---

## E6. MATRIX / 2D ARRAY

### CP41. Rotate matrix 90° clockwise
```python
def rotate_matrix(matrix):
    return [list(row) for row in zip(*matrix[::-1])]

m = [[1,2,3],[4,5,6],[7,8,9]]
print(rotate_matrix(m))
# [[7,4,1],[8,5,2],[9,6,3]]
```

### CP42. Spiral traversal
```python
def spiral_order(matrix):
    result = []
    while matrix:
        result += matrix.pop(0)
        if matrix and matrix[0]:
            for row in matrix:
                result.append(row.pop())
        if matrix:
            result += matrix.pop()[::-1]
        if matrix and matrix[0]:
            for row in matrix[::-1]:
                result.append(row.pop(0))
    return result

print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
# [1,2,3,6,9,8,7,4,5]
```

### CP43. Transpose a matrix
```python
def transpose(matrix):
    return [list(row) for row in zip(*matrix)]

print(transpose([[1,2,3],[4,5,6]]))
# [[1,4],[2,5],[3,6]]
```

---

## E7. LINKED LIST

### CP44. Singly linked list with common operations
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        if not self.head:
            self.head = ListNode(val)
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = ListNode(val)

    def reverse(self):
        prev, curr = None, self.head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        self.head = prev

    def find_middle(self):
        slow = fast = self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow.val if slow else None

    def has_cycle(self):
        slow = fast = self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False

    def remove_nth_from_end(self, n):
        dummy = ListNode(0)
        dummy.next = self.head
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            slow = slow.next
            fast = fast.next
        slow.next = slow.next.next
        self.head = dummy.next

    def to_list(self):
        result, curr = [], self.head
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result
```

---

## E8. STACK & QUEUE

### CP45. Balanced parentheses
```python
def is_balanced(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in mapping.values():
            stack.append(ch)
        elif ch in mapping:
            if not stack or stack[-1] != mapping[ch]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_balanced("({[]})"))  # True
print(is_balanced("({[}])"))  # False
```

### CP46. Min Stack (O(1) getMin)
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()
        return val

    def get_min(self):
        return self.min_stack[-1]
```

### CP47. Evaluate postfix expression
```python
def eval_postfix(expr):
    stack = []
    operators = {'+', '-', '*', '/'}
    for token in expr.split():
        if token in operators:
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
        else:
            stack.append(int(token))
    return stack[0]

print(eval_postfix("2 3 + 4 *"))  # 20
```

### CP48. Implement queue using two stacks
```python
class QueueUsingStacks:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def enqueue(self, val):
        self.in_stack.append(val)

    def dequeue(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack.pop() if self.out_stack else None
```

---

## E9. TREE PROBLEMS

### CP49. BST implementation with traversals
```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node: return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        else:
            node.right = self._insert(node.right, val)
        return node

    def inorder(self, node):
        if not node: return []
        return self.inorder(node.left) + [node.val] + self.inorder(node.right)

    def preorder(self, node):
        if not node: return []
        return [node.val] + self.preorder(node.left) + self.preorder(node.right)

    def postorder(self, node):
        if not node: return []
        return self.postorder(node.left) + self.postorder(node.right) + [node.val]

    def level_order(self):
        if not self.root: return []
        result, queue = [], [self.root]
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.pop(0)
                level.append(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result

    def height(self, node):
        if not node: return 0
        return 1 + max(self.height(node.left), self.height(node.right))

    def search(self, node, val):
        if not node or node.val == val: return node
        if val < node.val: return self.search(node.left, val)
        return self.search(node.right, val)
```

### CP50. Check if binary tree is balanced
```python
def is_balanced(root):
    def check(node):
        if not node: return 0
        left = check(node.left)
        right = check(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    return check(root) != -1
```

---

## E10. REAL-WORLD SDET CODING PROBLEMS

### CP51. Log file parser — find top N errors
```python
import re
from collections import Counter

def parse_logs(log_file, top_n=5):
    pattern = re.compile(r'ERROR\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+(.*)')
    errors = []
    with open(log_file) as f:
        for line in f:
            m = pattern.search(line)
            if m:
                errors.append(m.group(1).strip())
    return Counter(errors).most_common(top_n)
```

### CP52. Retry decorator with exponential backoff
```python
import time, functools

def retry(max_attempts=3, backoff=2, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts: raise
                    wait = backoff ** attempt
                    print(f"Attempt {attempt} failed: {e}. Retry in {wait}s")
                    time.sleep(wait)
        return wrapper
    return decorator

@retry(max_attempts=3, exceptions=(ConnectionError, TimeoutError))
def call_api(url):
    import requests
    return requests.get(url, timeout=5).json()
```

### CP53. Data-driven test reader (JSON/CSV/YAML)
```python
import json, csv
from pathlib import Path

class TestDataReader:
    @staticmethod
    def read(file_path):
        ext = Path(file_path).suffix.lower()
        if ext == '.json':
            with open(file_path) as f: return json.load(f)
        elif ext == '.csv':
            with open(file_path, newline='') as f: return list(csv.DictReader(f))
        elif ext in ('.yaml', '.yml'):
            import yaml
            with open(file_path) as f: return yaml.safe_load(f)
        raise ValueError(f"Unsupported format: {ext}")
```

### CP54. API response validator (fluent/chained)
```python
class ResponseValidator:
    def __init__(self, response):
        self.response = response
        self.errors = []

    def status_code(self, expected):
        if self.response.status_code != expected:
            self.errors.append(f"Status: expected {expected}, got {self.response.status_code}")
        return self

    def json_has_key(self, key):
        if key not in self.response.json():
            self.errors.append(f"Missing key: {key}")
        return self

    def json_value(self, key, expected):
        actual = self.response.json().get(key)
        if actual != expected:
            self.errors.append(f"{key}: expected {expected}, got {actual}")
        return self

    def response_time_under(self, seconds):
        elapsed = self.response.elapsed.total_seconds()
        if elapsed > seconds:
            self.errors.append(f"Response time {elapsed:.2f}s > {seconds}s")
        return self

    def validate(self):
        if self.errors:
            raise AssertionError("\n".join(self.errors))
        return True

# Usage
# ResponseValidator(resp).status_code(200).json_has_key("id").response_time_under(2).validate()
```

### CP55. Parallel test data generator
```python
import random
import string
from dataclasses import dataclass, field
from typing import List

@dataclass
class TestUser:
    name: str
    email: str
    age: int
    active: bool = True

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def generate_users(count=100) -> List[TestUser]:
    return [
        TestUser(
            name=f"User_{random_string(6)}",
            email=f"{random_string(8)}@test.com",
            age=random.randint(18, 65),
            active=random.choice([True, False])
        )
        for _ in range(count)
    ]
```

### CP56. Compare two JSON responses (deep diff)
```python
def json_diff(expected, actual, path=""):
    diffs = []
    if type(expected) != type(actual):
        diffs.append(f"{path}: type mismatch {type(expected).__name__} vs {type(actual).__name__}")
        return diffs

    if isinstance(expected, dict):
        for key in set(list(expected.keys()) + list(actual.keys())):
            new_path = f"{path}.{key}" if path else key
            if key not in expected:
                diffs.append(f"{new_path}: unexpected key")
            elif key not in actual:
                diffs.append(f"{new_path}: missing key")
            else:
                diffs.extend(json_diff(expected[key], actual[key], new_path))

    elif isinstance(expected, list):
        if len(expected) != len(actual):
            diffs.append(f"{path}: length {len(expected)} vs {len(actual)}")
        for i, (e, a) in enumerate(zip(expected, actual)):
            diffs.extend(json_diff(e, a, f"{path}[{i}]"))

    elif expected != actual:
        diffs.append(f"{path}: {expected!r} vs {actual!r}")

    return diffs

# Usage
exp = {"name": "Vikrant", "scores": [90, 85]}
act = {"name": "vikrant", "scores": [90, 80]}
print(json_diff(exp, act))
# ['name: 'Vikrant' vs 'vikrant'', 'scores[1]: 85 vs 80']
```

### CP57. Wait utility with polling
```python
import time

def wait_until(condition, timeout=30, poll=0.5, message="Condition not met"):
    end_time = time.time() + timeout
    while time.time() < end_time:
        try:
            result = condition()
            if result:
                return result
        except Exception:
            pass
        time.sleep(poll)
    raise TimeoutError(f"{message} after {timeout}s")

# Usage
# wait_until(lambda: driver.find_element(By.ID, "status").text == "Done", timeout=15)
```

### CP58. Convert Excel to test data
```python
def read_excel_test_data(file_path, sheet_name=0):
    import openpyxl

    wb = openpyxl.load_workbook(file_path)
    ws = wb[sheet_name] if isinstance(sheet_name, str) else wb.worksheets[sheet_name]

    headers = [cell.value for cell in ws[1]]
    data = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        data.append(dict(zip(headers, row)))
    return data

# Usage with pytest
# test_data = read_excel_test_data("test_data/login_data.xlsx")
# @pytest.mark.parametrize("data", test_data)
# def test_login(data): ...
```

---

## E11. MISCELLANEOUS FREQUENTLY ASKED

### CP59. FizzBuzz
```python
def fizzbuzz(n):
    for i in range(1, n+1):
        if i % 15 == 0: print("FizzBuzz")
        elif i % 3 == 0: print("Fizz")
        elif i % 5 == 0: print("Buzz")
        else: print(i)
```

### CP60. Check prime number
```python
def is_prime(n):
    if n < 2: return False
    if n < 4: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i+2) == 0:
            return False
        i += 6
    return True
```

### CP61. GCD and LCM
```python
import math

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Or use math.gcd (Python 3.5+)
print(math.gcd(12, 8))  # 4

def lcm(a, b):
    return abs(a * b) // math.gcd(a, b)

# Python 3.9+: math.lcm(12, 8)
```

### CP62. Roman to Integer
```python
def roman_to_int(s):
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    result = 0
    for i in range(len(s)):
        if i + 1 < len(s) and values[s[i]] < values[s[i+1]]:
            result -= values[s[i]]
        else:
            result += values[s[i]]
    return result

print(roman_to_int("MCMXCIV"))  # 1994
```

### CP63. Find Armstrong numbers
```python
def is_armstrong(n):
    digits = str(n)
    power = len(digits)
    return n == sum(int(d) ** power for d in digits)

# All 3-digit Armstrong numbers
armstrongs = [i for i in range(100, 1000) if is_armstrong(i)]
print(armstrongs)  # [153, 370, 371, 407]
```

### CP64. Matrix multiplication
```python
def matrix_multiply(A, B):
    rows_a, cols_a = len(A), len(A[0])
    rows_b, cols_b = len(B), len(B[0])
    assert cols_a == rows_b

    result = [[0] * cols_b for _ in range(rows_a)]
    for i in range(rows_a):
        for j in range(cols_b):
            for k in range(cols_a):
                result[i][j] += A[i][k] * B[k][j]
    return result
```

### CP65. Implement LRU Cache
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

cache = LRUCache(2)
cache.put(1, "a")
cache.put(2, "b")
print(cache.get(1))  # "a"
cache.put(3, "c")    # evicts key 2
print(cache.get(2))  # -1
```

### CP66. Producer-Consumer pattern
```python
import threading
import queue
import time

def producer(q, items):
    for item in items:
        print(f"Producing: {item}")
        q.put(item)
        time.sleep(0.5)
    q.put(None)  # sentinel

def consumer(q):
    while True:
        item = q.get()
        if item is None:
            break
        print(f"Consuming: {item}")
        q.task_done()

q = queue.Queue(maxsize=5)
t1 = threading.Thread(target=producer, args=(q, range(10)))
t2 = threading.Thread(target=consumer, args=(q,))
t1.start(); t2.start()
t1.join(); t2.join()
```

---

## QUICK REFERENCE: TIME & SPACE COMPLEXITY

| Algorithm | Time (Avg) | Time (Worst) | Space |
|-----------|-----------|--------------|-------|
| Binary Search | O(log n) | O(log n) | O(1) |
| Bubble Sort | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(1) |
| Hash Table | O(1) | O(n) | O(n) |
| BST Search | O(log n) | O(n) | O(1) |
| BFS/DFS | O(V+E) | O(V+E) | O(V) |

---

## TIPS FOR SDET INTERVIEWS IN INDIA

1. **Most asked topics:** Strings, Lists, Dictionaries, OOP, pytest, Selenium, API testing
2. **Companies focus:** Design patterns (POM, Factory, Singleton), Framework architecture
3. **Senior level (8+ yrs):** Expect system design for test frameworks, CI/CD pipeline design
4. **Coding rounds:** Usually 2-3 problems in 45-60 minutes (Medium difficulty)
5. **Always discuss:** Time complexity, edge cases, alternative approaches
6. **Hot topics 2025-26:** Async testing, Playwright, API contract testing, AI in testing
7. **Behavioral:** Test strategy, defect management, team leadership, process improvement
