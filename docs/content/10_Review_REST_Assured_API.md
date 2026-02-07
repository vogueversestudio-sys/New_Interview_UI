# REST Assured / API Testing Interview Questions
## Vikrant Mishra — SDET Interview Prep

---

# API FUNDAMENTALS

---

## Q1. What is an API?

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

| Aspect | API | Web Service |
|--------|-----|-------------|
| Scope | Broader — includes local APIs, library APIs | Subset of APIs |
| Internet | NOT always required | **Always** requires network/internet |
| Protocol | Any (HTTP, local function calls, etc.) | HTTP/SOAP/REST |
| Relationship | All web services are APIs | NOT all APIs are web services |

---

## Q3. URL Components?

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

The **Payload/Body** contains the data sent to the server with POST, PUT, PATCH requests.

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

**Without URL:** No. Every HTTP request requires a target address. Tools like telnet still need a host:port. In REST Assured, `baseUri` or full URL is mandatory.

**Without HTTP method:** Tools like `curl` and `wget` default to GET if no method is specified, but the HTTP method is still present in the actual request. In REST Assured, you must explicitly call `.get()`, `.post()`, etc.
