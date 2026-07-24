# Agile, SDLC, STLC, Framework Architecture & BDD
## Vikrant Mishra — SDET Interview Prep

---

# SELF-INTRODUCTION

> **Tip:** Memorise this and say it confidently in the first 2 minutes. Keep it under 3 minutes. Practice it out loud every day.

"Hi, I'm Vikrant Mishra, a Senior SDET with over 8 years of experience across web, API, and biometric systems, specialising in test automation, API testing, and AI-assisted testing.

Right now I'm at Cloud Angles on the Personify Health platform, leading automation scripting and test strategy using Playwright, TypeScript, and REST Assured across both API and UI. I also mentor a QA automation team and use AI tools like Windsurf to speed up script development.

Before this, I spent two years at IDEMIA testing biometric systems — fingerprint, facial, and iris recognition. And earlier at Coforge, I work Selenium and Java frameworks for clients like Office Depot and Aflac.

My core stack is Selenium, Playwright, REST Assured, Java, and SQL. I'm now looking for a new role where I can bring this mix of hands-on automation and team leadership to a strong engineering team.

---

# AGILE METHODOLOGY

---

## Q1. What is Agile Methodology?

**Simple Answer:**
Agile mathology-Agile is an process thats managing projects and developing software that makes it easier for teams to deliver value product to their customers
Agile is a way of building software in small pieces (called sprints), instead of building everything at once. The team delivers working software every 2–4 weeks, gets feedback, and improves continuously.


**SDLC Phases (Software Development Life Cycle):**
1. Requirement Gathering & Analysis
2. Planning
3. Design
4. Development (Coding)
5. Testing
6. Deployment
7. Maintenance

**STLC Phases (Software Testing Life Cycle):**
1. Requirement Analysis — understand what needs to be tested
2. Test Planning — write the test plan, estimate effort
3. Test Case Design & Development — write test cases and scripts
4. Test Environment Setup — prepare servers, test data, tools
5. Test Execution — run the tests
6. Test Cycle Closure — defect summary, lessons learned

---

## Q2. Types of Agile Methodology?

**Simple Answer:**
The most popular in software teams is Scrum. Others like Kanban, SAFe(Scaled Agile Framework), and XP are used depending on team size and project type.
Scrum- 
1.Scrum is a popular agile methodology that provides a framework for managing and completing complex projects.	
2.Work is divided into 2-week sprints with roles including the Product Owner, Scrum Master, and Development Team; artifacts include the Product Backlog, Sprint Backlog, and Increment; ceremonies follow the sequence: Sprint Planning → Daily Standup → Sprint Review → Sprint Retrospective.
Kanban-
1-Kanban is another agile methodology that focuses on one task before starting another.
2-The goal of Kanban is to create a smooth and continuous flow of work.
3-Work flows continuously without fixed sprints using a visual board (To Do → In Progress → Testing → Done), focuses on limiting Work In Progress (WIP) to prevent overload, and is best suited for maintenance, support, and bug-fix teams

---

## Q3. What is Daily Stand-Up Meeting?

**Simple Answer:**
A 15-minute meeting held every morning where each team member answers 3 questions: what I did yesterday, what I'll do today, and any blockers. It keeps the whole team in sync.

**As a Senior SDET, what I typically report:**
- How many test cases I wrote or automated yesterday
- Which test run results I am investigating
- Any environment issues, test data problems, or API failures blocking testing
- Defect trends from the latest regression run

---
## Q4. Design patterns?
Design patterns are a set of reusable solutions to common problems that arise during the design and development of software
in test automation, popular patterns include Page Object Model (POM), Factory Pattern, and Singleton Pattern to improve code maintainability, reusability, and scalability.


---

## Q5. Sprint Planning vs Sprint Review vs Sprint Retrospective?

**Simple Answer:**
- **Sprint Planning** = at the START — decide what to build this sprint
- **Sprint Review** = at the END — show what was built
- **Sprint Retrospective** = after the review — discuss how to improve as a team

**Detailed Explanation:**

**Sprint Planning (Start of Sprint):**
- Duration: 2–4 hours for a 2-week sprint
- Attendees: Product Owner, Scrum Master, Dev Team
- Output: **Sprint Backlog** — list of committed user stories with tasks and estimates
- Team agrees on a **sprint goal** (e.g., "Complete the payment module end-to-end")
- As SDET: I estimate test effort for each story, identify automation candidates, raise any missing acceptance criteria

**Sprint Review (End of Sprint):**
- Duration: 1–2 hours
- Team **demos** completed work to stakeholders and the Product Owner
- PO accepts or rejects each story as **Done** or **Not Done**
- Feedback collected for future sprints
- As SDET: I show automation test results, coverage dashboards, and defect trends

**Sprint Retrospective (After Review):**
- Duration: 1 hour
- Three questions: What went **well**? What didn't go well? What can we **improve**?
- Output: Action items to make the next sprint better
- As SDET: I raise issues like flaky tests, missing test data, late requirement changes


---

## Q6. What are User Stories?

**Simple Answer:**
A user story is a requirement written from the user's perspective in plain English. It explains who needs something, what they need, and why — so the team understands the goal, not just the task.

**Format:** `"As a [role], I want [feature], so that [benefit]."`

**Example:** `"As a customer, I want to reset my password, so that I can regain access to my account."`

**💬 How to say it in an interview:**
> "As an SDET, I work very closely with user stories. During backlog grooming, I review the acceptance criteria and ask questions like — 'What happens if the user enters an invalid email format?' or 'Is there a character limit on this field?' These edge cases often get missed by developers if the QA doesn't raise them early. I also make sure every story has testable acceptance criteria before it enters the sprint — because if you can't test it, you can't say it's Done."

---

## Q7. Story Points?

**Simple Answer:**
Story points are a way to measure how much effort a task takes — not in hours, but in relative complexity. A task worth 3 points is roughly 3x harder than a 1-point task.
Story points consider three things: **complexity**, **volume of work**, and **uncertainty/risk**. Teams use the **Fibonacci scale**: 1, 2, 3, 5, 8, 13, 21 — because as work gets bigger, our estimates get less precise.

**⚡ Key Points:**
- Story points = effort, not time
- Fibonacci scale: 1, 2, 3, 5, 8, 13, 21
- As SDET, you estimate TEST effort separately from dev effort
- Planning Poker = team votes together to agree on points

---

## Q8. Verification vs Validation?

**Simple Answer:**
- **Verification** = checking the work WHILE building — "Are we following the process correctly?"
- **Validation** = checking the final product — "Does it actually work for the user?"

**💬 How to say it in an interview:**
> "I do both verification and validation in my work. Verification happens when I review requirements and test cases before execution — I'm checking that we have the right coverage and the right approach. Validation happens when I actually run the tests and verify the software does what the user needs. For example, at PersonifyHealth, during sprint review I would verify that our test cases covered all acceptance criteria, and then validate by showing the actual test execution results."


---

## Q9. Priority vs Severity?

**Simple Answer:**
- **Severity** = how badly the bug impacts the system (set by the QA/tester)
- **Priority** = how urgently it needs to be fixed (set by the business/PM)
- They are NOT the same thing — a serious bug can sometimes be low priority, and a minor bug can be high priority.



**The 4 Important Combinations — With Real Examples:**

| Combination | Real-World Example |
|-------------|-------------------|
| **High Severity + High Priority** | Payment gateway fails — users cannot complete purchases. Fix immediately. |
| **High Severity + Low Priority** | App crashes on Internet Explorer 6 — nobody uses IE6 anymore. Fix eventually. |
| **Low Severity + High Priority** | Company logo is missing on the homepage — doesn't break anything but looks bad to all users. Fix today. |
| **Low Severity + Low Priority** | Typo in the footer on the "About Us" page. Fix whenever convenient. |

---

## Q10. Bug Life Cycle?

**Simple Answer:**
A bug goes through a journey from the moment it is found until it is fixed and confirmed closed. This journey has clear states, and as a QA, you own the bug from start to end.

**Detailed Explanation:**

```
New → Assigned → Open → In Progress → Fixed → Ready for Retest
                                                      ↓
                                               Retest by QA
                                              ↙           ↘
                                          Pass             Fail
                                            ↓                ↓
                                         Verified          Reopen → Assigned (cycle repeats)
                                            ↓
                                         Closed


**💬 How to say it in an interview:**
> "I manage the full bug life cycle in JIRA. When I find a bug, I log it with detailed steps to reproduce, expected vs actual result, screenshots, and a severity label. After the developer fixes it, they move it to 'Fixed' and I retest it. At Aflac, I had a critical payment bug that was marked 'Cannot Reproduce' by the developer. I recorded a video of the exact steps, attached the API response logs, and provided the test data — within 2 hours they reproduced it and it became a P1 fix."


---

## Q11. What is a Test Plan?

**Simple Answer:**
A Test Plan is a document that defines the entire testing strategy for a project — what will be tested, how, by whom, and when. It is the roadmap for the QA team.
A Test Plan is a formal document that covers the complete testing strategy. It is written by the **QA Lead or Senior SDET** at the beginning of the project

---

## Q12. Entry Criteria vs Exit Criteria?

**Simple Answer:**
- **Entry Criteria** = the checklist of things that must be ready BEFORE testing starts
- **Exit Criteria** = the checklist of things that must be achieved BEFORE testing is signed off


**⚡ Key Points:**
- Entry Criteria = gates before testing starts (incomplete = don't start testing)
- Exit Criteria = gates before you say "ready to release"

-------------------------------------------------------------------------------------------

# DATA-DRIVEN FRAMEWORK DESCRIPTION

> **Tip:** This is one of the most important questions in any SDET interview. Be ready to draw the folder structure on a whiteboard or describe it verbally. Practice saying it out loud 5 times before your interview.

**Simple Answer:**
My framework is built using Java, Selenium WebDriver, and TestNG. It follows the Page Object Model pattern — which means each page of the website has its own class. Test data comes from Excel files, so the same test runs with hundreds of different inputs automatically. Jenkins runs the tests automatically every night.

**Full Framework Description (Say This in the Interview):**
> "My framework is a **Hybrid Data-Driven Framework** built using **Java, Selenium WebDriver 4, TestNG, and Maven**. It follows the **Page Object Model (POM)** design pattern using **Page Factory** to separate test logic from page interactions.
>
> For test data, I use **Apache POI** to read from Excel files — so one test method can run with 50 different data sets automatically. For reporting, I use **Extent Reports** which generate HTML reports with screenshots attached on failure. The whole thing is connected to **Jenkins** which runs a full regression suite every night and on every Bitbucket pull request. Screenshots are automatically captured on failure and attached to the report."

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

**Simple Answer:**
BDD (Behaviour-Driven Development) means writing test cases in plain English using Given-When-Then format. This is so non-technical people (business analysts, product owners) can also read and understand what is being tested. Cucumber is the tool that connects the plain English test to the actual Java code.

**💬 How to say it in an interview:**
> "In my projects, I have worked with both TestNG-based frameworks and BDD Cucumber frameworks. With Cucumber, the feature files are written in plain English using Given-When-Then syntax — this is great for projects where business stakeholders want to understand what's being tested without reading code. The developer writes the feature file with the business analyst, and I implement the step definitions in Java. At Office Depot, we used Cucumber for the checkout flow because the product owner wanted to review the test scenarios directly."

**⚡ Key Points:**
- BDD = behaviour-driven, written in plain English, business-readable
- Cucumber = the BDD tool; Gherkin = the language (Given/When/Then)
- Feature files = plain English; Step Definitions = actual Java code
- Non-technical people can read feature files — that is the whole point

## Gherkin Keywords:
- `Given` — Precondition / setup (e.g., "Given the user is on the login page")
- `When` — Action performed (e.g., "When the user enters valid credentials")
- `Then` — Expected result / assertion (e.g., "Then the user should see the dashboard")
- `And` / `But` — Additional steps to avoid repeating Given/When/Then

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
