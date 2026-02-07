# Agile, SDLC, STLC, Framework Architecture & BDD
## Vikrant Mishra — SDET Interview Prep

---

# SELF-INTRODUCTION

"Hi, I'm Vikrant Mishra. I have over 8 years of experience as a **Senior SDET / QA Automation Engineer** specializing in UI automation, API testing, and AI-assisted testing.

**Currently**, I am working at **CloudAngles** on the **PersonifyHealth** project (health & wellness domain). My responsibilities include:
- Building and maintaining automation frameworks using **Python** and **Playwright**
- Leveraging **AI-assisted testing tools** like Windsurf, GitHub Copilot, and Claude for test script generation and debugging
- Building API test suites covering functional, integration, and negative test scenarios
- Managing CI/CD pipelines and following **Agile/Scrum** methodology with JIRA for test management

**Previously**, I worked at **IDEMIA Syscom India Pvt. Ltd.** on a biometric device management project, and at **Coforge** as a Senior QA Automation Test Engineer across **e-commerce** (Office Depot) and **health insurance** (Aflac) domains.

**Key achievements:**
- Automated **500+ regression test cases**, reducing regression cycle from 3 days to 4 hours
- Awarded **Employee of the Month** for exceptional UI automation contributions
- Received multiple **customer appreciation emails**
- Handled **client interactions and team management** in leadership capacity
- Recently upskilled in **AI-assisted testing** using Windsurf, GitHub Copilot, and Playwright"

---

# AGILE METHODOLOGY

---

## Q1. What is Agile Methodology?

**Agile** is an iterative and incremental approach to software development that emphasizes flexibility, collaboration, and customer satisfaction. Instead of delivering the entire product at the end, Agile delivers working software in small, frequent increments called **sprints** (typically 2-4 weeks).

**Agile Manifesto (4 Values):**
1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

**SDLC Phases:**
1. Requirement Gathering & Analysis
2. Planning
3. Design
4. Development (Building/Coding)
5. Testing
6. Deployment
7. Maintenance

**STLC Phases:**
1. Requirement Analysis
2. Test Planning
3. Test Case Design & Development
4. Test Environment Setup
5. Test Execution
6. Test Cycle Closure

---

## Q2. Types of Agile Methodology?

**Scrum:**
- Work divided into **sprints** (2-4 weeks)
- Roles: **Product Owner**, **Scrum Master**, **Development Team**
- Artifacts: **Product Backlog**, **Sprint Backlog**, **Increment**
- Ceremonies: Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective

**Kanban:**
- Visual board with columns: To Do → In Progress → Testing → Done
- Focus on **limiting Work In Progress (WIP)**
- Continuous flow, no fixed sprints
- Good for maintenance/support teams

**SAFe (Scaled Agile Framework):** For large enterprises with multiple teams

**XP (Extreme Programming):** Emphasizes pair programming, TDD, continuous integration

**Lean:** Eliminate waste, optimize flow

---

## Q3. What is Daily Stand-Up Meeting?

A daily stand-up (or **daily scrum**) is a **15-minute time-boxed** meeting held every day at the same time and place. Each team member answers **three questions:**

1. **What did I do yesterday?** (completed tasks)
2. **What will I do today?** (planned tasks)
3. **Any blockers?** (impediments)

**Key rules:**
- Maximum **15 minutes**
- **Standing** (to keep it short)
- Not a status report TO the manager — it's team synchronization
- Scrum Master facilitates and removes blockers
- Product Owner may attend but doesn't drive

**As a Senior SDET, I also report:**
- Automation script status (new scripts written, failures investigated)
- Test environment issues
- Defect trends from last test run

---

## Q4. Scrum Roles?

| Role | Responsibility |
|------|---------------|
| **Product Owner** | Owns the Product Backlog, defines priorities, represents the customer/stakeholders |
| **Scrum Master** | Facilitates ceremonies, removes blockers, coaches the team on Agile practices |
| **Development Team** | Cross-functional team (devs, testers, designers) that delivers the increment |

---

## Q5. Sprint Planning vs Sprint Review vs Sprint Retrospective?

**Sprint Planning Meeting:**
- Held at the **start of each sprint**
- Duration: **2-4 hours** for a 2-week sprint
- Attendees: Product Owner, Scrum Master, Dev Team
- Output: **Sprint Backlog** — selected user stories with tasks and estimates
- Team commits to **sprint goal**

**Sprint Review Meeting:**
- Held at the **end of each sprint**
- Duration: **1-2 hours** for a 2-week sprint
- Team **demos** completed work to stakeholders
- Product Owner marks stories as **Done** or **Not Done**
- Feedback collected for next sprint

**Sprint Retrospective:**
- Held **after Sprint Review**, before next Sprint Planning
- Team discusses: What went well? What didn't? How to improve?
- Output: Action items for process improvement

---

## Q6. What are User Stories?

A user story is a short, simple description of a feature from the end-user perspective.

**Format:** "As a [role], I want [feature], so that [benefit]."

**Example:** "As a customer, I want to reset my password, so that I can regain access to my account."

**Components:**
- **Acceptance Criteria** — conditions that must be met for the story to be "Done"
- **Story Points** — relative effort estimate
- **Priority** — set by Product Owner

**INVEST criteria for good user stories:**
- **I**ndependent — no dependency on other stories
- **N**egotiable — open for discussion
- **V**aluable — delivers value to the user
- **E**stimable — team can estimate effort
- **S**mall — fits in one sprint
- **T**estable — has clear acceptance criteria

---

## Q7. Story Points?

Story points estimate the **relative effort** required to complete a user story. They consider:
- **Complexity** of the work
- **Volume** of work
- **Risk/Uncertainty**

**Fibonacci scale** is commonly used: 1, 2, 3, 5, 8, 13, 21

| Points | Meaning | Example |
|--------|---------|---------|
| 1 | Trivial | Change button text |
| 2 | Simple | Add a new field validation |
| 3 | Medium | New login form with validations |
| 5 | Complex | Payment integration with API |
| 8 | Very complex | End-to-end checkout flow |
| 13+ | Too large — break it down | Full module implementation |

**Planning Poker:** Team votes on story points using cards. If estimates differ significantly, discuss and re-vote.

**As SDET, I estimate test effort considering:**
- Number of test scenarios (positive + negative)
- Automation feasibility
- Test data setup complexity
- API vs UI testing effort
- Environment dependencies

---

## Q8. Verification vs Validation?

| Aspect | Verification | Validation |
|--------|-------------|------------|
| Question | "Are we building the product **right**?" | "Are we building the **right** product?" |
| Focus | Process-oriented | Product-oriented |
| When | During development | After development |
| Methods | Reviews, walkthroughs, inspections | Testing, demos, UAT |
| Example | Code review, design review | Functional testing, UAT |
| Also called | **Static testing** | **Dynamic testing** |

---

## Q9. Priority vs Severity?

| Aspect | Priority | Severity |
|--------|----------|----------|
| Definition | How **quickly** to fix | How **badly** it affects the system |
| Set by | **Project Manager / Business** | **QA / Tester** |
| Values | P1 (Critical), P2 (High), P3 (Medium), P4 (Low) | S1 (Blocker), S2 (Critical), S3 (Major), S4 (Minor) |

**Combinations:**

| Combination | Example |
|-------------|---------|
| **High Severity + High Priority** | Payment gateway crashes — users can't pay |
| **High Severity + Low Priority** | App crashes on an obsolete browser (IE6) that no one uses |
| **Low Severity + High Priority** | Company logo is wrong on homepage — doesn't break anything but visible to everyone |
| **Low Severity + Low Priority** | Typo on the "About Us" page in footer |

---

## Q10. Bug Life Cycle?

```
New → Assigned → Open → Fixed → Retesting → Verified → Closed
                                    ↓
                                 Reopen → Assigned (cycle repeats)

Additional states:
- Rejected (not a bug)
- Deferred (fix in future release)
- Duplicate (same as existing bug)
- Not Reproducible (can't replicate)
```

---

## Q11. What is a Test Plan?

A **Test Plan** is a document that describes the scope, approach, resources, and schedule of testing activities.

**Key sections:**
1. **Test Scope** — what's in scope and out of scope
2. **Test Strategy** — types of testing (functional, regression, API, UI)
3. **Entry/Exit Criteria** — when to start/stop testing
4. **Test Environment** — OS, browsers, devices, URLs
5. **Test Deliverables** — test cases, reports, defect logs
6. **Roles & Responsibilities** — who does what
7. **Schedule** — timeline and milestones
8. **Risk & Mitigation** — potential risks and backup plans
9. **Tools** — Selenium, JIRA, Jenkins, REST Assured, etc.

---

## Q12. Entry Criteria vs Exit Criteria?

| Aspect | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| When | Before testing **starts** | Before testing **ends** |
| Purpose | Ensure readiness to begin testing | Ensure testing is complete enough to ship |

**Entry Criteria examples:**
- Requirements are reviewed and approved
- Test environment is set up and stable
- Test data is prepared
- Build is deployed and smoke-tested

**Exit Criteria examples:**
- All critical/high-priority test cases executed
- Defect density below threshold (e.g., 0 blocker/critical open bugs)
- 95%+ test cases passed
- Test summary report prepared and shared

---

# DATA-DRIVEN FRAMEWORK DESCRIPTION

"Our framework is a **Data-Driven Framework** using the **Page Object Model (POM)** design pattern with **Page Factory**.

**Architecture:**

```
framework/
├── src/main/java/
│   ├── pages/                    # Page Object classes
│   │   ├── BasePage.java         # Common methods (click, type, wait)
│   │   ├── LoginPage.java        # Login page locators + methods
│   │   └── DashboardPage.java
│   ├── base/
│   │   └── TestBase.java         # Driver init, config loading, implicit waits
│   ├── utils/
│   │   ├── TestUtil.java         # Reusable utilities (screenshots, waits, Excel reader)
│   │   └── ExtentReportManager.java
│   └── constants/
│       └── Constants.java
├── src/test/java/
│   ├── tests/
│   │   ├── LoginTest.java
│   │   └── SearchTest.java
│   └── listeners/
│       └── TestListener.java     # ITestListener for screenshots on failure
├── config/
│   └── config.properties         # Browser, URL, screenshots path
├── testdata/
│   └── controller.xlsx           # Test data (Apache POI)
├── screenshots/
├── reports/                      # Extent Reports HTML
├── pom.xml                       # Maven dependencies
├── testng.xml                    # Suite configuration
└── Jenkinsfile                   # CI/CD pipeline
```

**Key Components:**
| Component | Tool/Technology | Purpose |
|-----------|----------------|---------|
| Design Pattern | POM + Page Factory | Maintainability, reusability |
| Test Runner | TestNG | Assertions, grouping, parallel execution |
| Build Tool | Maven | Dependencies, execution via pom.xml |
| Test Data | Apache POI + controller.xlsx | Data-driven testing |
| Reporting | Extent Reports | HTML reports with screenshots |
| CI/CD | Jenkins | Nightly execution, scheduled runs |
| Version Control | Git + Bitbucket | Source code management |
| Screenshots | On failure — captured and added to Extent Report |"

---

# AUTOMATION FRAMEWORK COMPONENTS

## TestNG Framework Components:
1. **TestNG XML** (testng.xml) — Suite configuration
2. **Test classes** with TestNG annotations (@Test, @BeforeMethod, etc.) driven by BaseTest class
3. **Page Object package** — POM classes for each web page
4. **Maven pom.xml** — Dependencies and build configuration
5. **Data-driven mechanism** — Apache POI for Excel, or @DataProvider
6. **Reporting** — Extent Reports / Allure + log files (Log4j)
7. **Custom utilities** — Helper methods (waits, screenshots, Excel reader)
8. **Jenkinsfile** — CI/CD pipeline configuration

## Cucumber (BDD) Framework Components:
1. **Feature files** (.feature) — Gherkin scenarios
2. **Step Definition files** (.java) — Implementation of steps
3. **Test Runner file** — @CucumberOptions configuration
4. **Hooks file** — @Before / @After for setup/teardown
5. **Page Object package** — POM classes
6. **Reporting** — Cucumber HTML / Allure
7. **Custom utilities** — Helper methods
8. **Jenkinsfile** — CI/CD pipeline

---

# BDD CUCUMBER FRAMEWORK

## Gherkin Keywords:
- `Given` — Precondition / setup
- `When` — Action performed
- `Then` — Expected result / assertion
- `And` / `But` — Additional steps

## Key Concepts:

**Scenario:** Executes once with fixed values.

**Scenario Outline:** Executes multiple times with different data from `Examples` table.

**Background:** Common steps executed BEFORE every scenario in the feature file.

**Data Table:** Passes tabular data to a step. Accessed via `DataTable` object:
```java
List<Map<String, String>> data = dataTable.asMaps(String.class, String.class);
String username = data.get(0).get("Username");
String password = data.get(0).get("Password");
```

**Hooks:** Global setup/teardown using `@Before` and `@After` annotations.

**Cucumber Options:**
| Option | Purpose |
|--------|---------|
| `dryRun = true` | Validates step definitions exist without executing |
| `monochrome = true` | Cleaner console output |
| `features = "path"` | Path to feature files |
| `glue = "package"` | Package containing step definitions |
| `tags = "@smoke"` | Filter scenarios by tags |
| `plugin = {"pretty", "json:target/cucumber.json"}` | Report format |

## Feature File Example:
```gherkin
Feature: User Login

  Background:
    Given user launches chrome browser
    When user opens URL "https://www.example.com"

  Scenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials
    And clicks the login button
    Then the user should be logged in successfully

  Scenario Outline: Login with multiple users
    Given the user is on the login page
    When the user enters "<username>" and "<password>"
    And clicks the login button
    Then the user should see "<message>"

    Examples:
      | username | password | message            |
      | admin    | admin123 | Welcome Admin      |
      | user1    | pass123  | Welcome User       |
      | invalid  | wrong    | Invalid credentials |
```

## Step Definition Example:
```java
public class LoginSteps {

    LoginPage loginPage = new LoginPage(driver);

    @Given("the user is on the login page")
    public void userOnLoginPage() {
        loginPage.navigateToLogin();
    }

    @When("the user enters {string} and {string}")
    public void enterCredentials(String username, String password) {
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
    }

    @And("clicks the login button")
    public void clickLogin() {
        loginPage.clickLoginButton();
    }

    @Then("the user should see {string}")
    public void verifyMessage(String expectedMessage) {
        Assert.assertEquals(loginPage.getMessage(), expectedMessage);
    }
}
```

## Test Runner Example:
```java
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.project.stepdefinitions",
    plugin = {"pretty", "json:target/cucumber.json", "html:target/cucumber-report.html"},
    monochrome = true,
    dryRun = false,
    tags = "@smoke and not @skip"
)
public class TestRunner { }
```
