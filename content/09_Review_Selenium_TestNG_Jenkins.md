# Selenium, TestNG, Jenkins Interview Questions
## Vikrant Mishra — SDET Interview Prep

---

# SELENIUM WEBDRIVER

---

## Q1. Types of Waits in WebDriver?

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

**Cause:** The element was found in the DOM but by the time you interact with it, the DOM has been refreshed/modified (e.g., AJAX update, page reload, SPA navigation). The reference is now "stale".

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

| Plugin | Report Type | Config |
|--------|-------------|--------|
| **HTML Publisher** | Any HTML report | Publish Extent/custom HTML |
| **JUnit Plugin** | TestNG/JUnit XML | Built-in, parses surefire-reports |
| **Allure Plugin** | Allure interactive reports | `allure-results` directory |
| **Cucumber Reports** | BDD Cucumber reports | JSON output from Cucumber |
| **Email Extension** | Email reports on failure | SMTP configuration needed |

## Q27. pom.xml explained?

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

**When to use:** When standard Selenium methods fail (hidden elements, scroll, shadow DOM).

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
