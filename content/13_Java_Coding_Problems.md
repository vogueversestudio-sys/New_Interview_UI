# Java Coding Problems — SDET Interview Prep
## Vikrant Mishra — India 2026 (Noida, Pune, Hyderabad, Bangalore, Gurugram, Dubai)
## Companies: Accenture, Wipro, Capgemini, TCS, Infosys, Cognizant, HCL, Publicis Sapient

---

# STRING PROBLEMS

---

## CP1. Reverse a String

```java
// Method 1: StringBuilder
public static String reverse(String str) {
    return new StringBuilder(str).reverse().toString();
}

// Method 2: char array (without built-in)
public static String reverseManual(String str) {
    char[] chars = str.toCharArray();
    int left = 0, right = chars.length - 1;
    while (left < right) {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    return new String(chars);
}

// Method 3: Recursion
public static String reverseRecursive(String str) {
    if (str.isEmpty()) return str;
    return reverseRecursive(str.substring(1)) + str.charAt(0);
}

System.out.println(reverse("Selenium"));  // muineleS
```

---

## CP2. Check if String is Palindrome

```java
public static boolean isPalindrome(String str) {
    str = str.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0, right = str.length() - 1;
    while (left < right) {
        if (str.charAt(left) != str.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}

System.out.println(isPalindrome("madam"));       // true
System.out.println(isPalindrome("A man a plan a canal Panama")); // true
System.out.println(isPalindrome("hello"));        // false
```

---

## CP3. First Non-Repeating Character in a String (Wipro, Accenture — very frequent)

```java
// Method 1: LinkedHashMap (preserves insertion order)
public static char firstNonRepeating(String str) {
    Map<Character, Integer> map = new LinkedHashMap<>();
    for (char ch : str.toCharArray()) {
        map.put(ch, map.getOrDefault(ch, 0) + 1);
    }
    for (Map.Entry<Character, Integer> entry : map.entrySet()) {
        if (entry.getValue() == 1) return entry.getKey();
    }
    return '_'; // no non-repeating character
}

// Method 2: Using indexOf and lastIndexOf
public static char firstNonRepeatingV2(String str) {
    for (int i = 0; i < str.length(); i++) {
        char ch = str.charAt(i);
        if (str.indexOf(ch) == str.lastIndexOf(ch)) return ch;
    }
    return '_';
}

System.out.println(firstNonRepeating("aabcbd"));  // c
System.out.println(firstNonRepeating("aabb"));     // _
```

---

## CP4. Remove Duplicate Characters from a String (from Screenshot 3)

```java
// Method 1: LinkedHashSet (preserves order)
public static String removeDuplicates(String str) {
    Set<Character> seen = new LinkedHashSet<>();
    for (char ch : str.toCharArray()) {
        seen.add(ch);
    }
    StringBuilder sb = new StringBuilder();
    for (char ch : seen) sb.append(ch);
    return sb.toString();
}

// Method 2: Without collection
public static String removeDuplicatesManual(String str) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < str.length(); i++) {
        if (sb.indexOf(String.valueOf(str.charAt(i))) == -1) {
            sb.append(str.charAt(i));
        }
    }
    return sb.toString();
}

System.out.println(removeDuplicates("programming"));  // progamin
System.out.println(removeDuplicates("automation"));    // automin
```

---

## CP5. Count Characters / Find Duplicate Characters in a String

```java
public static Map<Character, Integer> countChars(String str) {
    Map<Character, Integer> map = new LinkedHashMap<>();
    for (char ch : str.toCharArray()) {
        map.put(ch, map.getOrDefault(ch, 0) + 1);
    }
    return map;
}

// Print only duplicates
public static void printDuplicates(String str) {
    Map<Character, Integer> map = countChars(str);
    map.forEach((ch, count) -> {
        if (count > 1) System.out.println(ch + " : " + count);
    });
}

printDuplicates("automation");
// a : 2
// t : 2
// o : 2
```

---

## CP6. String Transformation: 'My name is so and so' → '{My-name-is-so-and-so}' (from Screenshot 3)

```java
public static String transform(String str) {
    return "{" + str.replaceAll(" ", "-") + "}";
}

// More complex: CamelCase to kebab-case
public static String camelToKebab(String str) {
    return str.replaceAll("([a-z])([A-Z])", "$1-$2").toLowerCase();
}

System.out.println(transform("My name is so and so"));  // {My-name-is-so-and-so}
System.out.println(camelToKebab("myNameIsSoAndSo"));     // my-name-is-so-and-so
```

---

## CP7. Reverse Words in a String

```java
public static String reverseWords(String str) {
    String[] words = str.trim().split("\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        sb.append(words[i]);
        if (i > 0) sb.append(" ");
    }
    return sb.toString();
}

System.out.println(reverseWords("Hello World Java"));  // Java World Hello
```

---

## CP8. Check if Two Strings are Anagrams

```java
// Method 1: Sorting
public static boolean isAnagram(String s1, String s2) {
    char[] a = s1.toLowerCase().toCharArray();
    char[] b = s2.toLowerCase().toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
}

// Method 2: Character frequency
public static boolean isAnagramV2(String s1, String s2) {
    if (s1.length() != s2.length()) return false;
    int[] count = new int[256];
    for (char ch : s1.toCharArray()) count[ch]++;
    for (char ch : s2.toCharArray()) count[ch]--;
    for (int c : count) if (c != 0) return false;
    return true;
}

System.out.println(isAnagram("listen", "silent"));  // true
System.out.println(isAnagram("hello", "world"));    // false
```

---

## CP9. String Compression (Run-Length Encoding)

```java
public static String compress(String str) {
    StringBuilder sb = new StringBuilder();
    int count = 1;
    for (int i = 1; i <= str.length(); i++) {
        if (i < str.length() && str.charAt(i) == str.charAt(i - 1)) {
            count++;
        } else {
            sb.append(str.charAt(i - 1));
            if (count > 1) sb.append(count);
            count = 1;
        }
    }
    return sb.length() < str.length() ? sb.toString() : str;
}

System.out.println(compress("aabcccccaaa"));  // a2bc5a3
System.out.println(compress("abc"));           // abc (not shorter)
```

---

# NUMBER PROBLEMS

---

## CP10. Find Prime Numbers Between 1-20 (Accenture — Screenshot 1)

```java
// Method 1: Basic
public static boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

// Print primes between 1-20
public static void printPrimes(int start, int end) {
    System.out.print("Primes between " + start + " and " + end + ": ");
    for (int i = start; i <= end; i++) {
        if (isPrime(i)) System.out.print(i + " ");
    }
}

printPrimes(1, 20);
// Output: Primes between 1 and 20: 2 3 5 7 11 13 17 19

// Method 2: Sieve of Eratosthenes (for large ranges)
public static List<Integer> sieveOfEratosthenes(int limit) {
    boolean[] isComposite = new boolean[limit + 1];
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= limit; i++) {
        if (!isComposite[i]) {
            primes.add(i);
            for (int j = i * 2; j <= limit; j += i) {
                isComposite[j] = true;
            }
        }
    }
    return primes;
}

System.out.println(sieveOfEratosthenes(20));
// [2, 3, 5, 7, 11, 13, 17, 19]
```

---

## CP11. Fibonacci Series

```java
// Method 1: Iterative
public static void fibonacciIterative(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        System.out.print(a + " ");
        int temp = a + b;
        a = b;
        b = temp;
    }
}

// Method 2: Recursive
public static int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Method 3: Dynamic Programming (memoization)
public static int fibDP(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fibDP(n - 1, memo) + fibDP(n - 2, memo);
    return memo[n];
}

fibonacciIterative(10);
// 0 1 1 2 3 5 8 13 21 34
```

---

## CP12. Factorial

```java
// Iterative
public static long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

// Recursive
public static long factorialRecursive(int n) {
    if (n <= 1) return 1;
    return n * factorialRecursive(n - 1);
}

System.out.println(factorial(5));   // 120
System.out.println(factorial(10));  // 3628800
```

---

## CP13. Check Armstrong Number

```java
public static boolean isArmstrong(int n) {
    int original = n, sum = 0;
    int digits = String.valueOf(n).length();
    while (n > 0) {
        int d = n % 10;
        sum += Math.pow(d, digits);
        n /= 10;
    }
    return sum == original;
}

System.out.println(isArmstrong(153));  // true (1³+5³+3³ = 153)
System.out.println(isArmstrong(370));  // true
System.out.println(isArmstrong(123));  // false
```

---

## CP14. Reverse a Number / Check Palindrome Number

```java
public static int reverseNumber(int n) {
    int reversed = 0;
    while (n != 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return reversed;
}

public static boolean isPalindromeNumber(int n) {
    return n == reverseNumber(n);
}

System.out.println(reverseNumber(12345));      // 54321
System.out.println(isPalindromeNumber(121));    // true
System.out.println(isPalindromeNumber(123));    // false
```

---

## CP15. Swap Two Numbers Without Temp Variable

```java
// Method 1: Arithmetic
int a = 5, b = 10;
a = a + b;  // a = 15
b = a - b;  // b = 5
a = a - b;  // a = 10

// Method 2: XOR
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

---

## CP16. FizzBuzz (Classic — still asked in 2026)

```java
public static void fizzBuzz(int n) {
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) System.out.println("FizzBuzz");
        else if (i % 3 == 0) System.out.println("Fizz");
        else if (i % 5 == 0) System.out.println("Buzz");
        else System.out.println(i);
    }
}

fizzBuzz(15);
// 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
```

---

# ARRAY PROBLEMS

---

## CP17. Find Second Largest Element

```java
public static int secondLargest(int[] arr) {
    int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
    for (int num : arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;
        }
    }
    return second;
}

System.out.println(secondLargest(new int[]{10, 5, 20, 8, 20}));  // 10
```

---

## CP18. Two Sum — Find Two Numbers That Add Up to Target

```java
// HashMap approach — O(n) time, O(n) space
public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
System.out.println(Arrays.toString(result));  // [0, 1]
```

---

## CP19. Remove Duplicates from Array

```java
// Method 1: Using Set
public static int[] removeDuplicates(int[] arr) {
    return Arrays.stream(arr).distinct().toArray();
}

// Method 2: Sorted array — in-place
public static int removeDupsSorted(int[] arr) {
    if (arr.length == 0) return 0;
    int j = 0;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] != arr[j]) {
            j++;
            arr[j] = arr[i];
        }
    }
    return j + 1; // new length
}

System.out.println(Arrays.toString(removeDuplicates(new int[]{1, 2, 2, 3, 3, 4})));
// [1, 2, 3, 4]
```

---

## CP20. Find Missing Number in Array (1 to N)

```java
public static int findMissing(int[] arr, int n) {
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    for (int num : arr) actualSum += num;
    return expectedSum - actualSum;
}

// XOR approach (avoids overflow)
public static int findMissingXOR(int[] arr, int n) {
    int xor = 0;
    for (int i = 1; i <= n; i++) xor ^= i;
    for (int num : arr) xor ^= num;
    return xor;
}

System.out.println(findMissing(new int[]{1, 2, 4, 5, 6}, 6));  // 3
```

---

## CP21. Move Zeros to End

```java
public static void moveZeros(int[] arr) {
    int pos = 0;
    for (int num : arr) {
        if (num != 0) arr[pos++] = num;
    }
    while (pos < arr.length) arr[pos++] = 0;
}

int[] arr = {0, 1, 0, 3, 12};
moveZeros(arr);
System.out.println(Arrays.toString(arr));  // [1, 3, 12, 0, 0]
```

---

## CP22. Sort Array Without sort() — Bubble Sort (from Screenshot 3)

```java
// Bubble Sort — O(n²)
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break; // optimization: already sorted
    }
}

// Selection Sort — O(n²)
public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}

// Insertion Sort — O(n²) but fastest for small/nearly sorted
public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int[] arr = {64, 34, 25, 12, 22, 11, 90};
bubbleSort(arr);
System.out.println(Arrays.toString(arr));  // [11, 12, 22, 25, 34, 64, 90]
```

**Sorting Comparison:**
| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

---

## CP23. Merge Two Sorted Arrays

```java
public static int[] mergeSorted(int[] a, int[] b) {
    int[] result = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) result[k++] = a[i++];
        else result[k++] = b[j++];
    }
    while (i < a.length) result[k++] = a[i++];
    while (j < b.length) result[k++] = b[j++];
    return result;
}

System.out.println(Arrays.toString(mergeSorted(new int[]{1, 3, 5}, new int[]{2, 4, 6})));
// [1, 2, 3, 4, 5, 6]
```

---

## CP24. Maximum Subarray Sum (Kadane's Algorithm)

```java
public static int maxSubarraySum(int[] arr) {
    int maxSum = arr[0], currentSum = arr[0];
    for (int i = 1; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}

System.out.println(maxSubarraySum(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));  // 6
```

---

## CP25. Binary Search

```java
// Iterative
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // not found
}

// Recursive
public static int binarySearchRecursive(int[] arr, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
    else return binarySearchRecursive(arr, target, left, mid - 1);
}

System.out.println(binarySearch(new int[]{1, 3, 5, 7, 9, 11}, 7));  // 3
```

---

# SELENIUM CODING PROBLEMS (from Screenshots)

---

## CP26. Write Selenium Script to Search Flight from Mumbai to Delhi (Accenture — Screenshot 1)

```java
@Test
public void searchFlight() {
    WebDriver driver = new ChromeDriver();
    driver.manage().window().maximize();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

    try {
        // Navigate to a flight booking site (example: MakeMyTrip)
        driver.get("https://www.makemytrip.com/flights/");

        // Close any popup
        try {
            WebElement closePopup = new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector("span.commonModal__close")));
            closePopup.click();
        } catch (TimeoutException e) { /* no popup */ }

        // Select From city
        WebElement fromCity = driver.findElement(By.id("fromCity"));
        fromCity.click();
        WebElement fromInput = new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='From']")));
        fromInput.sendKeys("Mumbai");
        new WebDriverWait(driver, Duration.ofSeconds(5))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//ul[@role='listbox']//li[1]")))
            .click();

        // Select To city
        WebElement toInput = new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='To']")));
        toInput.sendKeys("Delhi");
        new WebDriverWait(driver, Duration.ofSeconds(5))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//ul[@role='listbox']//li[1]")))
            .click();

        // Select date (click on a future date)
        WebElement dateField = driver.findElement(By.xpath("//span[contains(@class,'dateText')]"));
        dateField.click();
        WebElement futureDate = driver.findElement(By.xpath("//div[@class='DayPicker-Day' and @aria-disabled='false'][1]"));
        futureDate.click();

        // Click Search
        WebElement searchBtn = driver.findElement(By.xpath("//a[contains(text(),'Search')]"));
        searchBtn.click();

        // Wait for results
        new WebDriverWait(driver, Duration.ofSeconds(15))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(@class,'flightsList')]")));

        // Validate results loaded
        List<WebElement> flights = driver.findElements(By.xpath("//div[contains(@class,'listingCard')]"));
        Assert.assertTrue(flights.size() > 0, "No flights found!");
        System.out.println("Total flights found: " + flights.size());

    } finally {
        driver.quit();
    }
}
```

---

## CP27. Fetch All Links from a Page and Check for Broken Links (from Screenshot 3)

```java
@Test
public void checkBrokenLinks() throws IOException {
    WebDriver driver = new ChromeDriver();
    driver.get("https://www.example.com");

    List<WebElement> links = driver.findElements(By.tagName("a"));
    System.out.println("Total links found: " + links.size());

    int brokenCount = 0;
    for (WebElement link : links) {
        String url = link.getAttribute("href");
        if (url == null || url.isEmpty() || url.startsWith("javascript")) continue;

        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("HEAD");
            conn.setConnectTimeout(5000);
            conn.connect();

            int statusCode = conn.getResponseCode();
            if (statusCode >= 400) {
                System.out.println("BROKEN: " + url + " → Status: " + statusCode);
                brokenCount++;
            } else {
                System.out.println("OK: " + url + " → Status: " + statusCode);
            }
        } catch (Exception e) {
            System.out.println("ERROR: " + url + " → " + e.getMessage());
            brokenCount++;
        }
    }

    System.out.println("Broken links: " + brokenCount + " / " + links.size());
    driver.quit();
}
```

---

## CP28. Write XPath for Common Scenarios (from Screenshot 3 — very frequently asked)

```java
// 1. Basic XPath types
// Absolute XPath (fragile — avoid)
/html/body/div[1]/form/input[2]

// Relative XPath (preferred)
//input[@id='username']

// 2. XPath Axes
//div[@class='form']//input                    // descendant
//input[@id='submit']/..                        // parent
//label[@for='email']/following-sibling::input  // following-sibling
//input[@id='password']/preceding-sibling::label // preceding-sibling
//div[@id='content']/ancestor::body             // ancestor
//div[@class='menu']/child::a                   // child

// 3. XPath Functions
//input[contains(@class, 'btn-primary')]        // contains
//button[starts-with(@id, 'submit')]            // starts-with
//a[text()='Login']                             // exact text
//a[contains(text(), 'Sign')]                   // partial text
//input[normalize-space(@value)='Submit']       // normalize-space
//div[not(@class='hidden')]                     // not

// 4. Dynamic XPath (for changing elements)
//input[@type='text' and @name='email']         // multiple attributes
(//div[@class='card'])[3]                       // index-based
//table//tr[last()]                             // last element
//ul/li[position()>2]                           // position-based

// 5. XPath for tables
//table[@id='data']//tr[3]/td[2]               // specific cell
//table//tr[td[text()='Vikrant']]/td[3]        // cell based on another cell value

// 6. SVG elements
//*[local-name()='svg']//*[local-name()='path']

// Interview tip: Always prefer CSS > XPath for speed.
// Use XPath only when you need text-based or ancestor/sibling traversal.
```

---

# COLLECTIONS & DATA STRUCTURE PROBLEMS

---

## CP29. HashMap — Count Word Frequency

```java
public static Map<String, Integer> wordFrequency(String sentence) {
    Map<String, Integer> map = new LinkedHashMap<>();
    for (String word : sentence.toLowerCase().split("\\s+")) {
        map.put(word, map.getOrDefault(word, 0) + 1);
    }
    return map;
}

System.out.println(wordFrequency("the cat sat on the mat the cat"));
// {the=3, cat=2, sat=1, on=1, mat=1}
```

---

## CP30. Find Intersection of Two Arrays

```java
public static int[] intersection(int[] a, int[] b) {
    Set<Integer> setA = new HashSet<>();
    for (int num : a) setA.add(num);
    Set<Integer> result = new LinkedHashSet<>();
    for (int num : b) {
        if (setA.contains(num)) result.add(num);
    }
    return result.stream().mapToInt(i -> i).toArray();
}

System.out.println(Arrays.toString(intersection(
    new int[]{1, 2, 3, 4, 5}, new int[]{3, 4, 5, 6, 7}
)));  // [3, 4, 5]
```

---

## CP31. Sort a HashMap by Value

```java
public static LinkedHashMap<String, Integer> sortByValue(Map<String, Integer> map) {
    return map.entrySet().stream()
        .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
        .collect(Collectors.toMap(
            Map.Entry::getKey, Map.Entry::getValue,
            (e1, e2) -> e1, LinkedHashMap::new
        ));
}

Map<String, Integer> scores = Map.of("Alice", 90, "Bob", 75, "Charlie", 95);
System.out.println(sortByValue(new HashMap<>(scores)));
// {Charlie=95, Alice=90, Bob=75}
```

---

## CP32. Implement Stack Using Array

```java
class Stack {
    private int[] arr;
    private int top = -1;

    Stack(int size) { arr = new int[size]; }

    void push(int val) {
        if (top == arr.length - 1) throw new RuntimeException("Stack Overflow");
        arr[++top] = val;
    }

    int pop() {
        if (top == -1) throw new RuntimeException("Stack Underflow");
        return arr[top--];
    }

    int peek() {
        if (top == -1) throw new RuntimeException("Stack Empty");
        return arr[top];
    }

    boolean isEmpty() { return top == -1; }
}
```

---

## CP33. Check Balanced Parentheses

```java
public static boolean isBalanced(String str) {
    java.util.Stack<Character> stack = new java.util.Stack<>();
    Map<Character, Character> map = Map.of(')', '(', '}', '{', ']', '[');

    for (char ch : str.toCharArray()) {
        if (map.containsValue(ch)) {
            stack.push(ch);
        } else if (map.containsKey(ch)) {
            if (stack.isEmpty() || stack.pop() != map.get(ch)) return false;
        }
    }
    return stack.isEmpty();
}

System.out.println(isBalanced("{[()]}")); // true
System.out.println(isBalanced("{[(])}")); // false
System.out.println(isBalanced("(("));     // false
```

---

# PATTERN PRINTING (still asked at Accenture, TCS, Infosys)

---

## CP34. Common Patterns

```java
// 1. Right Triangle
// *
// * *
// * * *
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) System.out.print("* ");
    System.out.println();
}

// 2. Number Triangle
// 1
// 1 2
// 1 2 3
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) System.out.print(j + " ");
    System.out.println();
}

// 3. Pyramid
//     *
//    * *
//   * * *
//  * * * *
// * * * * *
for (int i = 1; i <= 5; i++) {
    for (int j = 5; j > i; j--) System.out.print(" ");
    for (int j = 1; j <= i; j++) System.out.print("* ");
    System.out.println();
}

// 4. Inverted Triangle
// * * * * *
// * * * *
// * * *
// * *
// *
for (int i = 5; i >= 1; i--) {
    for (int j = 1; j <= i; j++) System.out.print("* ");
    System.out.println();
}

// 5. Diamond
//     *
//    * *
//   * * *
//  * * * *
// * * * * *
//  * * * *
//   * * *
//    * *
//     *
int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = n; j > i; j--) System.out.print(" ");
    for (int j = 1; j <= i; j++) System.out.print("* ");
    System.out.println();
}
for (int i = n - 1; i >= 1; i--) {
    for (int j = n; j > i; j--) System.out.print(" ");
    for (int j = 1; j <= i; j++) System.out.print("* ");
    System.out.println();
}
```

---

# FREQUENTLY ASKED IN 2026 INTERVIEWS — BONUS

---

## CP35. Find All Permutations of a String

```java
public static List<String> permutations(String str) {
    List<String> result = new ArrayList<>();
    permute(str.toCharArray(), 0, result);
    return result;
}

private static void permute(char[] arr, int index, List<String> result) {
    if (index == arr.length - 1) {
        result.add(new String(arr));
        return;
    }
    for (int i = index; i < arr.length; i++) {
        char temp = arr[index]; arr[index] = arr[i]; arr[i] = temp; // swap
        permute(arr, index + 1, result);
        temp = arr[index]; arr[index] = arr[i]; arr[i] = temp;     // backtrack
    }
}

System.out.println(permutations("abc"));
// [abc, acb, bac, bca, cba, cab]
```

---

## CP36. Longest Substring Without Repeating Characters

```java
public static int longestUniqueSubstring(String str) {
    Map<Character, Integer> map = new HashMap<>();
    int maxLen = 0, start = 0;
    for (int end = 0; end < str.length(); end++) {
        char ch = str.charAt(end);
        if (map.containsKey(ch)) {
            start = Math.max(start, map.get(ch) + 1);
        }
        map.put(ch, end);
        maxLen = Math.max(maxLen, end - start + 1);
    }
    return maxLen;
}

System.out.println(longestUniqueSubstring("abcabcbb"));  // 3 ("abc")
System.out.println(longestUniqueSubstring("pwwkew"));     // 3 ("wke")
```

---

## CP37. Producer-Consumer Problem (Multithreading — asked at senior level)

```java
class SharedBuffer {
    private Queue<Integer> buffer = new LinkedList<>();
    private int capacity;

    SharedBuffer(int capacity) { this.capacity = capacity; }

    synchronized void produce(int item) throws InterruptedException {
        while (buffer.size() == capacity) wait();
        buffer.add(item);
        System.out.println("Produced: " + item);
        notifyAll();
    }

    synchronized int consume() throws InterruptedException {
        while (buffer.isEmpty()) wait();
        int item = buffer.poll();
        System.out.println("Consumed: " + item);
        notifyAll();
        return item;
    }
}
```

---

## CP38. Read Data from Properties/Excel File (Framework coding question)

```java
// Read from properties file
public static String getProperty(String key) {
    Properties props = new Properties();
    try (FileInputStream fis = new FileInputStream("config.properties")) {
        props.load(fis);
    } catch (IOException e) {
        e.printStackTrace();
    }
    return props.getProperty(key);
}

// Read from Excel using Apache POI
public static String[][] readExcel(String filePath, String sheetName) throws IOException {
    FileInputStream fis = new FileInputStream(filePath);
    Workbook workbook = new XSSFWorkbook(fis);
    Sheet sheet = workbook.getSheet(sheetName);

    int rows = sheet.getPhysicalNumberOfRows();
    int cols = sheet.getRow(0).getPhysicalNumberOfCells();
    String[][] data = new String[rows][cols];

    for (int i = 0; i < rows; i++) {
        Row row = sheet.getRow(i);
        for (int j = 0; j < cols; j++) {
            Cell cell = row.getCell(j);
            data[i][j] = cell != null ? cell.toString() : "";
        }
    }
    workbook.close();
    return data;
}
```
