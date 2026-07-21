# REST Assured / API Testing Interview Questions
## Vikrant Mishra — SDET Interview Prep

> **Why API Testing matters for SDETs:** API testing is faster, more stable, and closer to the business logic than UI testing. At Aflac and PersonifyHealth, about 60% of my automation was API testing. Interviewers will ask you to explain REST Assured syntax, HTTP methods, status codes, and authentication. Know these well.

---

# API FUNDAMENTALS

---

## Q1. What is an API?

**Simple Answer:**
An API (Application Programming Interface) is a way for two software systems to talk to each other. In web development, an API is a URL (endpoint) that your application calls to get data or perform actions. Think of it as a waiter at a restaurant — you give the waiter an order (request), they go to the kitchen (server), and bring back your food (response).

**💬 How to say it in an interview:**
> "An API is an interface that allows two systems to communicate. In my work, I test REST APIs extensively — at PersonifyHealth, the backend exposes REST APIs that the mobile and web apps consume. My job as an SDET is to test those APIs directly using REST Assured — verifying that they return the correct data, the right status codes, and respond within the expected time."

**⚡ Key Points:**
- REST is the most common API type — uses HTTP, returns JSON
- SOAP is older, enterprise-grade, uses XML only
- GraphQL = client specifies exactly what data it needs
- gRPC = high-performance binary protocol, used in microservices

**API (Application Programming Interface)** is a computing interface that enables communication and data exchange between two separate software systems.

**Types:**
| Type | Protocol | Format | Description |
|------|----------|--------|-------------|
| **REST** | HTTP/HTTPS | JSON, XML | Stateless, lightweight, most popular |
| **SOAP** | HTTP, SMTP | XML only | Strict standards, WS-Security, enterprise |
| **GraphQL** | HTTP | JSON | Client specifies exact data needed |
| **gRPC** | HTTP/2 | Protocol Buffers | High performance, binary format |

**REST Principles:**
1. **Client-Server** architecture
2. **Stateless** — each request contains all info needed
3. **Cacheable** — responses can be cached
4. **Uniform Interface** — standard HTTP methods
5. **Layered System** — client doesn't know if talking to server or intermediary

## Q2. API vs Web Services?

**Simple Answer:**
All web services are APIs, but not all APIs are web services. A web service always requires a network/internet. An API can be a local library, a function call, or a web service. In interviews, just say: web services are a subset of APIs that always use a network.

| Aspect | API | Web Service |
|--------|-----|-------------|
| Scope | Broader — includes local APIs, library APIs | Subset of APIs |
| Internet | NOT always required | **Always** requires network/internet |
| Protocol | Any (HTTP, local function calls, etc.) | HTTP/SOAP/REST |
| Relationship | All web services are APIs | NOT all APIs are web services |

---

## Q3. URL Components?

**Simple Answer:**
A URL has 4 main parts: Protocol (https), Domain (reqres.in), Resource/Endpoint (/api/users), and Parameters (path params for specific resources like /2, query params for filtering like ?page=2). Knowing URL anatomy is essential for writing REST Assured tests.

**💬 How to say it in an interview:**
> "I always break down a URL into its components when writing test cases. The base URL is protocol + domain. Path parameters identify a specific resource — like /users/2 means user with ID 2. Query parameters are used for filtering and sorting — like ?page=2&sort=name. In REST Assured, I set the baseUri once in the RequestSpecification, then just write the path per test."

```
https://reqres.in/api/users/2?page=2&per_page=5
│        │          │       │  │
│        │          │       │  └─ Query Parameters (?key=value&key=value)
│        │          │       └──── Path Parameter (specific resource: user ID 2)
│        │          └──────────── Resource/Endpoint (/api/users)
│        └─────────────────────── Domain (reqres.in)
└──────────────────────────────── Protocol (https)

Base URL = Protocol + Domain = https://reqres.in
```

**Path Parameters vs Query Parameters:**
| Aspect | Path Parameter | Query Parameter |
|--------|---------------|-----------------|
| Purpose | Identify **specific resource** | **Filter/sort/paginate** resources |
| Required | Usually **yes** | Usually **optional** |
| Position | Part of URL path | After `?` in URL |
| Example | `/users/2` | `/users?page=2&sort=name` |

---

# HTTP METHODS

---

## Q4. HTTP Methods for API testing?

**Simple Answer:**
The 5 main HTTP methods: GET (fetch data), POST (create new), PUT (replace entire resource), PATCH (update part of resource), DELETE (remove). The most commonly tested are GET and POST. Idempotent means calling it multiple times has the same result as calling it once — GET, PUT, and DELETE are idempotent; POST is not.

**💬 How to say it in an interview:**
> "In my API testing, I write tests for all HTTP methods. GET tests verify data is returned correctly — right status code 200, correct JSON structure, correct values. POST tests verify creation — status 201, ID is returned in response, and the record actually exists in the database. DELETE tests verify status 204 (No Content). I always include both positive and negative tests for each endpoint."

**⚡ Key Points:**
- GET = read only, no body, safe and idempotent
- POST = create, has body, NOT idempotent (calling twice creates two records)
- PUT = full replace, must send all fields
- PATCH = partial update, send only changed fields
- DELETE = remove, returns 204 No Content on success

| Method | Purpose | Request Body | Idempotent | Safe |
|--------|---------|-------------|------------|------|
| **GET** | Retrieve data | No | Yes | Yes |
| **POST** | Create new resource | Yes | **No** | No |
| **PUT** | Update/Replace **entire** resource | Yes | Yes | No |
| **PATCH** | Update **partial** resource | Yes | **No** | No |
| **DELETE** | Delete resource | Optional | Yes | No |
| **OPTIONS** | Get server capabilities | No | Yes | Yes |
| **HEAD** | Like GET but no body (headers only) | No | Yes | Yes |

## Q5. PUT vs PATCH?

**Simple Answer:**
PUT replaces the ENTIRE resource — you must send all fields. PATCH updates ONLY the fields you send — everything else stays unchanged. Use PATCH when you only want to change one or two fields.

**💬 How to say it in an interview:**
> "PUT and PATCH both update resources but differently. PUT is a full replacement — if I send a PUT with just the name field, all other fields like email and role get wiped. PATCH is safer for partial updates — I only send the field I want to change. At Aflac, when updating a policy status, we used PATCH because we only needed to change the status field, not the entire policy object."

| Aspect | PUT | PATCH |
|--------|-----|-------|
| Updates | **Entire** resource (replace) | **Partial** resource (modify fields) |
| Missing fields | Set to null/default | Unchanged |
| Idempotent | Yes | No |
| Bandwidth | Higher (send full object) | Lower (send only changed fields) |

```json
// Original resource: {"name": "Vikrant", "email": "v@test.com", "role": "SDET"}

// PUT /users/1 — replaces entire resource
// Request: {"name": "Vikrant M", "email": "v@test.com", "role": "SDET"}
// All fields MUST be sent

// PATCH /users/1 — updates only specified fields
// Request: {"name": "Vikrant M"}
// Only changed field sent, others remain unchanged
```

---

# HTTP STATUS CODES

> **Study Tip:** Memorise the groups first: 2xx = success, 4xx = client error (your fault), 5xx = server error (their fault). Then memorise the specific codes: 200, 201, 204, 400, 401, 403, 404, 500.

**Simple Answer:**
HTTP Status Codes tell you what happened with your request. As an SDET, you MUST know these because every API test asserts a status code. The most important ones: 200 (success), 201 (created), 204 (deleted), 400 (bad request), 401 (not logged in), 403 (no permission), 404 (not found), 500 (server crashed).

| Code | Meaning | When You See It |
|------|---------|-----------------|
| **1xx — Informational** | |
| 100 | Continue | Server received request headers, client should send body |
| **2xx — Success** | |
| 200 | OK | GET/PUT/PATCH successful |
| 201 | Created | POST successful — new resource created |
| 204 | No Content | DELETE successful — no response body |
| **3xx — Redirection** | |
| 301 | Moved Permanently | URL changed permanently |
| 302 | Found (Temporary Redirect) | Temporary URL change |
| 304 | Not Modified | Cached version is still valid |
| **4xx — Client Error** | |
| 400 | Bad Request | Invalid JSON, missing required fields |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method for endpoint |
| 409 | Conflict | Duplicate resource, version conflict |
| 422 | Unprocessable Entity | Valid JSON but semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| **5xx — Server Error** | |
| 500 | Internal Server Error | Unexpected server failure |
| 502 | Bad Gateway | Invalid response from upstream server |
| 503 | Service Unavailable | Server overloaded/maintenance |
| 504 | Gateway Timeout | Upstream server timeout |

---

# REST ASSURED

---

## Q6. What is REST Assured?

**Simple Answer:**
REST Assured is a Java library for API testing. It uses a BDD-style syntax (Given-When-Then) that makes tests readable. Instead of writing raw HTTP client code, you write clean readable test steps. It integrates with TestNG, Maven, and Jenkins.

**💬 How to say it in an interview:**
> "REST Assured is my primary tool for API testing. I use it because it has a clean BDD syntax — Given sets up the request, When sends it, Then validates the response. It integrates perfectly with TestNG and Maven, supports all HTTP methods, has built-in JSON and XML parsing via JsonPath, and supports all authentication types. At PersonifyHealth, I built a full API test framework using REST Assured with RequestSpecBuilder for shared configuration — base URL, headers, and auth token set once and reused across all tests."

**⚡ Key Points:**
- REST Assured = Java library for API testing (not a standalone tool)
- BDD syntax: given() → when() → then()
- Built-in JSON parsing via JsonPath
- Supports Basic Auth, Bearer Token, OAuth 2.0
- Integrates with TestNG, JUnit, Maven, Jenkins

REST Assured is an **open-source Java library** used for testing and **validating** REST APIs / RESTful web services. Key features:
- Supports BDD syntax: **Given → When → Then**
- Validates HTTP responses (status code, headers, body, response time)
- Supports **JSON** and **XML** parsing and validation
- Integrates with **TestNG/JUnit**, Maven, Jenkins, Allure
- Supports all HTTP methods: GET, POST, PUT, PATCH, DELETE
- Built-in support for authentication (Basic, OAuth, Bearer)
- JSON Schema validation
- Serialization/Deserialization (POJO ↔ JSON via Jackson/Gson)

---

## Q7. REST Assured BDD Syntax?

**Simple Answer:**
REST Assured follows the BDD pattern: `given()` is where you set up the request (headers, auth, body), `when()` is where you send the request (GET, POST, etc.), and `then()` is where you validate the response (status code, body, headers).

**💬 How to say it in an interview:**
> "The BDD syntax in REST Assured makes tests self-documenting. given() is the precondition — I set the base URL, headers like Content-Type and Authorization, and the request body. when() is the action — I call .post(), .get(), etc. then() is the assertion — I verify status code, response body fields, response time. I always add .log().ifValidationFails() so I only see the request/response details when something goes wrong, not for every test."

```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

// BDD Syntax: Given → When → Then
given()       // PRECONDITION: setup request
    .baseUri("https://reqres.in")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + token)
    .queryParam("page", 2)
    .body(payload)
.when()        // ACTION: send request
    .post("/api/users")
.then()        // VALIDATION: assert response
    .statusCode(201)
    .body("name", equalTo("Vikrant"))
    .body("job", equalTo("SDET"))
    .time(lessThan(2000L))     // response time < 2s
    .header("Content-Type", containsString("json"))
    .log().all();              // log full response
```

---

## Q8. GET, POST, PUT, PATCH, DELETE examples?

**Simple Answer:**
These are the 5 HTTP method examples in REST Assured. The most frequently asked in interviews are GET (status 200, extract and verify JSON) and POST (status 201, verify created resource). Study these code patterns — you may be asked to write them.

```java
// GET Request
@Test
public void testGetUsers() {
    Response response = given()
        .baseUri("https://reqres.in")
        .queryParam("page", 2)
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .extract().response();

    // Extract values
    System.out.println("Status Code: " + response.getStatusCode());
    System.out.println("Body: " + response.getBody().asString());
    System.out.println("Header: " + response.getHeader("Content-Type"));
    System.out.println("Response Time: " + response.getTime() + "ms");
}

// POST Request
@Test
public void testCreateUser() {
    String payload = """
        {
            "name": "Vikrant",
            "job": "SDET"
        }
        """;

    given()
        .baseUri("https://reqres.in")
        .contentType(ContentType.JSON)
        .body(payload)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .body("name", equalTo("Vikrant"))
        .body("id", notNullValue());
}

// PUT Request (full update)
@Test
public void testUpdateUser() {
    String payload = """
        {
            "name": "Vikrant Updated",
            "job": "Lead SDET"
        }
        """;

    given()
        .baseUri("https://reqres.in")
        .contentType(ContentType.JSON)
        .body(payload)
    .when()
        .put("/api/users/2")
    .then()
        .statusCode(200)
        .body("name", equalTo("Vikrant Updated"));
}

// PATCH Request (partial update)
@Test
public void testPatchUser() {
    given()
        .baseUri("https://reqres.in")
        .contentType(ContentType.JSON)
        .body("{\"name\": \"Vikrant Patched\"}")
    .when()
        .patch("/api/users/2")
    .then()
        .statusCode(200);
}

// DELETE Request
@Test
public void testDeleteUser() {
    given()
        .baseUri("https://reqres.in")
    .when()
        .delete("/api/users/2")
    .then()
        .statusCode(204);  // No Content
}
```

---

## Q9. How to validate response?

**Simple Answer:**
In API testing, you validate: status code (most important), response body fields (specific values), response headers (Content-Type), and response time (SLA). REST Assured lets you do all of this in the `.then()` block. For complex validations, extract the response object and use JsonPath.

**💬 How to say it in an interview:**
> "My standard API validation checks four things: status code, body values, response headers, and response time. I use Hamcrest matchers in the then() block for inline assertions — equalTo(), notNullValue(), containsString(), greaterThan(). For complex JSON like nested objects or arrays, I extract the response and use jsonPath() to navigate the structure. I also validate JSON Schema for critical endpoints — this ensures the API contract never breaks even if individual values change."

**⚡ Key Points:**
- Always assert status code first
- Use JsonPath for extracting nested values
- Use JSON Schema validation for contract testing
- Assert response time < SLA (usually 2000ms)
- Use Hamcrest matchers: equalTo, notNullValue, containsString, hasSize

```java
Response response = given().baseUri("https://reqres.in").get("/api/users/2");

// 1. STATUS CODE
Assert.assertEquals(response.getStatusCode(), 200);

// 2. STATUS LINE
Assert.assertEquals(response.getStatusLine(), "HTTP/1.1 200 OK");

// 3. RESPONSE BODY — JsonPath
String name = response.jsonPath().getString("data.name");
int id = response.jsonPath().getInt("data.id");
String email = response.jsonPath().getString("data.email");
List<String> names = response.jsonPath().getList("data.name"); // for arrays

// 4. RESPONSE HEADERS
String contentType = response.getHeader("Content-Type");
Map<String, String> allHeaders = response.getHeaders().asList().stream()
    .collect(Collectors.toMap(Header::getName, Header::getValue));

// 5. RESPONSE TIME
long time = response.getTime();  // milliseconds
Assert.assertTrue(time < 2000, "Response too slow: " + time + "ms");

// 6. COOKIES
String sessionCookie = response.getCookie("session_id");
Map<String, String> allCookies = response.getCookies();

// 7. JSON SCHEMA VALIDATION
given().get("/api/users/2")
.then()
    .body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/user-schema.json"));

// 8. HAMCREST MATCHERS (chained validation)
given().get("/api/users?page=2")
.then()
    .body("data.size()", greaterThan(0))
    .body("data[0].email", containsString("@"))
    .body("data.id", everyItem(greaterThan(0)))
    .body("data.first_name", hasItems("Michael", "Lindsay"));
```

---

## Q10. Headers in API?

**Simple Answer:**
Headers are additional information sent alongside the HTTP request or response. The most important request headers: `Content-Type` (tells the server what format your body is in), `Authorization` (your authentication token), `Accept` (what format you want back). Think of headers as the envelope information — they describe the message without being the message itself.

**💬 How to say it in an interview:**
> "Headers are metadata that describe the request. The two I always set in my API tests are Content-Type: application/json (so the server knows I'm sending JSON) and Authorization with the Bearer token (for authenticated endpoints). In REST Assured, I set these once in a RequestSpecification and reuse it across all tests. I also validate response headers — particularly Content-Type to ensure the API is returning JSON and not HTML."

**Headers** are metadata sent with HTTP requests/responses as key-value pairs.

**Common Request Headers:**
| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Format of request body | `application/json` |
| `Accept` | Expected response format | `application/json` |
| `Authorization` | Authentication credentials | `Bearer eyJhbGci...` |
| `Cookie` | Session cookies | `session_id=abc123` |
| `User-Agent` | Client identification | `Mozilla/5.0...` |
| `Cache-Control` | Caching directives | `no-cache` |

**Common Response Headers:**
| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Format of response body | `application/json` |
| `Set-Cookie` | Set cookies on client | `session_id=abc123` |
| `X-Rate-Limit` | API rate limit info | `100` |
| `Location` | Redirect URL (with 301/302) | `/api/users/5` |

```java
// Set headers in Rest Assured
given()
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + token)
    .header("X-Custom-Header", "value")
.when()
    .get("/api/users");

// Validate response headers
.then()
    .header("Content-Type", containsString("json"))
    .header("X-Rate-Limit-Remaining", notNullValue());
```

---

## Q11. Payload / Request Body?

**Simple Answer:**
The payload (request body) is the data you send to the server with POST, PUT, and PATCH requests. The best approach for complex payloads is to use a POJO class — it auto-serialises to JSON and is easy to reuse and maintain.

**💬 How to say it in an interview:**
> "For simple payloads I use a String or HashMap. For complex payloads, I always use POJO classes with Jackson serialisation. I create a model class that mirrors the API request structure, set its fields, and pass it to .body(). REST Assured with Jackson automatically converts it to JSON. This approach is much cleaner than building a JSON string manually — no escaping issues, easy to read, and reusable across tests."

**The Payload/Body** contains the data sent to the server with POST, PUT, and PATCH requests.

**6 Ways to Pass Payload:**

```java
// 1. INLINE STRING
String payload = "{\"name\": \"Vikrant\", \"job\": \"SDET\"}";
given().body(payload).post("/users");

// 2. POJO (Plain Old Java Object) — PREFERRED for complex payloads
public class User {
    private String name;
    private String job;
    // getters, setters, constructors
}
User user = new User("Vikrant", "SDET");
given().body(user).post("/users");  // auto-serialized to JSON

// 3. EXTERNAL JSON FILE
File jsonFile = new File("src/test/resources/payload.json");
given().body(jsonFile).post("/users");

// 4. HASHMAP
Map<String, Object> body = new HashMap<>();
body.put("name", "Vikrant");
body.put("job", "SDET");
given().body(body).post("/users");

// 5. JSONObject (org.json library)
JSONObject json = new JSONObject();
json.put("name", "Vikrant");
json.put("job", "SDET");
given().body(json.toString()).post("/users");

// 6. FORM PARAMETERS (for form submissions)
given()
    .formParam("username", "vikrant")
    .formParam("password", "pass123")
.post("/login");
```

---

## Q12. Authentication vs Authorization?

**Simple Answer:**
- **Authentication (AuthN)** = proving WHO you are (login with username/password)
- **Authorization (AuthZ)** = what you are ALLOWED to do (admin can delete, user can only read)
- Authentication always happens FIRST. Authorization happens after.

**💬 How to say it in an interview:**
> "Authentication and Authorization are different concepts that often get confused. Authentication is about identity — are you who you say you are? That's the login step. Authorization is about permissions — you're logged in, but do you have permission to delete this record? In my API tests, I test both: I have positive tests with valid credentials (201 or 200), negative tests with no credentials (401 Unauthorized), and negative tests with valid credentials but insufficient permissions (403 Forbidden). These are called security-layer tests."

**⚡ Key Points:**
- 401 = Not authenticated (no token or invalid token)
- 403 = Authenticated but not authorised (valid token, wrong role)
- AuthN happens before AuthZ
- Most modern APIs use Bearer Token (JWT) for authentication

| Aspect | Authentication (AuthN) | Authorization (AuthZ) |
|--------|----------------------|---------------------|
| Question | **"Who are you?"** | **"What can you do?"** |
| Purpose | Verify **identity** | Verify **permissions** |
| Order | Happens **first** | Happens **after** authentication |
| Example | Login with username/password | Admin can delete, User can only read |

**Authentication Methods in REST Assured:**

```java
// 1. BASIC AUTH
given()
    .auth().basic("username", "password")
.get("/api/data");

// 2. PREEMPTIVE BASIC AUTH (sends credentials immediately)
given()
    .auth().preemptive().basic("username", "password")
.get("/api/data");

// 3. DIGEST AUTH
given()
    .auth().digest("username", "password")
.get("/api/data");

// 4. BEARER TOKEN (most common in modern APIs)
given()
    .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9...")
.get("/api/data");

// 5. OAUTH 2.0
given()
    .auth().oauth2(accessToken)
.get("/api/data");

// 6. API KEY (in header)
given()
    .header("X-API-Key", "your-api-key-here")
.get("/api/data");

// 7. API KEY (in query parameter)
given()
    .queryParam("api_key", "your-api-key-here")
.get("/api/data");
```

---

## Q13. Cookies in REST Assured?

**Simple Answer:**
Cookies are small pieces of data the server sends to the client, and the client sends back on every request. In API testing, you might need to pass a session cookie for authenticated requests, or extract a cookie from a login response and reuse it. REST Assured handles this with SessionFilter or manual cookie extraction.

```java
// SEND cookies with request
given()
    .cookie("session_id", "abc123")
    .cookie("token", "xyz789")
.get("/api/dashboard");

// EXTRACT cookies from response
Response response = given().post("/login");
String sessionId = response.getCookie("session_id");
Map<String, String> allCookies = response.getCookies();

// Use cookies in subsequent requests
given()
    .cookies(allCookies)
.get("/api/protected");

// Using SessionFilter (auto-manages cookies)
SessionFilter session = new SessionFilter();
given().filter(session)
    .body(loginPayload)
.post("/login");

// Subsequent requests auto-send cookies
given().filter(session)
.get("/api/protected");
```

---

## Q14. Positive vs Negative API scenarios?

**Simple Answer:**
Positive scenarios test that the API works correctly with valid input. Negative scenarios test that the API handles invalid/missing/wrong input gracefully — with the correct error status codes and meaningful error messages. As an SDET, you need BOTH. Interviewers always ask about this.

**💬 How to say it in an interview:**
> "For every endpoint I test, I write both positive and negative scenarios. Positive: valid request returns 200/201 with correct data. Negative: missing required field returns 400, no auth returns 401, wrong permissions returns 403, non-existent ID returns 404. At Aflac, I also tested boundary conditions — what happens with an extremely long string? What about SQL injection in a query parameter? The API should return 400, not expose database errors."

**⚡ Key Points:**
- Positive = valid input, verify correct response (200/201)
- Negative = invalid input, verify correct error code (400, 401, 403, 404)
- Always test: missing fields, wrong data types, no auth, expired token
- Security tests: SQL injection, extra-long strings should return 400 not 500

**Positive Scenarios:**
| # | Scenario | Validation |
|---|----------|------------|
| 1 | Valid GET request | Status 200, correct data returned |
| 2 | Valid POST with all required fields | Status 201, resource created |
| 3 | Valid PUT with complete data | Status 200, resource updated |
| 4 | Valid DELETE | Status 200/204 |
| 5 | Response within SLA time | Response < 2 seconds |
| 6 | Pagination works | Page 1 and Page 2 return different data |

**Negative Scenarios:**
| # | Scenario | Expected |
|---|----------|----------|
| 1 | Missing required fields | 400 Bad Request |
| 2 | Invalid data types (string where int expected) | 400 |
| 3 | No authentication | 401 Unauthorized |
| 4 | Valid auth but no permission | 403 Forbidden |
| 5 | Non-existent resource | 404 Not Found |
| 6 | Duplicate creation | 409 Conflict |
| 7 | Invalid JSON format | 400 |
| 8 | Exceeding field length limits | 400 |
| 9 | SQL injection in parameters | Should NOT return DB errors |
| 10 | Expired token | 401 |

---

## Q15. Logging in API testing?

**Simple Answer:**
REST Assured has built-in logging. The most useful option is `.log().ifValidationFails()` — it only logs the request and response when a test fails, keeping your console clean during passing tests.

**💬 How to say it in an interview:**
> "REST Assured's built-in logging is very powerful. I always add .log().ifValidationFails() to my tests so that when a test passes, the console is clean. When it fails, I get the full request and response automatically. For debugging, I temporarily switch to .log().all() to see everything. In my RequestSpecBuilder, I add a ResponseLoggingFilter so failures always show the full response regardless of what the test is checking."

REST Assured has **built-in logging** — you don't need Log4j for basic API logging.

```java
// Log request details
given()
    .log().all()          // logs everything (headers, body, params)
    .log().headers()      // logs only headers
    .log().body()         // logs only body
    .log().params()       // logs only parameters
.when()
    .get("/api/users");

// Log response details
.then()
    .log().all()          // logs full response
    .log().body()         // logs response body
    .log().status()       // logs status code
    .log().headers()      // logs response headers
    .log().ifError()      // logs only if status >= 400
    .log().ifStatusCodeIs(500); // logs only for specific code

// Log if validation fails
.then()
    .log().ifValidationFails()
    .statusCode(200);

// Using RequestSpecification for global logging
RequestSpecification spec = new RequestSpecBuilder()
    .addFilter(new RequestLoggingFilter())
    .addFilter(new ResponseLoggingFilter())
    .build();
```

---

## Q16. JSON Schema Validation?

**Simple Answer:**
JSON Schema validation checks that the API response STRUCTURE is correct — it verifies that required fields exist, that field types are correct (id should be integer, email should be string), and that the overall shape of the JSON matches a defined contract. This is called contract testing.

**💬 How to say it in an interview:**
> "JSON Schema validation is a level above just checking individual values. It validates the entire API contract — all required fields are present, all types are correct. At PersonifyHealth, after a backend release, the API contract could change without notice. I added JSON Schema validation to catch these breaking changes early. If a developer accidentally renames 'user_id' to 'userId', the schema validation catches it immediately in the test run, even if the values seem fine."

**⚡ Key Points:**
- Schema validation = contract testing (structure check, not just value check)
- Catches breaking changes early (renamed fields, changed types)
- Schema file is stored in src/test/resources/schemas/
- Use `JsonSchemaValidator.matchesJsonSchemaInClasspath()`

```java
// Add dependency in pom.xml:
// io.rest-assured:json-schema-validator

// Create schema file: src/test/resources/schemas/user-schema.json
/*
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "required": ["data"],
    "properties": {
        "data": {
            "type": "object",
            "required": ["id", "email", "first_name", "last_name"],
            "properties": {
                "id": { "type": "integer" },
                "email": { "type": "string", "format": "email" },
                "first_name": { "type": "string" },
                "last_name": { "type": "string" }
            }
        }
    }
}
*/

// Validate against schema
@Test
public void testJsonSchema() {
    given()
        .baseUri("https://reqres.in")
    .when()
        .get("/api/users/2")
    .then()
        .statusCode(200)
        .body(JsonSchemaValidator.matchesJsonSchemaInClasspath("schemas/user-schema.json"));
}
```

---

## Q17. JsonPath in REST Assured?

**Simple Answer:**
JsonPath is how you extract values from a JSON response. Use dot notation to navigate the structure: `data.first_name` gets the first_name field inside the data object. For arrays, use `data[0].email` to get the first element's email.

**💬 How to say it in an interview:**
> "I use JsonPath extensively to extract and validate specific fields from API responses. The syntax is like XPath but for JSON. For nested objects I use dot notation, for arrays I use index notation. The Groovy-based expressions like data.find{it.id==7} are powerful for filtering arrays — I use them when I need to find a specific object in an array without looping."

```java
Response response = given().get("https://reqres.in/api/users?page=2");

// Extract single value
String email = response.jsonPath().getString("data[0].email");
int id = response.jsonPath().getInt("data[0].id");

// Extract list
List<String> names = response.jsonPath().getList("data.first_name");
List<Integer> ids = response.jsonPath().getList("data.id");

// Extract map
Map<String, Object> user = response.jsonPath().getMap("data[0]");

// GPath expressions (Groovy-like)
response.jsonPath().getString("data.find { it.id == 7 }.email");
response.jsonPath().getList("data.findAll { it.id > 5 }.first_name");
response.jsonPath().getInt("data.max { it.id }.id");
response.jsonPath().getInt("data.size()");
```

---

## Q18. Error vs Exception in API testing?

**Simple Answer:**
- **Error** in API testing = the server returned an error status code (4xx or 5xx) — this is expected and testable
- **Exception** = something went wrong in your test code itself (network timeout, JSON parse error) — this is unexpected and needs to be handled in code

**💬 How to say it in an interview:**
> "In API testing, I distinguish between API errors and test exceptions. An API error is intentional — I send bad data and expect a 400 response. That's a test assertion, not a failure. A test exception is unplanned — the server is down, the network timed out, or the response JSON is malformed and can't be parsed. For those, I use try-catch in my test setup and fail the test with a meaningful message like 'Server unreachable — check environment' rather than a cryptic NullPointerException."

| Aspect | Error | Exception |
|--------|-------|-----------|
| **In API** | Server returns error status (4xx/5xx) | Network/parsing failure in test code |
| **Handling** | Validate expected error responses | try-catch in test code |
| **Example** | 404 Not Found, 500 Internal Server Error | `ConnectTimeoutException`, `JsonParseException` |
| **Who causes** | Client (4xx) or Server (5xx) | Test infrastructure/network |

```java
// Handling API errors (expected)
given().get("/api/users/99999")
.then()
    .statusCode(404)
    .body("error", equalTo("User not found"));

// Handling exceptions in test code
try {
    Response response = given()
        .baseUri("https://api.example.com")
        .get("/users");
} catch (ConnectException e) {
    System.out.println("Server unreachable: " + e.getMessage());
} catch (JsonParseException e) {
    System.out.println("Invalid JSON response: " + e.getMessage());
}
```

---

## Q19. Can you write an HTTP request without a URL or HTTP method?

**Simple Answer:**
No. Every HTTP request needs both. A URL tells the server WHERE to send the request. An HTTP method tells the server WHAT to do. Without either, the request is incomplete and cannot be sent.

**Without URL:** No. Every HTTP request requires a target address. Tools like telnet still need a host:port. In REST Assured, `baseUri` or full URL is mandatory.

**Without HTTP method:** Tools like `curl` and `wget` default to GET if no method is specified, but the HTTP method is still present in the actual request. In REST Assured, you must explicitly call `.get()`, `.post()`, etc.
