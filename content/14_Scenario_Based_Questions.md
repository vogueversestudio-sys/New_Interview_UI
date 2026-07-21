# Scenario-Based SDET Interview Questions — India 2026
## Vikrant Mishra — SDET Interview Prep
## Companies: Capgemini, Wipro, Accenture, TCS, Infosys, Cognizant, Publicis Sapient

> These are **real-world situational questions** asked in 2026 interviews.
> Interviewers want to see **how you think**, not just what you know.

> **How to answer scenario questions:** Use the STAR format — Situation, Task, Action, Result. Lead with what you did in your last project. Be specific. Mention tools (JIRA, Jenkins, Allure, Selenium Grid). Show that you collaborate with developers and take ownership.

---

# AUTOMATION FRAMEWORK & MAINTENANCE SCENARIOS

---

## S1. Your automation suite suddenly starts failing after a UI change. How do you handle it?

**💬 How to say it in an interview:**
> "First I don't panic — I open the Allure report and screenshots to identify the pattern. If it's one locator change, that's a 5-minute fix in the Page Object class. If it's a major redesign, I schedule a brief sync with the dev who made the change to understand the new structure. I always use data-testid attributes — I work with the dev team to add them during the sprint when a new feature is built. This makes locators much more stable."

**Immediate Steps:**
1. **Analyze failure reports** — check screenshots, logs, and Allure/Extent reports to identify which tests failed
2. **Categorize failures** — is it one locator change or a complete page redesign?
3. **Check with dev team** — was it an intentional UI change or a bug?

**Fix Strategy:**
- If **single element changed** → update the locator in the Page Object class (POM ensures single point of change)
- If **major redesign** → update the Page Object class entirely, may need new methods
- If **layout shift but same elements** → switch to more resilient locators (data-testid > CSS > XPath)

**Prevention for future:**
- Use **data-testid** or **data-qa** attributes (collaborate with developers to add them)
- Avoid **absolute XPath** — use relative XPath with stable attributes
- Implement **Page Object Model (POM)** — locators in one place, easy to update
- Use **self-healing locator libraries** (like Healenium) that auto-detect and fix broken locators
- Set up **CI/CD pipeline notifications** so you catch failures immediately
- Maintain a **locator strategy document** so the team follows consistent patterns

```java
// BAD — fragile locator
driver.findElement(By.xpath("/html/body/div[3]/div/div[2]/form/input[1]"));

// GOOD — resilient locator
driver.findElement(By.cssSelector("[data-testid='login-email']"));
driver.findElement(By.id("email"));
```

---

## S2. A test case passes locally but fails intermittently in Jenkins. How do you debug?

**💬 How to say it in an interview:**
> "Intermittent failures are almost always timing issues or environment differences. First I check the Jenkins logs and screenshots at the point of failure. I run the test 10 times locally in headless mode to replicate Jenkins conditions. If it's a wait issue, I add an explicit wait. If it's a parallel execution conflict, I check if two tests are writing to the same test data. At IDEMIA, I solved a persistent flaky test issue by implementing ThreadLocal WebDriver for parallel execution and adding a retry analyzer for genuinely flaky tests."

**Root Causes (in order of likelihood):**

| # | Cause | Solution |
|---|-------|----------|
| 1 | **Timing issues** — elements not loaded | Add explicit waits (`WebDriverWait`) instead of `Thread.sleep()` |
| 2 | **Environment differences** — screen resolution, browser version | Use headless mode, set fixed viewport size |
| 3 | **Test data dependency** — shared data, stale DB | Use unique test data per run, clean up before/after |
| 4 | **Parallel execution conflicts** — tests sharing state | Make tests independent, use ThreadLocal for WebDriver |
| 5 | **Resource constraints** — Jenkins agent has less RAM/CPU | Check Jenkins agent specs, reduce parallel threads |
| 6 | **Network latency** — Jenkins agent has slower network | Increase timeouts, add retry mechanisms |
| 7 | **Browser driver mismatch** — different Chrome/driver version | Use WebDriverManager for auto-driver management |

**Debugging Steps:**
1. **Check Jenkins console logs** — look for the exact error and stack trace
2. **Check screenshots/videos** — if your framework captures them on failure
3. **Run the same test 10 times locally** — see if it's genuinely flaky
4. **Check Jenkins agent environment** — OS, browser version, screen resolution
5. **Add detailed logging** — log every step, element state, URL, etc.
6. **Run in headless mode locally** — replicate Jenkins conditions

```java
// Fix: ThreadLocal WebDriver for parallel execution
public class DriverManager {
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() { return driver.get(); }
    public static void setDriver(WebDriver d) { driver.set(d); }
    public static void quitDriver() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
        }
    }
}
```

---

## S3. Product owner wants 100% automation coverage in 2 sprints. How do you respond?

**💬 How to say it in an interview:**
> "I'd have an honest conversation with the PO. 100% automation is not the right goal — smart, risk-based coverage is. I'd propose: Sprint 1 covers smoke tests (20-30 critical user flows), Sprint 2 covers high-priority regression (50-80 tests). Going forward, we add 15-20 tests per sprint. I'd also explain what should NOT be automated: exploratory tests, one-off tests, features still in flux. The real metric is not coverage percentage, it's defects caught per sprint and regression time saved."

**Honest & Professional Answer:**

"100% automation coverage in 2 sprints is **not realistic or advisable**. Here's my approach:"

1. **Set expectations** — explain that 100% automation is not the goal; **smart coverage** is
2. **Prioritize using risk-based approach:**
   - Sprint 1: Automate **smoke tests** (critical user flows — login, core business flow, payment)
   - Sprint 2: Automate **high-priority regression tests** (most-used features, recent bug areas)
3. **What NOT to automate:**
   - One-time tests
   - Exploratory testing
   - Tests requiring human judgment (visual, UX)
   - Features still under active development
4. **Propose a realistic plan:**
   - Week 1-2: Framework setup + smoke tests (~20-30 critical tests)
   - Week 3-4: Regression tests (~50-80 tests for high-priority modules)
   - Ongoing: Add tests incrementally each sprint

**Metrics to share:**
- "We can achieve **70-80% coverage of critical paths** in 2 sprints"
- "Each sprint going forward, we add 15-20 new automated tests"
- "Focus on ROI: automate tests that run frequently and catch real bugs"

---

## S4. Your Selenium tests are taking 5+ hours to complete. How do you optimize?

**💬 How to say it in an interview:**
> "I reduced our regression suite from 3 days to 4 hours at IDEMIA using three main techniques: parallel execution with Selenium Grid (5 parallel threads), switching to headless Chrome for CI/CD, and replacing UI-based test data setup with API calls. Instead of logging in and navigating through 5 screens to create a test record, I call the POST /records API directly — that setup goes from 2 minutes to 2 seconds per test. These three changes combined cut the execution time by 75%."

**Optimization Strategy:**

| # | Technique | Impact |
|---|-----------|--------|
| 1 | **Parallel execution** (TestNG `parallel="tests"`, Selenium Grid) | 60-70% reduction |
| 2 | **Headless browser** (Chrome `--headless`) | 20-30% faster |
| 3 | **Remove Thread.sleep()** → use explicit waits | Significant |
| 4 | **Reduce unnecessary navigations** — reuse sessions where possible | Moderate |
| 5 | **API calls instead of UI** for setup/teardown (create test data via API) | 50%+ for setup |
| 6 | **Run only affected tests** — tag-based execution (smoke, regression) | Depends on change |
| 7 | **Use lightweight locators** — ID/CSS over XPath | Minor but adds up |
| 8 | **Disable images/CSS loading** in browser preferences | 10-15% faster |
| 9 | **Docker containers** — spin up parallel browser instances | Scalable |
| 10 | **Cloud solutions** — BrowserStack, Sauce Labs, LambdaTest | Unlimited parallel |

```java
// Parallel execution in TestNG
// testng.xml
<suite name="Regression" parallel="tests" thread-count="5">
    <test name="Login">
        <classes><class name="tests.LoginTest"/></classes>
    </test>
    <test name="Dashboard">
        <classes><class name="tests.DashboardTest"/></classes>
    </test>
</suite>

// Headless Chrome
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless=new");
options.addArguments("--disable-gpu");
options.addArguments("--window-size=1920,1080");
options.addArguments("--disable-images");
WebDriver driver = new ChromeDriver(options);
```

**Real example from my experience:**
"In my previous project at IDEMIA, I reduced the regression suite from **3 days to 4 hours** by implementing parallel execution with Selenium Grid and headless browsers, combined with API-based test data setup."

---

## S5. Developers say automation failures are "test issues." How do you handle this?

**💬 How to say it in an interview:**
> "I don't argue — I show data. I classify every failure with clear evidence: screenshot at the time of failure, the API response, and proof that the same test passed on the previous build. I file JIRA bugs with full reproduction steps and Allure report attachments. I also maintain test reliability above 95% on a clean build — so when I say it's a real bug, the team trusts me. Over time, tracking 'bugs found by automation' in sprint reviews builds credibility with both devs and management."

**Professional Approach:**

1. **Provide evidence** — don't argue, show data:
   - Share **screenshots** at point of failure
   - Share **API response logs** showing unexpected data
   - Share **video recordings** of the failure
   - Share **environment details** — same test passes on previous build

2. **Classify failures with clear categories:**
   | Category | Example | Who Fixes |
   |----------|---------|-----------|
   | **Product Bug** | Button not clickable, wrong data displayed | Developer |
   | **Test Environment** | Server down, DB not refreshed | DevOps/Team |
   | **Test Script Issue** | Locator changed, timing issue | SDET |
   | **Flaky Test** | Intermittent failure, race condition | SDET + Dev |

3. **Use a bug triage process:**
   - File bugs in JIRA with **clear reproduction steps**
   - Attach **Allure/Extent reports** with screenshots
   - Tag bugs as `automation-found` for visibility
   - In sprint retrospective, present **"Bugs Found by Automation"** metrics

4. **Build trust:**
   - Maintain high test reliability (>95% pass rate when no real bugs)
   - Keep tests independent and deterministic
   - When tests fail, first verify it's not a test issue before reporting

---

## S6. How would you automate a login flow with OTP / CAPTCHA?

**💬 How to say it in an interview:**
> "For OTP, the best approach is to work with the dev team to expose a test API endpoint that returns the OTP for a specific test phone number or email — this is reliable, fast, and works in CI/CD. We never try to read real OTPs from SMS or email in automated tests. For CAPTCHA, we ask the dev team to disable it in the test environment or use Google's test reCAPTCHA keys that always pass. The principle is: don't fight security mechanisms, work around them by design in test environments."

**OTP Handling:**

| Method | How | When to Use |
|--------|-----|-------------|
| **Mock OTP API** | Ask dev team to expose an API endpoint that returns OTP for test users | Best approach for CI/CD |
| **Fixed test OTP** | Configure a fixed OTP (e.g., `123456`) for test accounts in staging | Simple and reliable |
| **Database query** | Read OTP directly from DB | When API not available |
| **Email/SMS API** | Use Mailinator/Guerrilla Mail API to read OTP from email | When testing real email flow |
| **Google Authenticator** | Use TOTP library to generate OTP from shared secret | For TOTP-based 2FA |

```java
// Method 1: Mock API endpoint
Response response = given()
    .queryParam("phone", "9999999999")
    .get("/api/test/get-otp");
String otp = response.jsonPath().getString("otp");

// Method 2: Database query
String otp = jdbcTemplate.queryForObject(
    "SELECT otp FROM otp_table WHERE phone='9999999999' ORDER BY created_at DESC LIMIT 1",
    String.class
);

// Method 3: TOTP generation
import de.taimos.totp.TOTP;
String otp = TOTP.getOTP("YOUR_BASE32_SECRET_KEY");
```

**CAPTCHA Handling:**

| Method | How |
|--------|-----|
| **Disable CAPTCHA** in test environment (best) | Ask dev team to bypass CAPTCHA for test IPs or test users |
| **Use test key** | Google reCAPTCHA provides test keys that always pass |
| **Cookie/token bypass** | Set a cookie/header that skips CAPTCHA validation |
| **Never automate real CAPTCHA** | It defeats the purpose of CAPTCHA |

**Interview answer:** "In our framework, we work with the development team to disable CAPTCHA in test environments. For OTP, we use a dedicated test API endpoint that returns the OTP for test phone numbers. We never try to 'solve' CAPTCHA or read real OTPs from phones — that's unreliable and defeats security."

---

## S7. You are asked to automate a feature that changes every sprint. How do you approach it?

**💬 How to say it in an interview:**
> "For rapidly changing features, I invest in maintainability over speed. I externalise all test data to JSON or Excel so changing values don't require code changes. I design Page Objects with small, focused methods rather than one monolithic action. I also recommend testing such features at the API level rather than UI — API contracts are much more stable than UI layouts. And I have a direct conversation with the PO to understand what WILL remain stable, and focus automation on that."

**Strategy:**

1. **Use Data-Driven approach** — externalize test data so changing values don't require code changes
2. **Build flexible Page Objects** — design POM methods to handle variations
3. **Use configuration files** — feature flags, environment configs
4. **Focus on stable business logic** — automate the core flow, not UI-specific details
5. **Discuss with PO** — understand what's stable vs. what will change
6. **Use API testing** — API contracts change less frequently than UI
7. **Invest in maintainable code** — small, reusable methods over monolithic scripts

```java
// Data-driven: test data in external file
@DataProvider(name = "loginData")
public Object[][] loginData() {
    return ExcelUtils.readData("testdata/login.xlsx", "LoginSheet");
}

// Page Object with flexible methods
public class DynamicPage {
    // Instead of hardcoding element count
    public List<WebElement> getAllCards() {
        return driver.findElements(By.cssSelector(".card"));
    }

    // Handle dynamic content
    public void selectOption(String optionText) {
        WebElement option = new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(text(),'" + optionText + "')]")));
        option.click();
    }
}
```

---

## S8. Your API returns dynamic fields like timestamps & IDs. How do you validate?

**💬 How to say it in an interview:**
> "For dynamic fields, I validate format and constraints instead of exact values. For IDs, I assert they're a positive integer. For timestamps, I assert they match an ISO date pattern. For UUIDs, I validate the UUID format regex. For the most robust approach, I use JSON Schema validation — it validates the complete response structure and data types without caring about specific values. I also use a 'capture and reuse' pattern: capture the ID from a POST response and use it in the subsequent GET/PUT/DELETE."

**Strategies:**

```java
// 1. IGNORE dynamic fields — validate only stable fields
given().get("/api/users/1")
.then()
    .body("name", equalTo("Vikrant"))
    .body("email", equalTo("v@test.com"));
    // Don't validate: id, createdAt, updatedAt

// 2. VALIDATE format, not exact value
given().get("/api/users/1")
.then()
    .body("id", greaterThan(0))                              // positive integer
    .body("createdAt", matchesPattern("\\d{4}-\\d{2}-\\d{2}T.*"))  // ISO date format
    .body("uuid", matchesPattern("[a-f0-9-]{36}"));          // UUID format

// 3. JSON SCHEMA validation — validates structure & types, not values
given().get("/api/users/1")
.then()
    .body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/user-schema.json"));

// 4. STORE and REUSE — capture ID from POST, use in GET
Response createResponse = given()
    .body(payload)
    .post("/api/users");
int userId = createResponse.jsonPath().getInt("id");

// Now validate using the captured ID
given().get("/api/users/" + userId)
.then()
    .statusCode(200)
    .body("id", equalTo(userId));

// 5. Relative time validation
long responseTimestamp = response.jsonPath().getLong("createdAt");
long now = System.currentTimeMillis();
Assert.assertTrue(Math.abs(now - responseTimestamp) < 60000, "Timestamp not within 1 minute");
```

---

## S9. Business users complain BDD scenarios are too technical. How do you fix it?

**Problem:** Gherkin scenarios written in developer language instead of business language.

**Bad Example:**
```gherkin
Scenario: Login
  Given I navigate to URL "https://app.com/login"
  When I enter "admin" in element with id "username"
  And I enter "pass123" in element with id "password"
  And I click on element with xpath "//button[@type='submit']"
  Then I should see element with class "dashboard-header"
```

**Good Example (business-readable):**
```gherkin
Scenario: Successful login with valid credentials
  Given I am on the login page
  When I login with valid credentials
  Then I should be redirected to the dashboard
  And I should see a welcome message
```

**How to fix:**
1. **Write Gherkin in business language** — no technical terms, no locators, no URLs
2. **Get PO/BA to review** scenarios before implementation
3. **Use domain-specific vocabulary** — "checkout cart" not "click submit button on /cart page"
4. **Hide technical details in step definitions** — all Selenium code goes in step def Java files
5. **Follow the "Given-When-Then" discipline:**
   - **Given** = precondition (state setup)
   - **When** = action (user interaction)
   - **Then** = expected outcome (assertion)
6. **Use Scenario Outlines** for data variations
7. **Keep scenarios short** — 3-5 steps max, use Background for common steps

---

## S10. Regression suite failed just before production deployment. What do you do?

**💬 How to say it in an interview:**
> "I follow a triage process. First, check if smoke tests passed — if smoke fails on a critical flow, that's an automatic block. If it's 2 out of 500 tests, I check if they're known flaky tests, re-run once, and if they pass, document it and allow deployment with risk acknowledgment. If 20+ tests are failing on changed code, I block the deployment and report to the team immediately with a summary: 'X tests failing, Y appear to be real bugs in the new feature.' I never make the go/no-go decision alone — that's a stakeholder decision with the data I provide."

**Immediate Actions (Triage):**

1. **Don't panic. Analyze first.**
2. **Check failure count:**
   - **1-2 failures out of 500** → likely flaky or environment issue → investigate quickly
   - **20+ failures** → likely a real build issue → **BLOCK the deployment**
3. **Categorize failures:**
   - **Known flaky tests** → re-run once. If passes, it's flaky (flag for fix later)
   - **New failures on unchanged code** → environment/data issue
   - **New failures on changed code** → likely real bugs → report immediately

**Decision Matrix:**

| Failure Type | Action | Deploy? |
|-------------|--------|---------|
| All smoke tests pass, 2 minor regression failures | Investigate, likely flaky | Yes (with risk acceptance) |
| Smoke test failure on critical flow | Block deployment | **No** |
| 50%+ regression failing | Major issue, escalate | **No** |
| Known flaky tests (documented) | Re-run, verify | Yes |

**Process:**
1. Run **smoke tests** first (5-10 min) — if smoke fails, stop immediately
2. Run **full regression** — report results with categories
3. **Communicate to stakeholders** — "X failures found, Y are real bugs, Z are flaky"
4. **Get sign-off** from QA lead/manager for go/no-go decision
5. **Document** the decision and reasoning

**Prevention:**
- Run regression **daily** on CI, not just before release
- Maintain a **zero-flaky-tolerance** policy — fix or quarantine flaky tests
- Have **smoke + critical path** as mandatory gate before deployment

---

# PRODUCTION & PROCESS SCENARIOS

---

## S11. How do you handle production issues? (Accenture — Screenshot 1)

**💬 How to say it in an interview:**
> "When a production issue is reported, my first action is to check whether the scenario was covered in our automation suite. If it was covered and the test passed, I investigate whether the test data or environment matched production conditions. If it was NOT covered, I add that test case immediately as my first priority. After the hotfix, I run the full regression in staging before re-deployment. After resolution, I participate in the post-mortem to ensure a regression test is added to permanently prevent recurrence."

**Step-by-step approach:**

1. **Acknowledge** — join the war room / incident channel immediately
2. **Reproduce** — try to reproduce the issue in staging/QA environment
3. **Analyze logs** — check application logs, server logs, error monitoring tools (Splunk, ELK, Datadog)
4. **Identify impact** — how many users affected? What's the severity?
5. **Communicate** — update stakeholders with findings every 30 min
6. **Root cause analysis:**
   - Was it covered by test cases? If yes, why did it slip?
   - Was it an environment-specific issue?
   - Was it a data issue?
7. **Fix & verify** — quick hotfix → verify in staging → deploy to prod
8. **Post-mortem** — document root cause, prevention steps, add regression test

**As an SDET, my role in production issues:**
- Check if the scenario was **covered in automation** — if not, add it immediately
- Check if the **test data** in automation matched production conditions
- Verify the fix with **automated regression** before re-deployment
- Add the production bug as a **new automated test case** (prevent regression)

---

## S12. Do you have any knowledge in Cloud? (Accenture — Screenshot 1)

**Answer for SDET context:**

"Yes, I have working knowledge of cloud platforms relevant to testing:"

**AWS (most common in India):**
| Service | How SDETs Use It |
|---------|-----------------|
| **EC2** | Run Selenium Grid on cloud instances |
| **S3** | Store test reports, screenshots, test data files |
| **Lambda** | Run lightweight test scripts serverlessly |
| **RDS** | Connect to test databases for data validation |
| **CloudWatch** | Monitor test execution logs |
| **CodePipeline** | CI/CD pipeline for test automation |

**Docker & Kubernetes (DevOps for testers):**
```bash
# Run Selenium tests in Docker
docker run -d -p 4444:4444 selenium/standalone-chrome

# Docker Compose for Selenium Grid
docker-compose up -d selenium-hub chrome-node firefox-node

# Run tests against containerized grid
mvn test -Dselenium.grid.url=http://localhost:4444
```

**Cloud Testing Platforms:**
- **BrowserStack** / **Sauce Labs** / **LambdaTest** — cross-browser testing
- **AWS Device Farm** — mobile testing
- **Azure DevOps** — CI/CD pipeline + test management

---

## S13. How do you validate APIs in your current project? (Accenture — Screenshot 1)

**Real project answer:**

"In my current project at CloudAngles (PersonifyHealth), we validate APIs using:"

1. **Functional Validation:**
   - Verify status codes (200, 201, 400, 401, 404, 500)
   - Validate response body fields (correct data, correct types)
   - Validate response headers (Content-Type, Authorization)
   - Response time < 2 seconds SLA

2. **Integration Validation:**
   - Chain API calls: POST (create) → GET (verify) → PUT (update) → DELETE (cleanup)
   - Validate data flows between microservices
   - Database validation — verify API response matches DB records

3. **Negative Testing:**
   - Missing required fields → 400
   - Invalid authentication → 401
   - Invalid data types → 400
   - SQL injection payloads → should not expose DB errors

4. **Contract Testing:**
   - JSON Schema validation to ensure API contract is maintained
   - Compare API response structure against Swagger/OpenAPI spec

5. **Tools:**
   - **REST Assured** for Java-based API automation
   - **Postman** for manual exploratory API testing
   - **Newman** for running Postman collections in CI/CD
   - **JSON Schema Validator** for contract testing

---

## S14. How quickly can you learn new technologies and processes? (from Screenshot 3)

**Answer:**

"I'm a fast learner and have demonstrated this multiple times in my career:

- When I joined CloudAngles, I quickly **upskilled from Java/Selenium to Python/Playwright** within 2 weeks
- I self-taught **AI-assisted testing tools** (Windsurf, GitHub Copilot, Claude) and started using them productively within days
- At IDEMIA, I took ownership of a completely new biometric testing domain with zero prior experience

**My learning approach:**
1. Start with official documentation and quick-start guides
2. Build a small proof-of-concept project immediately
3. Apply the technology to a real project task within the first week
4. Share learnings with the team through knowledge sessions

Currently, I'm actively exploring **AI-driven test generation**, **cloud-native testing**, and **performance engineering** to stay relevant in 2026."

---

## S15. What is your strategy to rapidly improve ROI in automation? (from Screenshot 3)

**ROI Formula:**
```
ROI = (Time saved by automation - Time spent building automation) / Time spent building automation × 100
```

**Strategy:**

1. **Automate high-frequency tests first** — tests that run daily/weekly in regression
2. **Target high-risk areas** — payment flows, authentication, core business logic
3. **Avoid automating low-value tests** — rarely run, one-time, exploratory
4. **Reuse components** — build reusable utility methods, API helpers, data factories
5. **Shift-left testing** — integrate tests early in CI/CD, catch bugs before QA stage
6. **Use API testing** for backend validation (10x faster than UI tests)
7. **Measure and report:**
   - Bugs found by automation vs manual
   - Time saved per sprint
   - Test execution time trends
   - Flaky test rate (should be < 5%)

**Real metrics from my experience:**
- Automated **500+ regression tests** → reduced regression cycle from **3 days to 4 hours**
- Each automated test saves **15-20 minutes per manual run**
- With 500 tests running weekly → savings = **~170 hours/week**

---

# ADVANCED SCENARIOS (Lead/Senior SDET level)

---

## S16. How do you reduce flakiness in UI automation? (Wipro — Screenshot 2)

**💬 How to say it in an interview:**
> "Flakiness is the #1 enemy of trust in automation. My target is less than 2% flaky rate. The root causes I see most often are: timing issues (solved by better explicit waits), shared test data (solved by creating unique data per test), and AJAX completion issues (solved by waiting for jQuery.active == 0). I quarantine flaky tests — move them to a separate 'quarantine' suite so they don't pollute CI results, then fix them systematically. I also implement a retry analyzer with max 2 retries to handle genuinely intermittent infrastructure issues."

**Flaky test = passes sometimes, fails sometimes. Target: < 2% flaky rate.**

| # | Technique | Example |
|---|-----------|---------|
| 1 | **Explicit waits everywhere** | `WebDriverWait` + `ExpectedConditions` |
| 2 | **Stable locators** | `data-testid` > `id` > `CSS` > `XPath` |
| 3 | **Retry mechanism** | TestNG `IRetryAnalyzer` (max 2 retries) |
| 4 | **Independent tests** | No test should depend on another test's state |
| 5 | **Clean test data** | Create fresh data before each test, cleanup after |
| 6 | **Network waits** | Wait for AJAX/API calls to complete before assertions |
| 7 | **Scroll into view** | Element may be off-screen, scroll before interacting |
| 8 | **Headless consistency** | Same viewport size in headless and headed mode |
| 9 | **Quarantine flaky tests** | Move to separate suite, fix separately |
| 10 | **Visual stability** | Wait for animations/transitions to complete |

```java
// Retry analyzer for TestNG
public class RetryAnalyzer implements IRetryAnalyzer {
    private int count = 0;
    private static final int MAX_RETRY = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (count < MAX_RETRY) {
            count++;
            return true;
        }
        return false;
    }
}

@Test(retryAnalyzer = RetryAnalyzer.class)
public void flakyProneTest() { /* ... */ }

// Wait for network idle (no pending AJAX calls)
new WebDriverWait(driver, Duration.ofSeconds(10)).until(
    d -> ((JavascriptExecutor) d).executeScript(
        "return jQuery.active == 0"
    )
);
```

---

## S17. How do you handle dynamic web elements? (Wipro — Screenshot 2)

**Dynamic elements = elements whose attributes change on every page load.**

| Strategy | Example |
|----------|---------|
| **Partial attribute matching** | `//div[contains(@id, 'user_')]` |
| **Relative locators** | Find element relative to a stable parent/sibling |
| **Text-based XPath** | `//button[text()='Submit']` |
| **CSS pseudo-selectors** | `div.card:nth-child(3)` |
| **Parent-child traversal** | `//label[text()='Email']/following-sibling::input` |
| **JavaScript execution** | `document.querySelector('[data-dynamic]')` |
| **Wait for stability** | Wait until element attributes stop changing |

```java
// Dynamic ID: id="user_12345" changes every time
// BAD: By.id("user_12345")
// GOOD: By.cssSelector("[id^='user_']")    // starts with 'user_'
// GOOD: By.xpath("//div[contains(@id, 'user_')]")

// Dynamic table — find row by text content
WebElement row = driver.findElement(
    By.xpath("//table//tr[td[text()='Vikrant Mishra']]")
);
String email = row.findElement(By.xpath(".//td[3]")).getText();

// Wait for dynamic content to load
WebElement dynamicElement = new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'loaded')]")
    ));
```

---

## S18. How do you pass test data to tests? (from Screenshot 3)

| Method | When to Use | Example |
|--------|-------------|---------|
| **Properties file** | Environment configs (URLs, credentials) | `config.properties` |
| **Excel file** | Large datasets, multiple test data combinations | Apache POI |
| **JSON file** | API payloads, complex nested data | Jackson/Gson |
| **CSV file** | Simple tabular data | OpenCSV |
| **TestNG DataProvider** | Parameterized tests | `@DataProvider` annotation |
| **Database** | Dynamic data that changes frequently | JDBC connection |
| **Faker library** | Generate random realistic test data | JavaFaker |
| **API calls** | Create test data via API before UI tests | REST Assured |

```java
// 1. Properties file
Properties props = new Properties();
props.load(new FileInputStream("config.properties"));
String url = props.getProperty("base.url");

// 2. TestNG DataProvider
@DataProvider(name = "loginData")
public Object[][] loginData() {
    return new Object[][] {
        {"admin", "admin123", true},
        {"user", "wrongpass", false},
        {"", "", false}
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String user, String pass, boolean expected) { }

// 3. Excel with Apache POI
@DataProvider(name = "excelData")
public Object[][] excelData() throws IOException {
    return ExcelUtils.readExcelData("testdata/login.xlsx", "Sheet1");
}

// 4. Faker library for random data
Faker faker = new Faker();
String name = faker.name().fullName();
String email = faker.internet().emailAddress();
String phone = faker.phoneNumber().cellPhone();
```

---

## S19. Explain BDD vs TDD. When to use BDD in real projects? (Wipro — Screenshot 2)

**💬 How to say it in an interview:**
> "TDD is developer-focused — write a failing unit test, then write code to make it pass, then refactor. BDD is collaboration-focused — QA, BA, and Dev write Gherkin scenarios together before implementation. BDD shines when you have business stakeholders who actually read the feature files, or when you need to use tests as living documentation. I've used Cucumber BDD at IDEMIA where the BA team reviewed Gherkin scenarios in sprint planning. The key is: don't use BDD if nobody except QA reads the feature files — it adds overhead without the benefit."

**⚡ Key Points:**
- TDD = unit test level, code correctness, developer-driven
- BDD = acceptance test level, business behavior, team collaboration
- Use BDD when stakeholders actively engage with Gherkin scenarios
- Don't use BDD for API-only or unit testing — it adds ceremony without value

| Aspect | TDD (Test-Driven Development) | BDD (Behavior-Driven Development) |
|--------|-------------------------------|-----------------------------------|
| Focus | **Code correctness** | **Business behavior** |
| Written by | Developers | QA + BA + Dev (collaboration) |
| Language | Programming language (Java, Python) | Natural language (Gherkin: Given-When-Then) |
| Level | Unit tests | Acceptance/integration tests |
| Tools | JUnit, TestNG, pytest | Cucumber, SpecFlow, Behave |
| Cycle | Red → Green → Refactor | Discover → Formulate → Automate |

**When to use BDD:**
- When business stakeholders need to **understand test scenarios**
- When requirements are given as **user stories** with acceptance criteria
- When you need a **living documentation** of system behavior
- When **multiple teams** (dev, QA, BA) need to collaborate on test scenarios
- When the project follows **Agile methodology** with close customer interaction

**When NOT to use BDD:**
- Pure API/unit testing — BDD adds overhead without value
- Small teams where dev and QA are the same person
- When stakeholders don't read/review Gherkin scenarios

```java
// TDD example — unit test first
@Test
public void testAddition() {
    Calculator calc = new Calculator();
    assertEquals(5, calc.add(2, 3));  // Write test BEFORE implementation
}

// BDD example — feature file
// Feature: Login functionality
//   Scenario: Valid login
//     Given user is on the login page
//     When user enters valid credentials
//     Then user should see the dashboard
```

---

## S20. How do you design API automation using REST Assured? (Wipro — Screenshot 2)

**💬 How to say it in an interview:**
> "My REST Assured framework has three layers. BaseTest sets up the RequestSpecification with base URL, content type, auth headers, and Allure logging filter — this runs once before all tests. RestUtils is a reusable utility layer with static methods for GET, POST, PUT, DELETE that wrap the REST Assured given/when/then. Test classes extend BaseTest, use RestUtils for HTTP calls, and use POJOs with Jackson for serialization/deserialization. Tests are clean, readable, and completely separated from HTTP mechanics."

**Framework Architecture:**

```
api-automation-framework/
├── src/
│   ├── main/java/
│   │   ├── config/          → ConfigReader.java (read properties)
│   │   ├── constants/       → Endpoints.java, StatusCodes.java
│   │   ├── models/          → POJOs (User.java, Response.java)
│   │   ├── utils/           → RestUtils.java (reusable request methods)
│   │   └── listeners/       → TestListener.java (Allure/reporting)
│   └── test/
│       ├── java/
│       │   ├── base/        → BaseTest.java (setup RequestSpecification)
│       │   ├── tests/       → UserAPITest.java, AuthTest.java
│       │   └── dataproviders/ → TestData providers
│       └── resources/
│           ├── schemas/     → JSON schema files
│           ├── payloads/    → JSON request payloads
│           └── config.properties
├── testng.xml
├── pom.xml
└── README.md
```

```java
// BaseTest — shared setup
public class BaseTest {
    protected RequestSpecification requestSpec;

    @BeforeClass
    public void setup() {
        requestSpec = new RequestSpecBuilder()
            .setBaseUri(ConfigReader.get("base.url"))
            .setContentType(ContentType.JSON)
            .addFilter(new AllureRestAssured())
            .addFilter(new RequestLoggingFilter())
            .addFilter(new ResponseLoggingFilter())
            .build();
    }
}

// RestUtils — reusable methods
public class RestUtils {
    public static Response get(RequestSpecification spec, String endpoint) {
        return given().spec(spec).get(endpoint);
    }

    public static Response post(RequestSpecification spec, String endpoint, Object body) {
        return given().spec(spec).body(body).post(endpoint);
    }
}

// Test class — clean and readable
public class UserAPITest extends BaseTest {
    @Test
    public void testCreateUser() {
        User user = new User("Vikrant", "SDET");

        Response response = RestUtils.post(requestSpec, Endpoints.USERS, user);

        Assert.assertEquals(response.getStatusCode(), 201);
        Assert.assertEquals(response.jsonPath().getString("name"), "Vikrant");
        Assert.assertNotNull(response.jsonPath().getString("id"));
    }
}
```
