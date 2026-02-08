# Framework Architecture, Git, Maven & DevOps — SDET Interview Prep
## Vikrant Mishra — India 2026 (Noida, Pune, Hyderabad, Bangalore, Gurugram, Dubai)
## Companies: Wipro, Capgemini, Accenture, TCS, Infosys, Cognizant, Publicis Sapient

---

# AUTOMATION FRAMEWORK ARCHITECTURE

---

## Q1. Explain the structure of your automation framework? (Wipro, Capgemini — very frequently asked)

**Framework Type:** Hybrid Framework (Page Object Model + Data-Driven + BDD)

```
automation-framework/
├── src/
│   ├── main/java/
│   │   ├── pages/               → Page Object classes
│   │   │   ├── BasePage.java    → Common methods (click, type, wait)
│   │   │   ├── LoginPage.java
│   │   │   ├── DashboardPage.java
│   │   │   └── RegistrationPage.java
│   │   ├── utils/               → Utility/Helper classes
│   │   │   ├── ConfigReader.java    → Read config.properties
│   │   │   ├── ExcelUtils.java      → Read test data from Excel
│   │   │   ├── WaitUtils.java       → Custom wait methods
│   │   │   ├── ScreenshotUtils.java → Capture screenshots
│   │   │   └── LogUtils.java        → Log4j logging
│   │   ├── factory/             → Browser/Driver factory
│   │   │   └── DriverFactory.java   → Create Chrome/Firefox/Edge
│   │   ├── constants/           → Constants and enums
│   │   │   └── AppConstants.java
│   │   └── listeners/           → TestNG listeners
│   │       └── TestListener.java    → Allure/Extent reporting
│   └── test/
│       ├── java/
│       │   ├── base/
│       │   │   └── BaseTest.java    → @BeforeMethod/@AfterMethod setup
│       │   ├── tests/
│       │   │   ├── LoginTest.java
│       │   │   ├── DashboardTest.java
│       │   │   └── APITest.java
│       │   └── dataproviders/
│       │       └── DataProviders.java
│       └── resources/
│           ├── config.properties    → URLs, credentials, browser type
│           ├── testdata/            → Excel, JSON, CSV files
│           └── schemas/             → JSON schema files for API
├── testng.xml                       → Test suite configuration
├── pom.xml                          → Maven dependencies
├── Jenkinsfile                      → CI/CD pipeline
├── Dockerfile                       → Containerized execution
├── .gitignore
└── README.md
```

**Key Design Principles:**
1. **Page Object Model (POM)** — each page = separate class, locators + methods together
2. **Single Responsibility** — each class does one thing well
3. **DRY (Don't Repeat Yourself)** — reusable methods in BasePage and utils
4. **Data-Driven** — test data externalized (Excel, properties, JSON)
5. **Configuration-Driven** — environment, browser, URL from config file
6. **Reporting** — Allure/Extent reports with screenshots on failure
7. **Logging** — Log4j for detailed execution logs
8. **CI/CD Ready** — Jenkinsfile, Docker support

```java
// BasePage.java — common methods
public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    protected void click(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element)).click();
    }

    protected void type(WebElement element, String text) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.clear();
        element.sendKeys(text);
    }

    protected String getText(WebElement element) {
        return wait.until(ExpectedConditions.visibilityOf(element)).getText();
    }

    protected boolean isDisplayed(WebElement element) {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
        } catch (TimeoutException e) {
            return false;
        }
    }
}

// LoginPage.java
public class LoginPage extends BasePage {
    @FindBy(id = "username") private WebElement usernameField;
    @FindBy(id = "password") private WebElement passwordField;
    @FindBy(id = "loginBtn") private WebElement loginButton;
    @FindBy(css = ".error-message") private WebElement errorMsg;

    public LoginPage(WebDriver driver) { super(driver); }

    public DashboardPage login(String user, String pass) {
        type(usernameField, user);
        type(passwordField, pass);
        click(loginButton);
        return new DashboardPage(driver);
    }

    public String getErrorMessage() { return getText(errorMsg); }
}

// BaseTest.java
public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        String browser = ConfigReader.get("browser");
        driver = DriverFactory.createDriver(browser);
        driver.manage().window().maximize();
        driver.get(ConfigReader.get("base.url"));
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            ScreenshotUtils.capture(driver, result.getName());
        }
        if (driver != null) driver.quit();
    }
}

// LoginTest.java
public class LoginTest extends BaseTest {
    @Test(dataProvider = "loginData", dataProviderClass = DataProviders.class)
    public void testLogin(String user, String pass, String expected) {
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboard = loginPage.login(user, pass);
        Assert.assertTrue(dashboard.isLoaded(), "Dashboard not loaded");
    }
}
```

---

## Q2. How to connect files in Cucumber? What are hooks? (from Screenshot 3)

**Cucumber File Structure:**
```
src/test/
├── java/
│   ├── stepDefinitions/
│   │   ├── LoginSteps.java      → Step definition code
│   │   ├── DashboardSteps.java
│   │   └── Hooks.java           → @Before, @After hooks
│   ├── runners/
│   │   └── TestRunner.java      → Connects features + step definitions
│   └── pages/
│       └── LoginPage.java       → Page Objects
└── resources/
    └── features/
        ├── login.feature        → Gherkin scenarios
        └── dashboard.feature
```

**Test Runner — connects everything:**
```java
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",   // feature file location
    glue = {"stepDefinitions"},                  // step definition package
    plugin = {
        "pretty",                                // console output
        "html:target/cucumber-report.html",      // HTML report
        "json:target/cucumber.json",             // JSON for Jenkins
        "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"  // Allure
    },
    tags = "@smoke",                             // run only smoke tests
    monochrome = true,                           // readable console
    dryRun = false                               // set true to check missing steps
)
public class TestRunner { }
```

**Hooks — setup/teardown for Cucumber:**
```java
public class Hooks {
    private WebDriver driver;

    @Before                  // runs BEFORE each scenario
    public void setUp() {
        driver = DriverFactory.createDriver("chrome");
        driver.manage().window().maximize();
        ScenarioContext.setDriver(driver);
    }

    @Before("@api")         // conditional hook — only for @api tagged scenarios
    public void setupAPI() {
        RestAssured.baseURI = ConfigReader.get("api.base.url");
    }

    @After                   // runs AFTER each scenario
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", scenario.getName());
        }
        if (driver != null) driver.quit();
    }

    @AfterStep               // runs after EACH step
    public void afterStep(Scenario scenario) {
        // Optional: capture screenshot after every step
    }

    @BeforeAll               // runs ONCE before all scenarios (Cucumber 7+)
    public static void beforeAll() {
        System.out.println("Starting test suite...");
    }

    @AfterAll                // runs ONCE after all scenarios
    public static void afterAll() {
        System.out.println("Suite complete. Generating reports...");
    }
}
```

**Hook Execution Order:**
```
@BeforeAll (once)
  @Before (each scenario)
    @BeforeStep (each step)
      Given... When... Then...
    @AfterStep (each step)
  @After (each scenario)
@AfterAll (once)
```

---

## Q3. How do you handle flaky test cases? (from Screenshot 3)

**Definition:** A flaky test is one that **passes and fails intermittently** without any code change.

**Root Causes & Fixes:**

| Root Cause | Detection | Fix |
|-----------|-----------|-----|
| **Timing issues** | Fails on slow machines, passes on fast | Explicit waits, not Thread.sleep |
| **Test data dependency** | Fails after another test modifies data | Independent test data, cleanup |
| **Order dependency** | Fails when run in different order | Each test sets up own preconditions |
| **Shared state** | Static variables, shared WebDriver | ThreadLocal, fresh driver per test |
| **Environment issues** | Fails on CI, passes locally | Headless mode, fixed viewport |
| **Animation/transitions** | Click happens before animation ends | Wait for animation to complete |
| **Network latency** | AJAX calls not complete | Wait for jQuery.active == 0 |

**Management Strategy:**
1. **Track flaky rate** — dashboard showing flaky test trends
2. **Quarantine** — move flaky tests to separate suite, don't block CI pipeline
3. **Retry mechanism** — retry failed tests once (TestNG `IRetryAnalyzer`)
4. **Fix deadline** — every quarantined test must be fixed within 1 sprint
5. **Flaky test SLA** — team target < 2% flaky rate

---

# MAVEN

---

## Q4. Explain Maven lifecycle? (from Screenshot 3 — frequently asked)

**Maven Build Lifecycle Phases:**

| Phase | What It Does | Command |
|-------|-------------|---------|
| `validate` | Validate project structure, pom.xml | `mvn validate` |
| `compile` | Compile source code (.java → .class) | `mvn compile` |
| `test` | Run unit tests (JUnit/TestNG) | `mvn test` |
| `package` | Package compiled code (JAR/WAR) | `mvn package` |
| `verify` | Run integration tests | `mvn verify` |
| `install` | Install package to local repository (~/.m2) | `mvn install` |
| `deploy` | Deploy package to remote repository | `mvn deploy` |
| `clean` | Delete target/ directory | `mvn clean` |

**Important:** Each phase runs ALL previous phases. `mvn package` = validate + compile + test + package.

**Common Maven Commands for SDET:**
```bash
# Run all tests
mvn clean test

# Run specific test class
mvn test -Dtest=LoginTest

# Run specific test method
mvn test -Dtest=LoginTest#testValidLogin

# Run with specific TestNG XML
mvn test -DsuiteXmlFile=testng-smoke.xml

# Run with profile
mvn test -Psmoke        # activates <profile> named "smoke"

# Skip tests
mvn package -DskipTests

# Run with specific browser (via system property)
mvn test -Dbrowser=firefox -Denv=staging

# Generate Allure report
mvn allure:serve
```

**pom.xml Key Sections:**
```xml
<project>
    <!-- Project info -->
    <groupId>com.vikrant</groupId>
    <artifactId>automation-framework</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- Properties — versions in one place -->
    <properties>
        <selenium.version>4.18.0</selenium.version>
        <testng.version>7.9.0</testng.version>
        <restassured.version>5.4.0</restassured.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <!-- Dependencies -->
    <dependencies>
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
        </dependency>
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <version>${restassured.version}</version>
        </dependency>
    </dependencies>

    <!-- Build plugins -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <!-- Profiles for different environments -->
    <profiles>
        <profile>
            <id>smoke</id>
            <properties>
                <suiteXmlFile>testng-smoke.xml</suiteXmlFile>
            </properties>
        </profile>
        <profile>
            <id>regression</id>
            <properties>
                <suiteXmlFile>testng-regression.xml</suiteXmlFile>
            </properties>
        </profile>
    </profiles>
</project>
```

---

# GIT

---

## Q5. Git commands you use daily? (from Screenshot 3 — very frequently asked)

```bash
# --- BASIC COMMANDS ---
git init                          # Initialize new repo
git clone <url>                   # Clone remote repo
git status                        # Check working directory status
git add .                         # Stage all changes
git add <file>                    # Stage specific file
git commit -m "message"           # Commit staged changes
git push origin <branch>          # Push to remote
git pull origin <branch>          # Pull latest from remote

# --- BRANCHING ---
git branch                        # List local branches
git branch -a                     # List all branches (local + remote)
git branch feature/login          # Create new branch
git checkout feature/login        # Switch to branch
git checkout -b feature/login     # Create + switch (shortcut)
git switch feature/login          # Modern way to switch (Git 2.23+)
git branch -d feature/login       # Delete branch (safe)
git branch -D feature/login       # Force delete branch

# --- MERGING ---
git merge feature/login           # Merge branch into current
git merge --no-ff feature/login   # Merge with merge commit (no fast-forward)
git merge --abort                 # Abort merge if conflicts

# --- REBASING ---
git rebase main                   # Rebase current branch onto main
git rebase -i HEAD~3              # Interactive rebase (squash, edit, reorder)
git rebase --abort                # Abort rebase

# --- STASHING ---
git stash                         # Save uncommitted changes temporarily
git stash list                    # List all stashes
git stash pop                     # Apply + remove latest stash
git stash apply stash@{0}         # Apply specific stash (keep in list)
git stash drop stash@{0}          # Remove specific stash

# --- VIEWING HISTORY ---
git log --oneline -10             # Last 10 commits, one line each
git log --graph --oneline         # Visual branch graph
git diff                          # Show unstaged changes
git diff --staged                 # Show staged changes
git show <commit-hash>            # Show specific commit details
git blame <file>                  # Show who changed each line

# --- UNDOING ---
git reset --soft HEAD~1           # Undo last commit, keep changes staged
git reset --mixed HEAD~1          # Undo last commit, keep changes unstaged
git reset --hard HEAD~1           # Undo last commit, DELETE changes
git revert <commit-hash>          # Create new commit that undoes a specific commit
git checkout -- <file>            # Discard changes in file

# --- REMOTE ---
git remote -v                     # Show remote URLs
git fetch origin                  # Fetch without merging
git push origin --delete branch   # Delete remote branch

# --- TAGGING ---
git tag v1.0.0                    # Create lightweight tag
git tag -a v1.0.0 -m "Release"   # Create annotated tag
git push origin --tags            # Push all tags
```

---

## Q6. Git merge vs rebase? How do you handle merge conflicts? (from Screenshot 3)

**Merge vs Rebase:**

| Aspect | Merge | Rebase |
|--------|-------|--------|
| History | **Preserves** all commits + creates merge commit | **Rewrites** history, linear commit line |
| Use when | Merging feature → main (shared branches) | Updating feature branch from main |
| Safety | Safe for shared branches | **NEVER rebase shared/public branches** |
| Graph | Non-linear (branching visible) | Linear (clean history) |

```bash
# MERGE workflow (safe for team branches)
git checkout main
git pull origin main
git merge feature/login
# Creates a merge commit, preserves branch history

# REBASE workflow (for personal feature branches)
git checkout feature/login
git rebase main
# Replays your commits ON TOP of main's latest commits
# Results in cleaner, linear history
```

**Handling Merge Conflicts:**

```bash
# 1. Pull latest and merge
git checkout main
git pull origin main
git checkout feature/login
git merge main

# 2. Git shows conflict markers in affected files:
<<<<<<< HEAD
String url = "https://staging.example.com";
=======
String url = "https://qa.example.com";
>>>>>>> main

# 3. Resolve manually — choose correct version:
String url = "https://staging.example.com";

# 4. Stage resolved files
git add .

# 5. Complete the merge
git commit -m "Resolved merge conflicts with main"

# 6. Push
git push origin feature/login
```

**Best Practices:**
- Pull from main **frequently** (daily) to minimize conflicts
- Keep feature branches **short-lived** (1-3 days max)
- Communicate with team when modifying shared files
- Use IDE merge tools (IntelliJ, VS Code) for complex conflicts

---

## Q7. Git branching strategy in your project?

**GitFlow (most common in Indian IT companies):**

```
main ─────────────────────────────────────────→ (production)
  │                                     ↑
  └─ develop ──────────────────────────→ (merge to main for release)
       │            ↑         ↑
       ├─ feature/login ──────┘         (feature branches)
       ├─ feature/dashboard ──┘
       │
       └─ release/v1.0 ────→ (release testing)
                    │
              hotfix/bugfix ──→ main    (emergency production fix)
```

| Branch | Purpose | Merges To |
|--------|---------|-----------|
| `main` | Production code | — |
| `develop` | Integration branch | `main` (via release) |
| `feature/*` | New features | `develop` |
| `release/*` | Release preparation | `main` + `develop` |
| `hotfix/*` | Production bug fixes | `main` + `develop` |

---

# CI/CD & DEVOPS

---

## Q8. Explain CI/CD integration of test automation in Jenkins/GitHub Actions? (Wipro — Screenshot 2)

**Jenkins Pipeline (Declarative):**

```groovy
pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    environment {
        BROWSER = 'chrome'
        ENV = 'staging'
    }

    parameters {
        choice(name: 'TEST_SUITE', choices: ['smoke', 'regression', 'all'], description: 'Test suite')
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'edge'], description: 'Browser')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vikrant/automation.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Run Tests') {
            steps {
                sh """
                    mvn test \
                        -DsuiteXmlFile=testng-${params.TEST_SUITE}.xml \
                        -Dbrowser=${params.BROWSER} \
                        -Denv=${ENV}
                """
            }
        }

        stage('Generate Report') {
            steps {
                allure includeProperties: false, results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                reportDir: 'target/surefire-reports',
                reportFiles: 'index.html',
                reportName: 'Test Report'
            ])
        }
        failure {
            emailext(
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Check: ${env.BUILD_URL}",
                to: 'vikrant@example.com'
            )
        }
        success {
            echo 'All tests passed!'
        }
    }
}
```

**GitHub Actions:**

```yaml
# .github/workflows/test.yml
name: Automation Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        browser: [chrome, firefox]

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Install Chrome
        uses: browser-actions/setup-chrome@latest

      - name: Run Tests
        run: mvn clean test -Dbrowser=${{ matrix.browser }}

      - name: Upload Allure Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-${{ matrix.browser }}
          path: allure-results/

      - name: Generate Allure Report
        if: always()
        uses: simple-elf/allure-report-action@v1.7
        with:
          allure_results: allure-results

      - name: Notify on Failure
        if: failure()
        uses: slackapi/slack-github-action@v1.25
        with:
          payload: '{"text": "Tests FAILED on ${{ github.ref }}"}'
```

---

## Q9. Docker for Test Automation (trending in 2026)

**Why Docker for testing?**
- **Consistent environment** — same browser/driver versions everywhere
- **Parallel execution** — spin up multiple browser containers
- **Isolated** — no interference between test runs
- **Scalable** — add more containers as needed

```dockerfile
# Dockerfile for running Selenium tests
FROM maven:3.9-eclipse-temurin-17

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
COPY testng.xml .

CMD ["mvn", "clean", "test", "-DsuiteXmlFile=testng.xml"]
```

```yaml
# docker-compose.yml — Selenium Grid
version: '3'
services:
  selenium-hub:
    image: selenium/hub:4.18
    ports:
      - "4444:4444"

  chrome:
    image: selenium/node-chrome:4.18
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
    deploy:
      replicas: 3  # 3 Chrome instances

  firefox:
    image: selenium/node-firefox:4.18
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
    deploy:
      replicas: 2  # 2 Firefox instances
```

```bash
# Run Selenium Grid
docker-compose up -d

# Connect tests to grid
mvn test -Dselenium.grid.url=http://localhost:4444

# View grid dashboard
# http://localhost:4444/ui
```

---

# ADDITIONAL FREQUENTLY ASKED TOPICS (2026)

---

## Q10. What is Page Object Model (POM) and how do you implement it? (Wipro — Screenshot 2)

**POM Principles:**
1. Each **web page** = separate **Java class**
2. **Locators** are defined as class variables (private)
3. **Actions** are defined as methods (public)
4. Tests call page methods, never interact with locators directly
5. If UI changes, only the Page Object changes — tests remain untouched

**Benefits:**
- **Maintainability** — locator change = 1 file update
- **Readability** — tests read like business actions
- **Reusability** — page methods reused across tests
- **Reduced duplication** — locators defined once

```java
// With PageFactory (annotation-based)
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(css = "input[type='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//button[@data-testid='login-btn']")
    private WebElement loginButton;

    @FindBy(className = "error-message")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        super(driver);
        PageFactory.initElements(driver, this);
    }

    public DashboardPage loginAs(String user, String pass) {
        type(usernameField, user);
        type(passwordField, pass);
        click(loginButton);
        return new DashboardPage(driver);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }

    public String getErrorText() {
        return getText(errorMessage);
    }
}

// Test — clean, readable, no locators
@Test
public void testValidLogin() {
    LoginPage loginPage = new LoginPage(driver);
    DashboardPage dashboard = loginPage.loginAs("admin", "admin123");
    Assert.assertTrue(dashboard.isWelcomeDisplayed());
}

@Test
public void testInvalidLogin() {
    LoginPage loginPage = new LoginPage(driver);
    loginPage.loginAs("invalid", "wrong");
    Assert.assertTrue(loginPage.isErrorDisplayed());
    Assert.assertEquals(loginPage.getErrorText(), "Invalid credentials");
}
```

---

## Q11. What is instance variable? How is it different from local and static? (from Screenshot 3)

| Type | Declared | Scope | Lifetime | Default Value |
|------|----------|-------|----------|---------------|
| **Instance variable** | Inside class, outside method | Each object has its own copy | As long as object exists | Yes (0, null, false) |
| **Local variable** | Inside method/block | Only within that method/block | Only during method execution | **No** (must initialize) |
| **Static variable** | With `static` keyword | Shared across ALL objects | As long as class is loaded | Yes (0, null, false) |

```java
public class TestConfig {
    // Instance variable — each object has its own
    String testName;
    WebDriver driver;

    // Static variable — shared by all objects
    static int testCount = 0;

    public void runTest() {
        // Local variable — exists only in this method
        String result = "PASS";
        testCount++;
        System.out.println(testName + ": " + result);
    }
}

TestConfig t1 = new TestConfig();
t1.testName = "Login Test";    // instance variable — belongs to t1

TestConfig t2 = new TestConfig();
t2.testName = "Dashboard Test"; // instance variable — belongs to t2

// t1.testName ≠ t2.testName (separate copies)
// TestConfig.testCount is shared (one copy)
```

---

## Q12. Explain Agile Retrospective? (Accenture — Screenshot 1)

A **Sprint Retrospective** is a meeting held at the **end of each sprint** where the team reflects on the sprint process and identifies improvements.

**Format:**
1. **What went well?** — celebrate successes
2. **What didn't go well?** — identify problems (not blame)
3. **What can we improve?** — actionable items for next sprint

**Example for SDET team:**

| What Went Well | What Didn't Go Well | Action Items |
|---------------|--------------------|--------------| 
| Automated 30 new regression tests | 5 flaky tests blocked CI pipeline | Fix flaky tests this sprint |
| API tests caught 3 bugs before release | Test data setup takes too long | Create API-based test data factory |
| Good collaboration with dev on locators | Selenium Grid crashed twice | Move to Docker-based grid |

**Duration:** 1-1.5 hours (for a 2-week sprint)
**Attendees:** Scrum Master, Dev Team, QA/SDET, Product Owner (optional)
**Output:** 2-3 concrete action items assigned to team members

---

## Q13. What is the difference between Smoke Testing vs Sanity Testing vs Regression Testing?

| Aspect | Smoke Testing | Sanity Testing | Regression Testing |
|--------|--------------|----------------|-------------------|
| **Purpose** | Verify **basic functionality** works | Verify **specific fix/feature** works | Verify **existing features** not broken |
| **When** | After new build deployed | After bug fix or minor change | After any code change |
| **Scope** | Broad but shallow | Narrow and deep | Broad and deep |
| **Who** | QA/Automation | QA/Automation | QA/Automation |
| **Also called** | Build verification test | Build acceptance test | — |
| **Automation** | Always automate | Partially automate | Always automate |
| **Example** | Login works, homepage loads, search works | Login bug fixed → verify only login flow | Full test suite — all modules |
| **Time** | 15-30 min | 30-60 min | 2-8 hours |

---

## Q14. What is Performance Testing? (trending in 2026 — from Screenshot 4 LinkedIn profile)

| Type | What It Tests | Tool |
|------|-------------|------|
| **Load Testing** | Behavior under expected user load | JMeter, k6, Gatling |
| **Stress Testing** | Breaking point — beyond expected load | JMeter, Locust |
| **Spike Testing** | Sudden increase in load | k6, JMeter |
| **Endurance/Soak Testing** | Sustained load over long time | JMeter, Gatling |
| **Scalability Testing** | How well system scales with more users | k6, AWS Load Testing |

**Basic JMeter Test Plan Structure:**
```
Test Plan
├── Thread Group (100 users, 10 ramp-up, 5 loops)
│   ├── HTTP Request (GET /api/users)
│   ├── HTTP Request (POST /api/login)
│   └── Response Assertion (status = 200)
├── Listener: Summary Report
├── Listener: Graph Results
└── Listener: View Results Tree
```

**k6 (modern performance testing — JavaScript-based):**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 50 },   // ramp up to 50 users
        { duration: '1m', target: 50 },     // stay at 50 users
        { duration: '30s', target: 0 },     // ramp down
    ],
};

export default function () {
    let res = http.get('https://api.example.com/users');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(1);
}
```

---

## Q15. What is API Security Testing? (trending in 2026)

**Common API Security Tests:**

| # | Test | What to Check |
|---|------|--------------|
| 1 | **Broken Authentication** | Access without token → 401 |
| 2 | **Broken Authorization** | User A accessing User B's data → 403 |
| 3 | **SQL Injection** | Send `' OR 1=1 --` in parameters → should NOT expose data |
| 4 | **XSS** | Send `<script>alert('xss')</script>` → should be sanitized |
| 5 | **Rate Limiting** | Send 1000 requests/sec → should get 429 |
| 6 | **HTTPS Only** | HTTP request → should redirect to HTTPS |
| 7 | **Sensitive Data Exposure** | Passwords, tokens should NOT appear in response |
| 8 | **CORS** | Cross-origin requests should be restricted |

```java
// Test: Access without authentication
@Test
public void testNoAuth() {
    given()
        .baseUri("https://api.example.com")
    .when()
        .get("/api/users")
    .then()
        .statusCode(401);
}

// Test: SQL Injection
@Test
public void testSQLInjection() {
    given()
        .queryParam("name", "' OR 1=1 --")
    .when()
        .get("/api/users/search")
    .then()
        .statusCode(anyOf(is(400), is(403)))  // should reject, not return data
        .body("$", not(hasKey("password")));    // no sensitive data leak
}

// Test: Authorization (User A can't access User B)
@Test
public void testBrokenAuthorization() {
    given()
        .header("Authorization", "Bearer " + userAToken)
    .when()
        .get("/api/users/userB/profile")
    .then()
        .statusCode(403);
}
```
