# Selenium, TestNG, Jenkins Interview Questions
## Vikrant Mishra — SDET Interview Prep

> **Note:** Selenium + TestNG is your core skill. These questions will be asked in almost every interview. Know the code examples by heart — interviewers often ask you to write them on a whiteboard or in a shared editor.

---

# SELENIUM WEBDRIVER

---

## Q1. Types of Waits in WebDriver?

**Simple Answer:**
WebDriver needs to wait for pages and elements to load. There are 3 types: Implicit (global timer for all elements), Explicit (wait for a specific condition on a specific element — this is the BEST one), and Fluent (custom polling interval). Never use Thread.sleep() — it is hard-coded delay and considered bad practice.

**💬 How to say it in an interview:**
> "In my framework, I always use Explicit Wait with ExpectedConditions. Implicit wait is set globally and can interfere with Explicit wait — so I avoid mixing them. Thread.sleep() is something I never use in production code because it wastes time when the element loads faster. For very tricky elements — like one that appears and disappears rapidly — I use FluentWait with a custom polling interval of 500ms."

**⚡ Key Points:**
- Explicit Wait = BEST practice, use for all dynamic elements
- Implicit Wait = set once, global, don't mix with Explicit
- FluentWait = Explicit + custom polling + ignore specific exceptions
- Thread.sleep() = NEVER use in production code

| Wait Type | Description | When to Use |
|-----------|-------------|-------------|
| **Implicit Wait** | Global wait for all `findElement` calls. Polls DOM for specified time before throwing `NoSuchElementException` | Set once at start; NOT recommended to mix with Explicit |
| **Explicit Wait** | Waits for a **specific condition** on a **specific element** | **PREFERRED** — use for all dynamic elements |
| **Fluent Wait** | Like Explicit but with **custom polling interval** and **exception ignoring** | Complex scenarios, intermittent elements |
| **Thread.sleep()** | Static hard wait — **BAD practice** | **NEVER use** in production frameworks |

```java
// Explicit Wait (PREFERRED)
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));

// Common ExpectedConditions:
wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
wait.until(ExpectedConditions.presenceOfElementLocated(locator));
wait.until(ExpectedConditions.elementToBeClickable(locator));
wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
wait.until(ExpectedConditions.titleContains("Dashboard"));
wait.until(ExpectedConditions.urlContains("/home"));
wait.until(ExpectedConditions.alertIsPresent());
wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(locator));

// Fluent Wait
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class)
    .ignoring(StaleElementReferenceException.class);

WebElement el = fluentWait.until(d -> d.findElement(By.id("dynamic-element")));
```

---

## Q2. How to handle frames?

**Simple Answer:**
A frame (or iframe) is a webpage inside another webpage. Selenium by default can only interact with the main page. You must first "switch" to the frame, do your actions, then switch back to the main page.

**💬 How to say it in an interview:**
> "Frames are a very common challenge in Selenium automation. At Office Depot, some advertisement and third-party widgets were embedded inside iframes. I always try to switch by the iframe's WebElement first — it's the most reliable method. After interacting inside the frame, I always call defaultContent() to switch back to the main page, or else subsequent element searches will fail."

```java
// Switch by name or ID
driver.switchTo().frame("frameName");

// Switch by index (0-based)
driver.switchTo().frame(0);

// Switch by WebElement
WebElement iframe = driver.findElement(By.cssSelector("iframe.content-frame"));
driver.switchTo().frame(iframe);

// Switch back to main page
driver.switchTo().defaultContent();

// Switch to parent frame (for nested frames)
driver.switchTo().parentFrame();

// Nested frames example:
// Main Page → outerFrame → innerFrame
driver.switchTo().frame("outerFrame");    // now in outer
driver.switchTo().frame("innerFrame");    // now in inner
// ... interact with inner frame elements
driver.switchTo().parentFrame();          // back to outer
driver.switchTo().defaultContent();       // back to main
```

---

## Q3. How to send text to a focused element?

**Simple Answer:**
Normally use `sendKeys()` on the element directly. Use `Actions.sendKeys()` when an element already has focus (like after clicking into a field). Use JavaScriptExecutor when the element is hidden or blocked by an overlay.

**⚡ Key Points:**
- `element.sendKeys()` = normal, everyday input
- `new Actions(driver).sendKeys()` = sends keys to whatever currently has keyboard focus
- `js.executeScript("arguments[0].value='text'")` = bypass Selenium and set value directly in the DOM

```java
// Method 1: sendKeys on element
driver.findElement(By.id("search")).sendKeys("test query");

// Method 2: Actions class (for focused element)
new Actions(driver).sendKeys("some text").perform();

// Method 3: JavaScript (when element is hidden/blocked)
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].value='test text';", element);

// Method 4: Clear and type
WebElement field = driver.findElement(By.id("email"));
field.clear();
field.sendKeys("vikrant@test.com");

// Method 5: Key combinations
element.sendKeys(Keys.CONTROL + "a");  // select all
element.sendKeys(Keys.DELETE);          // delete
element.sendKeys("new text");           // type new
```

---

## Q4. What is StaleElementReferenceException?

**Simple Answer:**
This happens when you find an element, but before you interact with it, the page refreshes (due to AJAX, navigation, or a JavaScript update) and the element reference becomes invalid. The fix is to find the element again.

**Cause:** The element was found in the DOM but by the time you interact with it, the DOM has been refreshed/modified (e.g., AJAX update, page reload, SPA navigation). The reference is now "stale".

**💬 How to say it in an interview:**
> "StaleElementReferenceException is one of the most common Selenium exceptions, especially on modern React or Angular applications where the DOM updates dynamically. At PersonifyHealth, our React app would re-render components after API calls, invalidating my element references. My solution was a retry wrapper — try to interact, if StaleElement exception occurs, re-find the element and try again up to 3 times. I also use ExpectedConditions.refreshed() from WebDriverWait which handles this automatically."

**⚡ Key Points:**
- Cause: DOM was refreshed after element was found
- Fix 1: Re-find the element before interacting
- Fix 2: Use ExpectedConditions.refreshed() in WebDriverWait
- Fix 3: Avoid @CacheLookup on dynamic elements in Page Factory

**Solutions:**
```java
// Solution 1: Re-find the element
public void safeClick(By locator) {
    for (int i = 0; i < 3; i++) {
        try {
            driver.findElement(locator).click();
            return;
        } catch (StaleElementReferenceException e) {
            // DOM refreshed, retry
        }
    }
    throw new RuntimeException("Element still stale after 3 retries");
}

// Solution 2: Use Explicit Wait with refreshed condition
wait.until(ExpectedConditions.refreshed(
    ExpectedConditions.elementToBeClickable(locator)
));

// Solution 3: Avoid @CacheLookup on dynamic elements (Page Factory)
// @CacheLookup caches the element reference — don't use on elements that refresh

// Solution 4: Use JavaScript click
js.executeScript("arguments[0].click();", driver.findElement(locator));
```

---

## Q5. Components of Selenium Suite?

**Simple Answer:**
Selenium is not just one tool — it is a suite of 4 components. The main one you use daily is Selenium WebDriver. Selenium Grid is used for parallel execution across multiple browsers.

**💬 How to say it in an interview:**
> "Selenium Suite has 4 components. Selenium IDE is a browser extension for record-and-playback — good for demos but not for real frameworks. Selenium RC is deprecated. Selenium WebDriver is what I use daily — it directly communicates with the browser driver. And Selenium Grid is what I use for parallel execution — at Office Depot, I ran tests simultaneously on Chrome and Firefox using Grid, which cut our regression time in half."

| Component | Description |
|-----------|-------------|
| **Selenium IDE** | Browser extension for **record and playback**. Generates test scripts automatically. Good for beginners/prototyping. |
| **Selenium RC** (deprecated) | Remote Control — allowed writing tests in any language. **Replaced by WebDriver**. Uses JavaScript injection. |
| **Selenium WebDriver** | Core component. Directly communicates with browser via **browser-specific drivers**. Supports Java, Python, C#, JS, Ruby. |
| **Selenium Grid** | Enables **parallel execution** across multiple machines, browsers, and OS. Hub-Node architecture. |

**Selenium 4 additions:**
- W3C WebDriver Protocol (standardized)
- Relative locators (`above`, `below`, `near`, `toLeftOf`, `toRightOf`)
- Chrome DevTools Protocol (CDP) support
- Better Selenium Grid with Docker support
- New `newWindow()` method for tabs/windows

---

## Q6. What is a Locator?

**Simple Answer:**
A locator is how Selenium finds an element on a webpage. There are 8 types. The order of preference: ID first (fastest, most unique), then CSS Selector, then XPath (slowest, most flexible). Always prefer CSS over XPath except when you need text-based matching or need to traverse up to a parent element.

**💬 How to say it in an interview:**
> "I follow a clear locator strategy. ID is my first choice — it's unique and fastest. When ID is not available, I use CSS Selectors — they're faster than XPath and cleaner to read. I only use XPath when I need to match by text content, like finding a button with specific text, or when I need to navigate to a parent element — which CSS cannot do. I always avoid absolute XPath like /html/body/div[1] — it breaks if any element above changes."

**Locator strategies (in order of preference):**

| Priority | Locator | Syntax | When to Use |
|----------|---------|--------|-------------|
| 1 | **ID** | `By.id("submit")` | Best — fastest, unique |
| 2 | **Name** | `By.name("username")` | Good if unique |
| 3 | **CSS Selector** | `By.cssSelector(".btn-primary")` | **Preferred** — fast, readable |
| 4 | **XPath** | `By.xpath("//input[@id='email']")` | Flexible, slower, use when CSS fails |
| 5 | **Link Text** | `By.linkText("Sign Up")` | Only for `<a>` tags |
| 6 | **Partial Link Text** | `By.partialLinkText("Sign")` | Partial match on links |
| 7 | **Tag Name** | `By.tagName("h1")` | Rarely unique |
| 8 | **Class Name** | `By.className("error-msg")` | Often not unique |

**CSS vs XPath:**
| Aspect | CSS Selector | XPath |
|--------|-------------|-------|
| Speed | **Faster** | Slower |
| Readability | Cleaner syntax | Verbose |
| Traverse UP | **Cannot** | Can (using `..` or `parent::`) |
| Text matching | **Cannot** | Can (`text()`, `contains(text(), 'x')`) |
| Index | `:nth-child(2)` | `[2]` |
| Direction | Forward only | Forward and backward |

```java
// CSS Examples
By.cssSelector("#username")              // by ID
By.cssSelector(".btn-primary")           // by class
By.cssSelector("input[type='submit']")   // by attribute
By.cssSelector("div.container > p")      // direct child
By.cssSelector("div.container p")        // any descendant
By.cssSelector("[id^='user']")           // starts with
By.cssSelector("[id$='name']")           // ends with
By.cssSelector("[id*='ser']")            // contains

// XPath Examples
By.xpath("//input[@id='username']")             // by attribute
By.xpath("//button[text()='Login']")            // by exact text
By.xpath("//button[contains(text(),'Log')]")    // contains text
By.xpath("//div[@class='form']//input")         // descendant
By.xpath("//input[@id='user']/parent::div")     // parent (CSS can't do this)
By.xpath("(//input[@type='text'])[2]")          // index
By.xpath("//input[@id='user' and @type='text']") // multiple conditions
```

---

## Q7. Assertions?

**Simple Answer:**
- **Hard Assert** = if it fails, the test stops immediately (like a normal assert)
- **Soft Assert** = if it fails, the test CONTINUES, collects all failures, and reports everything at the end
- Use Hard Assert for critical checkpoints (like login success). Use Soft Assert when you want to validate multiple things on the same page in one test run.

**💬 How to say it in an interview:**
> "I use both Hard and Soft assertions strategically. Hard Assert is for critical checkpoints — like if the login fails, there's no point continuing the test. Soft Assert is for page-level validations — for example, after navigating to the dashboard, I want to verify the title, the welcome message, the user name, and the navigation links all in one test. With Soft Assert, if the title is wrong but everything else is fine, I see ALL failures in one report rather than stopping at the first one. The key thing people forget: you MUST call softAssert.assertAll() at the end, otherwise failures are silently ignored."

**⚡ Key Points:**
- Hard Assert: stops test on first failure; use for critical steps
- Soft Assert: continues after failure, reports all at end; use for multiple validations
- ALWAYS call `soft.assertAll()` at the end — without it, failures are lost

```java
// Hard Assertions (TestNG) — stops test on first failure
Assert.assertEquals(actual, expected, "Title mismatch");
Assert.assertTrue(condition, "Element not visible");
Assert.assertFalse(condition, "Error message displayed");
Assert.assertNotNull(object, "Object is null");

// Soft Assertions — collects all failures, reports at end
SoftAssert soft = new SoftAssert();
soft.assertEquals(driver.getTitle(), "Dashboard", "Title wrong");
soft.assertTrue(logo.isDisplayed(), "Logo missing");
soft.assertEquals(username.getText(), "Vikrant", "Name wrong");
soft.assertAll();  // MUST call — reports all failures together

// JUnit Assertions
assertEquals("Dashboard", driver.getTitle());
assertTrue(element.isDisplayed());
assertThrows(NoSuchElementException.class, () -> driver.findElement(By.id("missing")));
```

**Hard vs Soft Assert:**
| Aspect | Hard Assert | Soft Assert |
|--------|------------|-------------|
| On failure | Test **stops immediately** | Test **continues** |
| Use case | Critical validations (login success) | Multiple validations on one page |
| Report | Shows first failure only | Shows **all** failures |

---

## Q8. findElement vs findElements?

**Simple Answer:**
- `findElement()` finds ONE element. If not found, throws `NoSuchElementException`.
- `findElements()` finds ALL matching elements. If none found, returns an EMPTY LIST (no exception).
- Use `findElements().size() > 0` as the safest way to check if an element exists.

**💬 How to say it in an interview:**
> "The key difference is how they handle the 'element not found' case. findElement throws an exception if nothing is found — which is what you want for critical elements. findElements returns an empty list, which is useful when you want to check if something exists without crashing the test. For example, I use findElements to check if an error message appeared — if the list is empty, no error showed; if it has items, I can get the text and verify it."

| Aspect | `findElement()` | `findElements()` |
|--------|----------------|-------------------|
| Returns | **Single** WebElement | **List<WebElement>** |
| Not found | Throws `NoSuchElementException` | Returns **empty list** (no exception) |
| Multiple matches | Returns **first** match | Returns **all** matches |
| Use case | Interact with one element | Count elements, iterate, check existence |

```java
// findElement — throws exception if not found
WebElement btn = driver.findElement(By.id("submit"));

// findElements — returns empty list if not found (NO exception)
List<WebElement> items = driver.findElements(By.className("product-card"));
System.out.println("Products found: " + items.size());

// Check if element exists without exception
boolean exists = driver.findElements(By.id("error-msg")).size() > 0;
```

---

## Q9. getWindowHandle() vs getWindowHandles()?

**Simple Answer:**
- `getWindowHandle()` = returns the ID of the CURRENT window (one string)
- `getWindowHandles()` = returns the IDs of ALL open windows/tabs (a set of strings)
- Pattern: save current window ID → click link that opens new tab → loop through all windows → switch to the one that is NOT the original → do work → close it → switch back

**💬 How to say it in an interview:**
> "Switching windows is something I handle regularly. The pattern I always follow: first save the current window handle using getWindowHandle(). Then after clicking the link that opens a new window, I call getWindowHandles() to get all windows, iterate through them, and switch to the one that doesn't match my saved handle. At Office Depot, clicking 'View Product Details' opened a new tab — I handled this exact pattern."

| Aspect | `getWindowHandle()` | `getWindowHandles()` |
|--------|---------------------|----------------------|
| Returns | **String** — single window ID | **Set<String>** — all window IDs |
| Scope | Current window only | All open windows/tabs |
| Use case | Store current window before switching | Iterate to find and switch to new window |

```java
// Store current window
String mainWindow = driver.getWindowHandle();

// Click link that opens new tab/window
driver.findElement(By.id("newWindow")).click();

// Get all windows
Set<String> allWindows = driver.getWindowHandles();

// Switch to new window
for (String handle : allWindows) {
    if (!handle.equals(mainWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

// Do work in new window
System.out.println("New window title: " + driver.getTitle());

// Close new window and switch back
driver.close();
driver.switchTo().window(mainWindow);
```

---

## Q10. How to handle alerts?

**Simple Answer:**
A JavaScript alert is a popup box that appears over the page. Selenium cannot interact with it using normal element methods. You must use `driver.switchTo().alert()` to get the Alert object, then call `accept()` (OK), `dismiss()` (Cancel), or `sendKeys()` (for prompt dialogs).

**💬 How to say it in an interview:**
> "Alerts come in 3 types: simple alert (just an OK button), confirm dialog (OK and Cancel), and prompt (with a text input field). I always wait for the alert first using ExpectedConditions.alertIsPresent(), then switch to it and handle it. I've seen tests fail because they tried to switch to the alert too early before it appeared."

```java
// Switch to alert
Alert alert = driver.switchTo().alert();

// Get alert text
String alertText = alert.getText();

// Accept (OK)
alert.accept();

// Dismiss (Cancel)
alert.dismiss();

// Type in prompt alert
alert.sendKeys("Vikrant");
alert.accept();

// Wait for alert
wait.until(ExpectedConditions.alertIsPresent());
```

---

## Q11. How to handle dropdowns?

**Simple Answer:**
For standard HTML `<select>` dropdowns, use Selenium's `Select` class — it has built-in methods like selectByVisibleText and selectByValue. For custom dropdowns (Bootstrap, Material UI) that are NOT `<select>` tags, you must click the dropdown to open it and then click the option.

**💬 How to say it in an interview:**
> "There are two types of dropdowns in modern web apps. Standard HTML select elements work perfectly with Selenium's Select class — I can select by visible text, value, or index. But most modern apps use custom dropdowns built with divs and lists, like Bootstrap dropdowns. For those, the Select class doesn't work. I click the dropdown button to open it, wait for the options to appear, then click the required option by XPath or CSS. At Office Depot, the product category filter was a custom dropdown — I handled it this way."

**⚡ Key Points:**
- `<select>` tag → use Select class (selectByVisibleText, selectByValue, selectByIndex)
- Custom dropdown (div/ul) → click to open + click option
- Always verify the selection was applied by calling getFirstSelectedOption().getText()

```java
// Using Select class (for <select> elements only)
WebElement dropdown = driver.findElement(By.id("country"));
Select select = new Select(dropdown);

// Three ways to select
select.selectByValue("IN");                  // by value attribute
select.selectByVisibleText("India");         // by display text
select.selectByIndex(2);                     // by position (0-based)

// Get selected option
String selected = select.getFirstSelectedOption().getText();

// Get all options
List<WebElement> options = select.getOptions();
for (WebElement opt : options) {
    System.out.println(opt.getText());
}

// Check if multi-select
boolean isMulti = select.isMultiple();

// Deselect (only for multi-select)
select.deselectAll();
select.deselectByValue("US");

// For non-<select> custom dropdowns (Bootstrap, Material UI):
driver.findElement(By.cssSelector(".dropdown-toggle")).click();  // open
driver.findElement(By.xpath("//li[text()='India']")).click();    // select option
```

---

## Q12. How to perform drag and drop?

**Simple Answer:**
Use the `Actions` class with `dragAndDrop(source, target)`. If that doesn't work (it sometimes doesn't in modern browsers), use the `clickAndHold → moveToElement → release` method. As a last resort, use a JavaScript-based approach.

**💬 How to say it in an interview:**
> "Drag and drop can be tricky in Selenium. The simple Actions.dragAndDrop() method works in most cases, but in some modern HTML5 drag-and-drop implementations, it fails. I use the manual approach — clickAndHold the source, moveToElement the target, then release. If even that fails, I use a JavaScript drag-and-drop script. The key is to always verify the result after — that the element is actually in the new position."

```java
WebElement source = driver.findElement(By.id("draggable"));
WebElement target = driver.findElement(By.id("droppable"));

// Method 1: dragAndDrop (simple)
Actions actions = new Actions(driver);
actions.dragAndDrop(source, target).perform();

// Method 2: clickAndHold + moveToElement + release (more reliable)
actions.clickAndHold(source)
       .moveToElement(target)
       .release()
       .perform();

// Method 3: JavaScript (when Actions class fails)
String js = "function dnd(s,t){var e=document.createEvent('MouseEvent');" +
            "e.initMouseEvent('mousedown',true,true,window,0,0,0,s.getBoundingClientRect().x," +
            "s.getBoundingClientRect().y,false,false,false,false,0,null);" +
            "s.dispatchEvent(e);}dnd(arguments[0],arguments[1]);";
((JavascriptExecutor) driver).executeScript(js, source, target);
```

---

## Q13. How to take screenshots?

**Simple Answer:**
Selenium can capture screenshots using `TakesScreenshot`. The most important use is capturing a screenshot automatically when a test FAILS — so you can see exactly what the page looked like at the moment of failure. This is done via a TestNG Listener.

**💬 How to say it in an interview:**
> "In my framework, screenshots are automatically captured on test failure using a TestNG ITestListener. In the onTestFailure method, I capture the screenshot and attach it to the Extent Report. This is critical for debugging CI/CD failures — when a test fails in Jenkins at 2am, the screenshot is the first thing the developer looks at in the report. Selenium 4 also added element-level screenshots, which is very useful for highlighting exactly which element caused the failure."

**⚡ Key Points:**
- Always use TakesScreenshot, not third-party tools
- Attach screenshots to reports (Extent Reports, Allure) not just save to disk
- Capture on failure via TestNG ITestListener.onTestFailure()
- Selenium 4: can capture element-level screenshots too

```java
// Full page screenshot
File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
FileUtils.copyFile(src, new File("screenshots/page.png"));

// As Base64 string (for reports)
String base64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);

// As byte array (for Allure)
byte[] bytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
Allure.addAttachment("Screenshot", new ByteArrayInputStream(bytes));

// Element screenshot (Selenium 4)
WebElement element = driver.findElement(By.id("chart"));
element.getScreenshotAs(OutputType.FILE);

// In TestNG Listener (auto-capture on failure)
public class TestListener implements ITestListener {
    @Override
    public void onTestFailure(ITestResult result) {
        WebDriver driver = ((BaseTest) result.getInstance()).getDriver();
        byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment(result.getName() + "_failure", 
            new ByteArrayInputStream(screenshot));
    }
}
```

---

## Q14. How to launch browsers?

**Simple Answer:**
In Selenium 4, the easiest way is to just create a `new ChromeDriver()` — Selenium Manager (built into Selenium 4.6+) automatically downloads and manages the driver. For older setups, use WebDriverManager library. Selenium 3's old System.setProperty() approach is outdated.

**💬 How to say it in an interview:**
> "In my current framework, I use Selenium 4 with its built-in Selenium Manager — no configuration needed, it auto-downloads the right driver version for your browser. Before that, I used WebDriverManager by Bonigarcia. In Jenkins CI, I always run tests in headless mode — I add --headless, --no-sandbox, and --disable-dev-shm-usage to ChromeOptions to ensure stable execution in a Linux Docker container."

**⚡ Key Points:**
- Selenium 4.6+ → Selenium Manager auto-handles drivers (no setup needed)
- Older Selenium → use WebDriverManager (io.github.bonigarcia)
- CI/CD (Jenkins/Docker) → always use headless mode

```java
// Method 1: System property (old way — Selenium 3)
System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
WebDriver driver = new ChromeDriver();

// Method 2: WebDriverManager (modern way)
// Add dependency: io.github.bonigarcia:webdrivermanager
WebDriverManager.chromedriver().setup();
WebDriver driver = new ChromeDriver();

// Method 3: Selenium 4 auto-management (Selenium Manager)
// No setup needed — Selenium 4.6+ auto-downloads driver
WebDriver driver = new ChromeDriver();

// With options
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--window-size=1920,1080");
WebDriver driver = new ChromeDriver(options);
```

---

## Q15. How to check if element is present?

**Simple Answer:**
The safest way is `driver.findElements(By.id("x")).size() > 0` — it returns false (empty list) if not found, never throws an exception. `isDisplayed()` tells you if it's visible, `isEnabled()` tells you if it's interactive, `isSelected()` is for checkboxes and radio buttons.

**💬 How to say it in an interview:**
> "I distinguish between three checks: isDisplayed() checks if the element is visible on screen, isEnabled() checks if you can interact with it (a disabled button is present but not enabled), and isSelected() is for checkboxes. But all three throw NoSuchElementException if the element is not in the DOM at all. That's why for safe existence checking without exceptions, I use findElements().size() > 0 — it never throws, it just returns 0 if nothing is found."

```java
// Method 1: isDisplayed() — checks visibility (throws exception if not in DOM)
boolean visible = driver.findElement(By.id("success")).isDisplayed();

// Method 2: isEnabled() — checks if element is enabled (buttons, inputs)
boolean enabled = driver.findElement(By.id("submit")).isEnabled();

// Method 3: isSelected() — for checkboxes, radio buttons
boolean checked = driver.findElement(By.id("agree")).isSelected();

// Method 4: findElements() — safe check without exception
boolean exists = driver.findElements(By.id("error")).size() > 0;

// Method 5: ExpectedConditions (with wait)
try {
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("popup")));
    return true;
} catch (TimeoutException e) {
    return false;
}
```

---

# TESTNG

---

## Q16. TestNG Annotation Execution Order?

**Simple Answer:**
TestNG annotations run in a fixed order: Suite level (once for the whole suite), then Test level (for each `<test>` tag in testng.xml), then Class level, then Method level. This is how you set up your WebDriver, open the browser, and clean up after each test.

**💬 How to say it in an interview:**
> "The execution order is: BeforeSuite → BeforeTest → BeforeClass → BeforeMethod → Test → AfterMethod → AfterClass → AfterTest → AfterSuite. In my framework, I initialise the WebDriver in @BeforeMethod so each test gets a fresh browser, and quit it in @AfterMethod. I set up base configuration like reading config.properties in @BeforeClass, and do suite-level setup like test data in @BeforeSuite. The order matters — if you put driver.quit() in the wrong place, it will close the browser too early."

**⚡ Key Points:**
- BeforeMethod/AfterMethod = most commonly used (open/close browser per test)
- BeforeClass/AfterClass = class-level setup (read config, create test data)
- BeforeSuite/AfterSuite = one-time setup (DB connections, suite-wide config)
- Same-level annotations run in alphabetical method name order

```
@BeforeSuite    → runs ONCE before all tests in suite
@BeforeTest     → runs before each <test> tag in testng.xml
@BeforeClass    → runs before first method of current class
@BeforeMethod   → runs before EACH @Test method
@Test           → actual test method
@AfterMethod    → runs after EACH @Test method
@AfterClass     → runs after all methods of current class
@AfterTest      → runs after each <test> tag
@AfterSuite     → runs ONCE after all tests in suite
```

**Visual flow for 2 test methods:**
```
@BeforeSuite
  @BeforeTest
    @BeforeClass
      @BeforeMethod → @Test (method1) → @AfterMethod
      @BeforeMethod → @Test (method2) → @AfterMethod
    @AfterClass
  @AfterTest
@AfterSuite
```

---

## Q17. Parallel Execution in TestNG?

**Simple Answer:**
Parallel execution runs multiple tests at the same time using different threads. In TestNG, you control this in testng.xml by setting `parallel` attribute. The most common use is running tests on multiple browsers simultaneously — Chrome and Firefox at the same time.

**💬 How to say it in an interview:**
> "I use parallel execution to reduce regression time. At Office Depot, I configured testng.xml with parallel='tests' and thread-count=3 to run Chrome, Firefox, and Edge tests simultaneously. This reduced our regression suite from 90 minutes to 35 minutes. The critical thing in parallel execution is that WebDriver must be thread-safe — I use ThreadLocal to store the driver so each thread has its own instance."

**⚡ Key Points:**
- parallel="tests" = each `<test>` tag runs in its own thread (most common)
- parallel="methods" = each test method runs in its own thread (fastest but risky)
- ThreadLocal<WebDriver> = MUST USE to avoid driver conflicts in parallel
- thread-count = how many tests run simultaneously

```xml
<!-- Parallel at test level -->
<suite name="TestSuite" parallel="tests" thread-count="3">
    <test name="ChromeTest">
        <parameter name="browser" value="chrome"/>
        <classes>
            <class name="com.tests.LoginTest"/>
        </classes>
    </test>
    <test name="FirefoxTest">
        <parameter name="browser" value="firefox"/>
        <classes>
            <class name="com.tests.LoginTest"/>
        </classes>
    </test>
</suite>

<!-- Parallel at class level -->
<suite name="Suite" parallel="classes" thread-count="4">

<!-- Parallel at method level -->
<suite name="Suite" parallel="methods" thread-count="4">
```

**Parallel options:**
| Value | Description |
|-------|-------------|
| `tests` | Each `<test>` tag runs in separate thread |
| `classes` | Each class runs in separate thread |
| `methods` | Each method runs in separate thread |
| `instances` | Each instance runs in separate thread |

---

## Q18. Priorities in TestNG?

**Simple Answer:**
By default, TestNG runs tests in alphabetical order. Priority lets you control the order — lower number runs first. `priority=0` is the default (runs before 1, 2, 3). Use priorities for end-to-end flows where the order matters (login must run before checkout).

**💬 How to say it in an interview:**
> "I use priorities carefully. For independent unit-style tests, I don't set priorities. But for end-to-end flows — like login → add to cart → checkout — I use priority=1, 2, 3 to ensure they run in the correct sequence. However, best practice is to use dependsOnMethods instead of priorities for dependent tests, because dependsOnMethods will skip the dependent test if the prerequisite fails, which is cleaner."

```java
@Test(priority = 1)  // runs first
public void testLogin() { }

@Test(priority = 2)  // runs second
public void testSearch() { }

@Test(priority = 3)  // runs third
public void testLogout() { }

@Test  // priority = 0 by default (runs before 1, 2, 3)
public void testHomePage() { }
```

**Execution order:** default (0) → 1 → 2 → 3. Same priority → alphabetical order.

---

## Q19. Dependencies in TestNG?

**Simple Answer:**
`dependsOnMethods` means "only run this test if the specified test PASSED". If the dependency test fails, the dependent test is SKIPPED (not failed). Use this for tests that logically depend on a previous step completing successfully.

**💬 How to say it in an interview:**
> "I use dependsOnMethods for logical dependencies in my test suite. For example, testCreateUser must pass before testUpdateUser runs — if you can't create a user, there's nothing to update. TestNG marks dependent tests as SKIPPED (not failed) when the dependency fails, which makes your report cleaner — you can see the root cause immediately rather than seeing 5 failing tests when really only 1 thing broke."

**⚡ Key Points:**
- dependsOnMethods: only runs if the named method PASSED
- If dependency fails, dependent test is SKIPPED (not failed)
- alwaysRun=true: runs even if dependency fails (for cleanup methods)
- Use groups for larger dependencies across multiple test classes

```java
// Method dependency
@Test
public void testLogin() { }

@Test(dependsOnMethods = {"testLogin"})
public void testDashboard() {
    // Only runs if testLogin PASSES
}

// Group dependency
@Test(groups = {"setup"})
public void createUser() { }

@Test(dependsOnGroups = {"setup"})
public void testUserProfile() { }

// Soft dependency (run even if dependency fails)
@Test(dependsOnMethods = {"testLogin"}, alwaysRun = true)
public void testLogout() { }
```

---

## Q20. How to Rerun Failed Tests?

**Simple Answer:**
TestNG automatically creates a `testng-failed.xml` after a run. You can re-run this file to execute only the failed tests. For automatic retries during the same run, implement `IRetryAnalyzer` and set a maximum retry count — this is very useful for flaky tests in CI/CD.

**💬 How to say it in an interview:**
> "In my CI/CD pipelines with Jenkins, I implement IRetryAnalyzer to automatically retry flaky tests up to 2 times before marking them as failed. This reduced false-positive failures in our nightly regression by 80% — most flakiness was due to timing issues and environment blips. I apply the retry globally via IAnnotationTransformer so I don't have to add it to every test individually. I also keep the retry count low — max 2 — so genuinely failing tests don't get retried endlessly."

**⚡ Key Points:**
- testng-failed.xml: automatically generated, re-run to execute only failed tests
- IRetryAnalyzer: auto-retry within the same run (for flaky tests)
- Keep retry count low (2 max) to avoid masking real failures
- Apply globally via IAnnotationTransformer (no need to annotate each test)

```
After test execution, TestNG creates:
  target/surefire-reports/testng-failed.xml

Steps:
1. Run full suite → some tests fail
2. TestNG generates testng-failed.xml with only failed tests
3. Right-click testng-failed.xml → Run as TestNG Suite
4. Only failed tests re-execute

Programmatic retry using IRetryAnalyzer:
```

```java
public class RetryAnalyzer implements IRetryAnalyzer {
    private int count = 0;
    private static final int MAX_RETRY = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (count < MAX_RETRY) {
            count++;
            return true;  // retry
        }
        return false;     // don't retry
    }
}

// Apply to test
@Test(retryAnalyzer = RetryAnalyzer.class)
public void flakyTest() { }

// Apply globally via Listener
public class RetryListener implements IAnnotationTransformer {
    @Override
    public void transform(ITestAnnotation annotation, Class testClass,
                          Constructor testConstructor, Method testMethod) {
        annotation.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
```

---

## Q21. Run Test N Times?

**Simple Answer:**
`invocationCount` in the `@Test` annotation tells TestNG to run that test method multiple times. Add `threadPoolSize` to run those repetitions in parallel. Useful for load simulation or verifying test stability.

**💬 How to say it in an interview:**
> "invocationCount is useful for stability testing — if I want to verify that a test doesn't fail randomly due to a race condition, I run it 10 times. If it passes all 10, I'm confident it's stable. Combined with threadPoolSize, you can simulate multiple concurrent users hitting the same endpoint."

```java
// Run test 10 times
@Test(invocationCount = 10)
public void testRepeat() { }

// Run 6 times using 3 threads, timeout 1 second each
@Test(threadPoolSize = 3, invocationCount = 6, timeOut = 1000)
public void testParallelRepeat() { }
```

---

## Q22. TestNG Annotations Summary?

**Simple Answer:**
These are all the TestNG annotations you need to know. The most commonly used are: @Test (marks the test), @BeforeMethod/@AfterMethod (browser setup/teardown), @DataProvider (data-driven testing), and @Listeners (custom reporting/screenshots).

| Annotation | Purpose |
|------------|---------|
| `@Test` | Marks a test method |
| `@DataProvider` | Supplies test data to @Test methods |
| `@Factory` | Creates test instances dynamically at runtime |
| `@Listeners` | Attaches listeners for custom behavior |
| `@Parameters` | Injects parameters from testng.xml |
| `@BeforeSuite/AfterSuite` | Suite-level setup/teardown |
| `@BeforeTest/AfterTest` | Test tag-level |
| `@BeforeClass/AfterClass` | Class-level |
| `@BeforeMethod/AfterMethod` | Method-level |
| `@BeforeGroups/AfterGroups` | Group-level |

---

## Q23. Groups in TestNG?

**Simple Answer:**
Groups let you tag tests and then run only the tagged tests. Common groups: "smoke" (critical 5-minute checks), "regression" (full suite), "sanity" (post-deployment checks). In testng.xml you specify which groups to include or exclude.

**💬 How to say it in an interview:**
> "I organise tests into groups for different purposes. The 'smoke' group contains 10-15 critical tests that take about 5 minutes — these run on every deployment to verify the build is stable. The 'regression' group is the full suite — runs nightly in Jenkins. The 'sanity' group runs after hotfixes. This way, we don't run 500 tests for every code push — just the relevant subset. In testng.xml, I include or exclude groups, and in Jenkins I can pass -Dgroups=smoke via Maven to select which group to run."

```java
@Test(groups = {"smoke"})
public void testLogin() { }

@Test(groups = {"smoke", "regression"})
public void testSearch() { }

@Test(groups = {"regression"})
public void testAdvancedFilter() { }
```

```xml
<!-- testng.xml — run only smoke -->
<suite name="Suite">
    <test name="SmokeTest">
        <groups>
            <run>
                <include name="smoke"/>
                <exclude name="regression"/>
            </run>
        </groups>
        <classes>
            <class name="com.tests.AllTests"/>
        </classes>
    </test>
</suite>
```

---

# JENKINS

---

## Q24. Jenkins Pipeline Configuration?

**Simple Answer:**
A Jenkinsfile defines your automation pipeline as code. It tells Jenkins what to do: checkout the code from Git, build with Maven, run the tests, publish the report, and send email notifications on failure. By storing it in the repository, the pipeline is version-controlled.

**💬 How to say it in an interview:**
> "In all my projects, I maintain the Jenkinsfile as part of the repository. At Office Depot, our pipeline had 4 stages: Checkout from Bitbucket, Build with Maven, Execute tests (with browser and environment as parameters), and Publish the Extent Report. We had scheduled nightly runs at 6am and also triggered on every pull request merge. On failure, Jenkins sends an email to the team with the build URL and failure details."

**⚡ Key Points:**
- Jenkinsfile = pipeline as code, stored in the repo (version-controlled)
- Stages: Checkout → Build → Test → Report → Notify
- post.always: runs cleanup regardless of pass/fail
- post.failure: sends email alerts on test failures

```groovy
// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent any

    parameters {
        choice(name: 'BROWSER', choices: ['chrome', 'firefox'], description: 'Browser')
        choice(name: 'ENV', choices: ['staging', 'prod'], description: 'Environment')
        string(name: 'SUITE', defaultValue: 'testng.xml', description: 'Suite file')
    }

    triggers {
        cron('H 6 * * 1-5')    // weekdays at 6 AM
        pollSCM('H/15 * * * *') // check SCM every 15 min
    }

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://bitbucket.org/team/automation.git',
                    credentialsId: 'bitbucket-creds'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Test') {
            steps {
                sh "mvn test -DsuiteXmlFile=${params.SUITE} -Dbrowser=${params.BROWSER} -Denv=${params.ENV}"
            }
        }

        stage('Report') {
            steps {
                publishHTML([
                    reportDir: 'target/surefire-reports',
                    reportFiles: 'index.html',
                    reportName: 'TestNG Report'
                ])
                // Or Allure
                allure includeProperties: false, results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            junit 'target/surefire-reports/*.xml'
            cleanWs()
        }
        failure {
            emailext subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Check: ${env.BUILD_URL}",
                     to: 'team@company.com'
        }
    }
}
```

## Q25. Command to run tests in Jenkins?

**Simple Answer:**
The command `mvn test` runs all tests. You can pass parameters like the browser, environment, and TestNG suite file via `-D` flags. This is how Jenkins executes your tests in the pipeline.

```bash
# Maven + TestNG
mvn test
mvn test -DsuiteXmlFile=testng.xml
mvn test -Dgroups=smoke

# Maven + specific test class
mvn -Dtest=LoginTest test

# Gradle
gradle test

# Python + pytest
pytest tests/ -m smoke --html=report.html -n 4
```

## Q26. Reports in Jenkins?

**Simple Answer:**
Jenkins can publish test reports through plugins. The most useful ones: JUnit Plugin (parses TestNG XML results, shows pass/fail trend over builds), HTML Publisher (for Extent Reports), and Allure Plugin (beautiful interactive reports with test history).

**💬 How to say it in an interview:**
> "I publish reports in Jenkins using the HTML Publisher Plugin for Extent Reports and the JUnit plugin for TestNG XML results. The JUnit plugin is especially useful because it shows a trend graph — you can see if your pass rate is going up or down over multiple builds. At Office Depot, we also used the Allure plugin which gives beautiful interactive reports with step-by-step details, timings, and categorised failures."

| Plugin | Report Type | Config |
|--------|-------------|--------|
| **HTML Publisher** | Any HTML report | Publish Extent/custom HTML |
| **JUnit Plugin** | TestNG/JUnit XML | Built-in, parses surefire-reports |
| **Allure Plugin** | Allure interactive reports | `allure-results` directory |
| **Cucumber Reports** | BDD Cucumber reports | JSON output from Cucumber |
| **Email Extension** | Email reports on failure | SMTP configuration needed |

## Q27. pom.xml explained?

**Simple Answer:**
pom.xml is the Maven configuration file. It lists your project's dependencies (Selenium, TestNG, etc.) and tells Maven how to build and run your tests. It's like a shopping list + instruction manual for your project.

**💬 How to say it in an interview:**
> "pom.xml is the heart of a Maven project. The key sections are: properties (for version management — I define selenium.version once and use it everywhere), dependencies (I list Selenium, TestNG, REST Assured, WebDriverManager, and Extent Reports), and the build section where I configure maven-surefire-plugin to point to my testng.xml file. Using properties for versions means I only change one number to upgrade all related dependencies."

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.vikrant.automation</groupId>    <!-- organization -->
    <artifactId>test-framework</artifactId>       <!-- project name -->
    <version>1.0-SNAPSHOT</version>               <!-- version -->

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <selenium.version>4.15.0</selenium.version>
    </properties>

    <dependencies>
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>

        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.9.0</version>
            <scope>test</scope>
        </dependency>

        <!-- Rest Assured -->
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <version>5.4.0</version>
            <scope>test</scope>
        </dependency>

        <!-- WebDriverManager -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>5.6.0</version>
        </dependency>

        <!-- Allure -->
        <dependency>
            <groupId>io.qameta.allure</groupId>
            <artifactId>allure-testng</artifactId>
            <version>2.25.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.3</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# ADDITIONAL QUESTIONS — FREQUENTLY ASKED IN 2026

---

## Q28. How to handle dynamic web elements?

**Simple Answer:**
Dynamic elements have IDs or attributes that change every time the page loads (like `id="user_12345"` where 12345 changes). You cannot use the full attribute value. Instead, use partial matching with `contains()`, `starts-with()`, or text-based locators.

**💬 How to say it in an interview:**
> "Dynamic elements are very common in modern web applications, especially in React and Angular apps. At PersonifyHealth, many element IDs were auto-generated and changed on every render. My approach: first look for a stable parent element with a fixed class, then navigate to the target child. If the ID partially matches a pattern, I use CSS [id^='user_'] or XPath contains(@id, 'user_'). If there's no stable attribute at all, I locate by the visible text content using XPath text() or by position relative to a stable label."

**Dynamic elements** = elements whose attributes (id, class, name) change on every page load.

| Strategy | XPath/CSS Example |
|----------|-------------------|
| **Partial attribute match** | `//div[contains(@id, 'user_')]` |
| **Starts-with** | `//input[starts-with(@name, 'field_')]` |
| **Text-based** | `//button[text()='Submit']` |
| **Sibling/parent traversal** | `//label[text()='Email']/following-sibling::input` |
| **Multiple attributes** | `//input[@type='text' and contains(@class, 'form')]` |
| **CSS partial match** | `[id^='user_']` (starts with), `[id$='_name']` (ends with), `[id*='user']` (contains) |
| **Index-based** | `(//div[@class='card'])[3]` |

```java
// Dynamic ID: id="user_12345" changes every time
// BAD
driver.findElement(By.id("user_12345"));
// GOOD
driver.findElement(By.cssSelector("[id^='user_']"));
driver.findElement(By.xpath("//div[contains(@id, 'user_')]"));

// Dynamic table — find row by text
WebElement row = driver.findElement(
    By.xpath("//table//tr[td[text()='Vikrant']]")
);
String email = row.findElement(By.xpath(".//td[3]")).getText();

// Wait for dynamic content
WebElement element = new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'loaded')]")
    ));
```

---

## Q29. Types of XPath — detailed? (Accenture — very frequently asked)

**Simple Answer:**
There are 2 types: Absolute XPath (starts from root `/html` — very fragile, avoid) and Relative XPath (starts with `//` — flexible, preferred). Additionally, XPath Axes let you navigate relationships like parent, sibling, and ancestor. XPath Functions like `contains()` and `text()` make locators flexible.

**💬 How to say it in an interview:**
> "I always write Relative XPath, never Absolute. Absolute XPath like /html/body/div[1]/form/input[2] breaks if any element between root and target changes. Relative XPath is resilient. I use XPath Axes when I need to find elements relative to other elements — for example, a label says 'Email' and the input next to it has a dynamic ID, so I use //label[text()='Email']/following-sibling::input. This is much more stable than using a dynamic ID."

**⚡ Key Points:**
- Absolute XPath = starts with /html/body... — NEVER use (too fragile)
- Relative XPath = starts with // — ALWAYS use
- XPath Axes: parent, ancestor, following-sibling, preceding-sibling
- XPath Functions: contains(), starts-with(), text(), normalize-space()

**1. Absolute XPath** — starts from root `/html` (fragile, avoid):
```
/html/body/div[1]/form/input[2]
```

**2. Relative XPath** — starts with `//` (preferred):
```
//input[@id='username']
```

**3. XPath Axes:**

| Axis | Description | Example |
|------|-------------|---------|
| `self` | Current node | `//input[@id='email']/self::input` |
| `parent` | Direct parent | `//input[@id='email']/parent::div` |
| `child` | Direct children | `//div[@class='form']/child::input` |
| `ancestor` | All ancestors up to root | `//input[@id='email']/ancestor::form` |
| `descendant` | All children/grandchildren | `//form/descendant::input` |
| `following` | Everything after closing tag | `//div[@id='header']/following::div` |
| `preceding` | Everything before opening tag | `//div[@id='footer']/preceding::div` |
| `following-sibling` | Next siblings at same level | `//label[@for='email']/following-sibling::input` |
| `preceding-sibling` | Previous siblings at same level | `//input[@id='pass']/preceding-sibling::label` |

**4. XPath Functions:**
```
contains()       → //div[contains(@class, 'active')]
starts-with()    → //button[starts-with(@id, 'btn_')]
text()           → //a[text()='Login']
normalize-space() → //span[normalize-space()='Submit']
not()            → //div[not(@class='hidden')]
last()           → //ul/li[last()]
position()       → //ul/li[position()<=3]
```

**Interview tip:** Always prefer `CSS selectors` over XPath for speed. Use XPath only when you need text-based matching or ancestor/sibling traversal.

---

## Q30. Actions Class — keyboard & mouse operations?

**Simple Answer:**
The Actions class handles advanced user interactions that simple click() or sendKeys() cannot do — like hover (mouse over), right-click, double-click, keyboard shortcuts (Ctrl+A, Ctrl+C), and drag-and-drop. Always end an Actions chain with `.perform()`.

**💬 How to say it in an interview:**
> "I use the Actions class for hover menus — at Office Depot, the navigation menu only showed sub-items when you hovered over the main category. Standard click() didn't work — I had to use Actions.moveToElement() first to trigger the hover state. I also use it for keyboard shortcuts like Ctrl+A to select all text before replacing it. Always remember to call .perform() at the end — without it, nothing actually executes."

**⚡ Key Points:**
- Always end with `.perform()` — without it, the action chain does nothing
- Hover = `moveToElement(element).perform()`
- Keyboard shortcuts = `keyDown(CONTROL).sendKeys("a").keyUp(CONTROL).perform()`
- Double-click = `doubleClick(element).perform()`
- Right-click = `contextClick(element).perform()`

```java
Actions actions = new Actions(driver);

// Mouse operations
actions.moveToElement(element).perform();          // hover
actions.click(element).perform();                   // click
actions.doubleClick(element).perform();             // double click
actions.contextClick(element).perform();            // right click
actions.clickAndHold(source).moveToElement(target)
       .release().perform();                        // drag & drop

// Keyboard operations
actions.sendKeys(Keys.ENTER).perform();
actions.sendKeys(Keys.TAB).perform();
actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).perform(); // Ctrl+A
actions.keyDown(Keys.CONTROL).sendKeys("c").keyUp(Keys.CONTROL).perform(); // Ctrl+C

// Composite actions
actions.moveToElement(menu)                        // hover over menu
       .pause(Duration.ofSeconds(1))               // wait for dropdown
       .click(submenuItem)                         // click sub-item
       .perform();

// Scroll to element
actions.scrollToElement(element).perform();        // Selenium 4.2+
```

---

## Q31. JavaScriptExecutor — when and how to use?

**Simple Answer:**
JavaScriptExecutor lets you run JavaScript directly in the browser. Use it when Selenium's normal methods fail — for example, clicking a hidden element, scrolling to an element, or setting a value on an input that resists sendKeys.

**When to use:** When standard Selenium methods fail (hidden elements, scroll, shadow DOM).

**💬 How to say it in an interview:**
> "I use JavaScriptExecutor as a fallback when Selenium's standard methods don't work. The most common use case is scrolling — scrollIntoView() to bring an element into the viewport before clicking. I also use it for date picker inputs that block keyboard input — js.executeScript to set the value directly. And I use it to check page load state — return document.readyState == 'complete'. But I treat it as a last resort, not the first solution, because it bypasses the browser's normal interaction model."

**⚡ Key Points:**
- Use as fallback, not first choice
- Common uses: scroll, click hidden elements, set value, check page load
- `return document.readyState` = check if page is fully loaded
- `arguments[0]` refers to the WebElement you pass as a parameter

```java
JavascriptExecutor js = (JavascriptExecutor) driver;

// Click hidden/overlapped element
js.executeScript("arguments[0].click();", element);

// Scroll
js.executeScript("window.scrollBy(0, 500);");                    // scroll down 500px
js.executeScript("window.scrollTo(0, document.body.scrollHeight);"); // scroll to bottom
js.executeScript("arguments[0].scrollIntoView(true);", element); // scroll to element

// Get text from hidden element
String text = (String) js.executeScript("return arguments[0].textContent;", element);

// Set value (bypass sendKeys issues)
js.executeScript("arguments[0].value='Vikrant';", inputField);

// Highlight element (for debugging)
js.executeScript("arguments[0].style.border='3px solid red';", element);

// Check page load status
js.executeScript("return document.readyState").equals("complete");

// Wait for jQuery AJAX to complete
new WebDriverWait(driver, Duration.ofSeconds(10)).until(
    d -> (Boolean) ((JavascriptExecutor) d).executeScript("return jQuery.active == 0")
);
```

---

## Q32. How to handle file upload and download?

**Simple Answer:**
For file upload with a standard `<input type='file'>`, use `sendKeys()` with the full file path — no clicking needed, just send the path directly to the input element. For download, configure Chrome to save to a specific directory automatically without showing the download dialog.

**💬 How to say it in an interview:**
> "File upload in Selenium is actually easier than most people think. If the upload element is a standard HTML file input, I just call sendKeys() with the file path — no need to interact with the OS file dialog. At Aflac, we had a form where users uploaded insurance documents. I used sendKeys() with the absolute file path and it worked perfectly. For file download, I configure ChromeOptions to set the default download directory and disable the download prompt, so files save automatically. Then I verify the download by checking if the file exists in that directory."

```java
// FILE UPLOAD — Method 1: sendKeys to input[type='file']
WebElement uploadInput = driver.findElement(By.cssSelector("input[type='file']"));
uploadInput.sendKeys("/path/to/file.pdf");

// FILE UPLOAD — Method 2: For non-input elements (using Robot class)
WebElement uploadBtn = driver.findElement(By.id("uploadBtn"));
uploadBtn.click();
Robot robot = new Robot();
// Copy file path to clipboard
StringSelection filePath = new StringSelection("/path/to/file.pdf");
Toolkit.getDefaultToolkit().getSystemClipboard().setContents(filePath, null);
robot.keyPress(KeyEvent.VK_CONTROL);
robot.keyPress(KeyEvent.VK_V);
robot.keyRelease(KeyEvent.VK_V);
robot.keyRelease(KeyEvent.VK_CONTROL);
robot.keyPress(KeyEvent.VK_ENTER);
robot.keyRelease(KeyEvent.VK_ENTER);

// FILE DOWNLOAD — Set Chrome download directory
Map<String, Object> prefs = new HashMap<>();
prefs.put("download.default_directory", "/path/to/downloads");
prefs.put("download.prompt_for_download", false);
ChromeOptions options = new ChromeOptions();
options.setExperimentalOption("prefs", prefs);
WebDriver driver = new ChromeDriver(options);

// Verify download
File downloadedFile = new File("/path/to/downloads/report.pdf");
new WebDriverWait(driver, Duration.ofSeconds(30)).until(
    d -> downloadedFile.exists() && downloadedFile.length() > 0
);
```

---

## Q33. What is Selenium Grid? How to set it up?

**Simple Answer:**
Selenium Grid lets you run tests on multiple machines and browsers at the same time. One machine is the Hub (coordinator) and others are Nodes (each with a different browser). Your tests connect to the Hub's URL and it routes them to the right Node.

**💬 How to say it in an interview:**
> "Selenium Grid is for cross-browser, cross-platform parallel execution. In my framework, I use RemoteWebDriver instead of ChromeDriver when running on Grid. The test connects to the Hub URL at port 4444, the Hub finds a Node that has the requested browser, and runs the test there. In Docker, I use the official Selenium Grid Docker images which are very easy to set up — I just run docker-compose up and the whole Grid is ready in 30 seconds. This is what I use in Jenkins for cross-browser regression."

**⚡ Key Points:**
- Hub = central server that receives test requests and routes them
- Node = machine with browsers that executes the tests
- Connect with RemoteWebDriver(hubURL, browserOptions)
- Docker Grid = easiest way to set up in CI/CD

**Selenium Grid** allows running tests on **multiple machines/browsers in parallel**.

**Architecture:**
```
Hub (central server) ─────────────────────────────
│                                                  │
├─ Node 1 (Chrome on Windows)                     │
├─ Node 2 (Firefox on Linux)                      │
├─ Node 3 (Edge on Windows)                       │
└─ Node 4 (Chrome on Mac)                         │
```

**Setup (Selenium 4 — Standalone):**
```bash
# Download selenium-server-4.x.jar
java -jar selenium-server-4.18.0.jar standalone

# Hub + Node (distributed)
java -jar selenium-server-4.18.0.jar hub
java -jar selenium-server-4.18.0.jar node --hub http://hub-ip:4444

# Docker (recommended)
docker run -d -p 4444:4444 selenium/standalone-chrome
```

**Connect tests to Grid:**
```java
ChromeOptions options = new ChromeOptions();
WebDriver driver = new RemoteWebDriver(
    new URL("http://localhost:4444"), options
);
driver.get("https://example.com");
```
