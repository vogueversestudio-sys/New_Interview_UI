# SQL Interview Questions
## Vikrant Mishra — SDET Interview Prep

> **Why SQL matters for SDETs:** In almost every SDET interview, SQL questions come up — because testers validate data in the database. After running automation tests, you need SQL to check whether the correct data was saved. Practice writing these queries by hand without looking at the answers.

---

## Q1. WHERE vs HAVING clause?

**Simple Answer:**
- `WHERE` filters individual rows BEFORE grouping
- `HAVING` filters groups AFTER `GROUP BY`
- Think of it this way: `WHERE` says "which rows to include", `HAVING` says "which groups to keep"

**Detailed Explanation:**

| Aspect | WHERE | HAVING |
|--------|-------|--------|
| What it filters | **Individual rows** before grouping | **Groups** after GROUP BY |
| Can use aggregate functions? | ❌ No (SUM, COUNT won't work here) | ✅ Yes |
| Execution order | Runs before GROUP BY | Runs after GROUP BY |
| Used with | SELECT, UPDATE, DELETE | Only with SELECT + GROUP BY |

```sql
-- WHERE: filter individual rows before grouping
SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE salary > 50000          -- filter rows first
GROUP BY department;

-- HAVING: filter groups after grouping
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;          -- filter groups that have more than 5 employees

-- Both together (most common in interviews)
SELECT department, AVG(salary) AS avg_sal
FROM employees
WHERE status = 'Active'       -- first: only active employees
GROUP BY department
HAVING AVG(salary) > 60000;   -- then: only departments with high average salary
```

**SQL Execution Order — Know This by Heart:**
```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

**💬 How to say it in an interview:**
> "WHERE and HAVING both filter data, but at different stages. WHERE runs before grouping — it filters individual rows. HAVING runs after GROUP BY — it filters the groups. For example, if I want to find departments where the average salary is above 60,000, I cannot use WHERE with AVG() because the grouping hasn't happened yet. That's where HAVING comes in. I use this a lot in database validation — for example, verifying that no duplicate orders were created for the same customer."

**⚡ Key Points:**
- WHERE = before GROUP BY, filters rows, no aggregate functions
- HAVING = after GROUP BY, filters groups, aggregate functions allowed
- SQL runs in this order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY

---

## Q2. SQL Joins?

**Simple Answer:**
JOINs are used to combine data from two tables based on a matching column. The most common is INNER JOIN (only matching rows). LEFT JOIN is the second most common (all rows from the left table, even if there's no match on the right).

**All Types with Code:**

```sql
-- 1. INNER JOIN: Only rows that match in BOTH tables
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- 2. LEFT JOIN: ALL rows from LEFT table + matching from RIGHT (NULL if no match)
-- USE THIS to find employees who have NO department
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

-- 3. RIGHT JOIN: ALL rows from RIGHT table + matching from LEFT
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;

-- 4. FULL OUTER JOIN: ALL rows from BOTH tables (NULL where no match)
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;

-- 5. CROSS JOIN: Every row × every row (Cartesian product)
SELECT e.name, d.dept_name
FROM employees e
CROSS JOIN departments d;
-- 10 employees × 5 departments = 50 rows result

-- 6. SELF JOIN: A table joined with ITSELF (manager-employee relationships)
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
JOIN employees e2 ON e1.manager_id = e2.id;
```

**Visual Quick Reference:**
```
INNER JOIN:   Only the overlap (matching rows only)
LEFT JOIN:    Everything from LEFT + overlap
RIGHT JOIN:   Everything from RIGHT + overlap
FULL JOIN:    Everything from both sides
```

**💬 How to say it in an interview:**
> "I use SQL JOINs regularly for database validation in my test automation. For example, at Aflac, after running an API test that creates a new insurance policy, I would run a SQL query using INNER JOIN between the policy table and customer table to verify the correct customer was linked to the policy. I use LEFT JOIN specifically when I want to find records that do NOT have a match — like finding orders that have no associated payment record."

**⚡ Key Points:**
- INNER JOIN = only matching rows (most common)
- LEFT JOIN = all from left + matches from right (use for "find records with no match")
- SELF JOIN = same table joined with itself (manager/employee, parent/child)
- Interview trick: "Employees with no department" = LEFT JOIN + WHERE dept IS NULL

---

## Q3. What are Aggregate Functions?

**Simple Answer:**
Aggregate functions take a bunch of rows and calculate a single summary value — like the total, average, minimum, or maximum. They always work with GROUP BY.

**All Aggregate Functions:**

| Function | What it Does | Example |
|----------|-------------|---------|
| `COUNT(*)` | Counts all rows | `SELECT COUNT(*) FROM employees;` |
| `COUNT(col)` | Counts non-NULL values only | `SELECT COUNT(salary) FROM employees;` |
| `SUM()` | Adds up all values | `SELECT SUM(salary) FROM employees;` |
| `AVG()` | Calculates the average | `SELECT AVG(salary) FROM employees;` |
| `MAX()` | Finds the highest value | `SELECT MAX(salary) FROM employees;` |
| `MIN()` | Finds the lowest value | `SELECT MIN(salary) FROM employees;` |

```sql
-- All together in one query (very common interview question)
SELECT department,
    COUNT(*)          AS total_employees,
    AVG(salary)       AS avg_salary,
    MAX(salary)       AS highest_salary,
    MIN(salary)       AS lowest_salary,
    SUM(salary)       AS total_salary_cost
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;
```

**💬 How to say it in an interview:**
> "I use aggregate functions a lot in database validation. For example, at Office Depot, after running a test that creates 10 orders, I would run a COUNT query to verify exactly 10 orders were inserted into the database. Or after a price update, I'd use SUM to verify the total order value matches the expected amount. COUNT(*) counts everything including NULLs, but COUNT(column) skips NULL values — that distinction trips people up."

**⚡ Key Points:**
- COUNT(*) counts ALL rows including NULLs; COUNT(column) skips NULLs
- NULL values are ignored in SUM, AVG, MAX, MIN — only COUNT(*) includes them
- Always use with GROUP BY when you need results per category

---

## Q4. What is GROUP BY?

**Simple Answer:**
GROUP BY takes rows that have the same value in a column and groups them together. You then apply an aggregate function (COUNT, SUM, AVG) to each group.

```sql
-- How many employees are in each department?
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department;

-- Average salary per department, highest first
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;

-- Group by multiple columns
SELECT department, job_title, COUNT(*) AS count
FROM employees
GROUP BY department, job_title;
```

**💬 How to say it in an interview:**
> "GROUP BY is something I use constantly for data validation. After a test run that creates records in the database, I use GROUP BY to count and verify. For example, at Aflac after creating 5 insurance claims for 3 different policy types, I'd GROUP BY policy_type and COUNT to confirm the right number of claims were created per type."

**⚡ Key Points:**
- Every column in SELECT that is NOT an aggregate function MUST be in GROUP BY
- GROUP BY runs before HAVING but after WHERE
- Use ORDER BY after GROUP BY to sort the results

---

## Q5. What is ORDER BY?

**Simple Answer:**
ORDER BY sorts the query results. By default it sorts from lowest to highest (ASC). Add DESC to sort from highest to lowest.

```sql
-- Ascending (lowest to highest — default)
SELECT * FROM employees ORDER BY salary ASC;

-- Descending (highest to lowest)
SELECT * FROM employees ORDER BY salary DESC;

-- Sort by multiple columns: first by department alphabetically, then by salary highest first
SELECT * FROM employees ORDER BY department ASC, salary DESC;

-- Sort by column position (2 = second column in SELECT)
SELECT name, salary FROM employees ORDER BY 2 DESC;
```

**💬 How to say it in an interview:**
> "ORDER BY is straightforward — I use it to sort results. In testing, I often use ORDER BY when writing validation queries to check whether the latest record was inserted correctly. For example: SELECT * FROM orders ORDER BY created_at DESC LIMIT 1 — this gives me the most recent order so I can verify it against what my automated test just created."

---

## Q6. How to handle NULL values?

**Simple Answer:**
NULL means "no value" or "unknown" — it is NOT zero, NOT empty string. You cannot check for NULL using `= NULL`. You must use `IS NULL` or `IS NOT NULL`.

```sql
-- Find employees with no manager assigned
SELECT * FROM employees WHERE manager_id IS NULL;

-- Find employees who DO have an email
SELECT * FROM employees WHERE email IS NOT NULL;

-- COALESCE: returns the FIRST non-NULL value in the list
-- Great for showing a default when data is missing
SELECT name, COALESCE(phone, email, 'No Contact Info') AS contact
FROM employees;

-- IFNULL (MySQL): replace NULL with a default value
SELECT name, IFNULL(salary, 0) AS salary FROM employees;

-- CASE: custom handling for NULL
SELECT name,
    CASE
        WHEN salary IS NULL THEN 'Salary Not Assigned'
        ELSE CAST(salary AS CHAR)
    END AS salary_status
FROM employees;

-- IMPORTANT: NULL in aggregations is automatically ignored
SELECT AVG(salary) FROM employees;   -- NULLs are excluded from the average
SELECT COUNT(salary) FROM employees; -- counts only NON-NULL salary rows
SELECT COUNT(*) FROM employees;      -- counts ALL rows INCLUDING those with NULL salary
```

**💬 How to say it in an interview:**
> "NULL handling is important in database testing. I always use IS NULL and IS NOT NULL — never = NULL, because NULL is not equal to anything, not even itself. In my tests at Aflac, I had a scenario where a claim was submitted without a doctor's name, which stored NULL in the provider_name column. I used COALESCE in my validation query to handle this gracefully — if provider_name is NULL, show 'Not Specified'. This prevented my test from failing on a valid business scenario."

**⚡ Key Points:**
- NULL ≠ 0 and NULL ≠ empty string. NULL means "no value"
- Always use `IS NULL` not `= NULL`
- COALESCE = returns first non-NULL value from a list
- COUNT(*) includes NULLs; COUNT(column) excludes NULLs

---

## Q7. How to remove duplicates?

**Simple Answer:**
Use `DISTINCT` to remove duplicates in a SELECT query. To find and delete actual duplicate rows from a table, use `ROW_NUMBER()` with a CTE — this is the most professional approach.

```sql
-- Quick way: DISTINCT in SELECT
SELECT DISTINCT department FROM employees;

-- Find WHICH rows are duplicates (see them before deleting)
SELECT *, ROW_NUMBER() OVER (
    PARTITION BY name, email    -- group by columns that define "duplicate"
    ORDER BY id                 -- keep the lowest ID (first inserted)
) AS row_num
FROM employees;
-- row_num > 1 means it's a duplicate

-- DELETE duplicates cleanly using CTE (most professional method)
WITH CTE AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY name, email ORDER BY id
    ) AS rn
    FROM employees
)
DELETE FROM CTE WHERE rn > 1;  -- delete all rows except the first occurrence
```

**💬 How to say it in an interview:**
> "Removing duplicates is a very common database validation task in testing. When I run automated tests that insert data, sometimes due to a bug, duplicate records get created. I first use ROW_NUMBER() with PARTITION BY to identify which rows are duplicates and see them. Then I use the CTE + DELETE approach to clean them up. I prefer this over DELETE with a subquery because the CTE is cleaner and easier to read and verify before running."

**⚡ Key Points:**
- DISTINCT = quick fix for SELECT queries
- ROW_NUMBER() + PARTITION BY = professional way to find and remove actual duplicate rows
- Always preview duplicates before deleting

---

## Q8. CASE Statement?

**Simple Answer:**
CASE is like an if-else statement in SQL. It checks a condition and returns different values based on the result. Very useful for labelling, categorising, or conditional updates.

```sql
-- Label employees by salary level
SELECT name, salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior Level'
        WHEN salary >= 60000  THEN 'Mid Level'
        WHEN salary >= 30000  THEN 'Junior Level'
        ELSE 'Intern'
    END AS salary_band
FROM employees;

-- Use CASE in UPDATE (update multiple rows with different values in one query)
UPDATE employees
SET bonus = CASE
    WHEN performance = 'Excellent' THEN salary * 0.20
    WHEN performance = 'Good'      THEN salary * 0.10
    ELSE salary * 0.05
END;

-- Use CASE in ORDER BY for custom sort order
SELECT * FROM employees
ORDER BY CASE department
    WHEN 'Engineering' THEN 1
    WHEN 'QA'          THEN 2
    WHEN 'Sales'       THEN 3
    ELSE 4
END;
```

**💬 How to say it in an interview:**
> "I use CASE statements in database validation queries to categorise data. For example, at Office Depot, I wrote a validation query that used CASE to label orders as 'Processing', 'Shipped', or 'Delivered' based on their status code — and then I asserted in my test that the newly created order was in 'Processing' status. It makes the output much more readable than raw status codes."

---

## Q9. What is CTE (Common Table Expression)?

**Simple Answer:**
A CTE is a temporary, named result set that you define at the top of your query using the `WITH` keyword. Think of it as giving a name to a subquery so your code is easier to read and reuse. It only exists for the duration of that single query.

```sql
-- Simple CTE: name a subquery so it's reusable
WITH active_employees AS (
    SELECT * FROM employees WHERE status = 'Active'
)
SELECT department, COUNT(*) AS count
FROM active_employees
GROUP BY department;

-- Multiple CTEs (chain them together)
WITH
dept_stats AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
),
high_earners AS (
    SELECT e.name, e.salary, d.avg_salary
    FROM employees e
    JOIN dept_stats d ON e.dept_id = d.dept_id
    WHERE e.salary > d.avg_salary    -- employees earning above their department average
)
SELECT * FROM high_earners ORDER BY salary DESC;

-- Recursive CTE: used for tree/hierarchy data (org chart, categories)
WITH RECURSIVE org_chart AS (
    -- Base case: top-level managers (no manager above them)
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: find everyone who reports to someone in the previous level
    SELECT e.id, e.name, e.manager_id, oc.level + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level;
```

**💬 How to say it in an interview:**
> "I prefer CTEs over nested subqueries because they are much easier to read, debug, and maintain. In my test validation queries, I often need multi-step logic — first filter active accounts, then find the ones with overdue payments. With CTEs, I can break this into clear steps that read like a story. It's much cleaner than putting one subquery inside another. The Nth highest salary problem is a classic example where CTE + DENSE_RANK is the cleanest solution."

**⚡ Key Points:**
- CTE = temporary named result set, lives only for one query
- Defined with `WITH name AS (SELECT ...)`
- Much cleaner alternative to deeply nested subqueries
- Recursive CTE = for hierarchical data (org charts, categories, file paths)

---

## Q10. RANK() vs DENSE_RANK() vs ROW_NUMBER()?

**Simple Answer:**
All three assign numbers to rows in order. The difference is what happens when two rows have the same value (a tie):
- `RANK()` skips numbers after a tie (1, 1, 3, 4)
- `DENSE_RANK()` does NOT skip numbers (1, 1, 2, 3)
- `ROW_NUMBER()` always gives a unique number, no ties (1, 2, 3, 4)

```sql
SELECT name, salary,
    RANK()       OVER (ORDER BY salary DESC) AS rank_val,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank_val,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees;
```

**Result Table — Study This Carefully:**

| name | salary | RANK | DENSE_RANK | ROW_NUMBER |
|------|--------|------|------------|------------|
| Alice | 100000 | 1 | 1 | 1 |
| Bob | 100000 | 1 | 1 | 2 |
| Charlie | 90000 | **3** ← skipped 2 | **2** ← no skip | 3 |
| Dave | 80000 | **4** | **3** | 4 |

**Which one to use for Nth highest salary?**
→ Always use `DENSE_RANK()` — it handles ties correctly and doesn't skip ranks.

```sql
-- Find the 3rd highest salary using DENSE_RANK
WITH ranked AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary FROM ranked WHERE rnk = 3;
```

**💬 How to say it in an interview:**
> "This is one of the most common SQL interview questions. The key difference is how they handle ties. If I use RANK() to find the 3rd highest salary, and two employees are tied for 1st, then rank 2 is skipped and the next one becomes rank 3 — which is actually the 3rd unique salary value, not the 3rd highest. That's why I always use DENSE_RANK() for the Nth highest salary problem — it never skips numbers, so rank 3 is always the 3rd unique value."

**⚡ Key Points:**
- RANK(): ties get same number, next number is SKIPPED (1, 1, 3)
- DENSE_RANK(): ties get same number, NO skip (1, 1, 2) ← use for Nth highest salary
- ROW_NUMBER(): always unique, no ties at all (1, 2, 3, 4)

---

## Q11. DELETE vs TRUNCATE vs DROP?

**Simple Answer:**
- `DELETE` = remove specific rows (can undo it)
- `TRUNCATE` = remove ALL rows quickly (usually cannot undo)
- `DROP` = destroy the entire table including its structure (cannot undo)

**Detailed Comparison:**

| Aspect | DELETE | TRUNCATE | DROP |
|--------|--------|----------|------|
| What is removed | Specific rows (or all rows with no WHERE) | All rows | Entire table (structure + data) |
| WHERE clause | ✅ Yes | ❌ No | ❌ No |
| Can rollback? | ✅ Yes (it's DML) | ❌ Usually No | ❌ No |
| Speed | Slower (logs each row) | Faster (deallocates pages) | Fastest |
| Fires triggers? | ✅ Yes | ❌ No | ❌ N/A |
| Resets auto-increment? | ❌ No | ✅ Yes | ❌ N/A |
| Table still exists after? | ✅ Yes | ✅ Yes | ❌ No |
| SQL type | DML | DDL | DDL |

```sql
DELETE FROM employees WHERE dept_id = 5;   -- remove only QA department rows
TRUNCATE TABLE employees;                   -- wipe the whole table, reset IDs
DROP TABLE employees;                       -- the table is gone completely
```

**💬 How to say it in an interview:**
> "In testing, I use DELETE in my test teardown — to clean up the specific test data I inserted during a test. For example, after creating a test user, I DELETE that specific record by ID. I avoid TRUNCATE in test environments because it removes everything and resets auto-increment. DROP is only used in setup scripts to recreate tables. The key thing interviewers want to hear is: DELETE can be rolled back in a transaction, but TRUNCATE usually cannot."

**⚡ Key Points:**
- DELETE = surgical, row-by-row, can roll back, can use WHERE
- TRUNCATE = wipe all rows, reset IDs, faster than DELETE, usually cannot roll back
- DROP = kills the whole table, gone forever, can't roll back

---

## Q12. LIKE Operator and Wildcards?

**Simple Answer:**
LIKE is used for partial text matching. The `%` symbol means "any number of characters" and `_` means "exactly one character."

```sql
SELECT * FROM employees WHERE name LIKE 'V%';         -- starts with V (e.g., Vikrant)
SELECT * FROM employees WHERE name LIKE '%kumar';      -- ends with kumar
SELECT * FROM employees WHERE name LIKE '%vik%';       -- contains "vik" anywhere
SELECT * FROM employees WHERE name LIKE '_i%';         -- second character is 'i'
SELECT * FROM employees WHERE email LIKE '%@gmail%';   -- gmail users
SELECT * FROM employees WHERE name LIKE '___';         -- exactly 3 characters (3 underscores)
```

**⚡ Key Points:**
- `%` = zero or more characters (any text)
- `_` = exactly one character
- `LIKE '%abc'` (leading wildcard) cannot use an index — slow on large tables
- Use `ILIKE` for case-insensitive matching in PostgreSQL

---

## Q13. Find Nth Highest Salary?

**Simple Answer:**
This is the most common SQL interview question for SDETs. Use `DENSE_RANK()` — it is the cleanest and handles duplicate salaries correctly.

```sql
-- BEST METHOD: DENSE_RANK (handles ties, clean, works everywhere)
WITH ranked_salaries AS (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary
FROM ranked_salaries
WHERE rnk = 3;   -- change 3 to find any Nth highest

-- METHOD 2: LIMIT/OFFSET (MySQL — quick but doesn't handle ties)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;   -- OFFSET 0=1st, 1=2nd, 2=3rd

-- METHOD 3: Subquery (works but less readable)
SELECT MAX(salary) FROM employees
WHERE salary < (
    SELECT MAX(salary) FROM employees   -- this gives 2nd highest
);

-- FOLLOW-UP: Nth highest salary PER DEPARTMENT (very common follow-up!)
SELECT name, department, salary FROM (
    SELECT name, department, salary,
           DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 2;   -- 2nd highest in each department
```

**💬 How to say it in an interview:**
> "For the Nth highest salary, I always use DENSE_RANK() in a CTE. Here's why: if two employees both earn 100,000, they both have rank 1. With DENSE_RANK, the next salary gets rank 2 — which correctly represents the 2nd highest unique salary. RANK() would skip rank 2 and give rank 3, which is wrong. I also know the department-wise Nth highest variation — that uses PARTITION BY department inside DENSE_RANK."

---

## Q14. Stored Procedure?

**Simple Answer:**
A stored procedure is a saved SQL program in the database that you can call by name. It's like a reusable function for SQL. You write it once and call it many times with different inputs.

```sql
-- Create a stored procedure that takes department name as input
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept_name VARCHAR(50))
BEGIN
    SELECT * FROM employees
    WHERE department = dept_name
    ORDER BY salary DESC;
END //
DELIMITER ;

-- Call it — like calling a function
CALL GetEmployeesByDept('Engineering');
CALL GetEmployeesByDept('QA');

-- Stored procedure with OUTPUT parameters
DELIMITER //
CREATE PROCEDURE GetDeptStats(
    IN  dept_name  VARCHAR(50),
    OUT emp_count  INT,
    OUT avg_salary DECIMAL(10,2)
)
BEGIN
    SELECT COUNT(*), AVG(salary)
    INTO emp_count, avg_salary
    FROM employees
    WHERE department = dept_name;
END //
DELIMITER ;
```

**Stored Procedure vs Function:**
| Aspect | Stored Procedure | Function |
|--------|-----------------|----------|
| Returns | 0 or more values via OUT parameters | Exactly 1 value (RETURN) |
| How to call | `CALL procedure_name()` | `SELECT function_name()` |
| Can modify data (INSERT/UPDATE/DELETE)? | ✅ Yes | ❌ Usually No |
| Can use inside SELECT? | ❌ No | ✅ Yes |

**💬 How to say it in an interview:**
> "In my API testing projects, I sometimes call stored procedures directly via JDBC or pyodbc to set up test data or verify backend state. For example, at Aflac, there was a stored procedure that calculated insurance premiums. Instead of going through the UI, I called it directly in my test to verify the calculation logic independently. This made my tests much faster and more focused."

---

## Q15. How to Optimise a SQL Query?

**Simple Answer:**
A slow SQL query usually means: too much data being scanned, missing indexes, or inefficient logic. These are the top fixes that will impress interviewers.

**Top 10 Optimisation Techniques:**

1. **Use Indexes** — add indexes on columns used in WHERE, JOIN ON, ORDER BY, GROUP BY
2. **SELECT only what you need** — never use `SELECT *` in production code
3. **Use EXPLAIN / EXPLAIN ANALYZE** — see how the database is executing your query
4. **Avoid functions on indexed columns** — `WHERE YEAR(created_at) = 2026` kills the index
5. **Use JOINs instead of correlated subqueries** — JOINs are almost always faster
6. **Avoid LIKE with a leading wildcard** — `LIKE '%abc'` cannot use an index
7. **Use EXISTS instead of IN** — faster for large subquery results
8. **Use LIMIT** — never fetch 10,000 rows if you only need 10
9. **Avoid DISTINCT if not needed** — it adds hidden sorting overhead
10. **Partition large tables** — split by date range or region for huge datasets

```sql
-- BAD: function on indexed column — cannot use the index
SELECT * FROM orders WHERE YEAR(order_date) = 2026;

-- GOOD: range query — uses the index on order_date
SELECT order_id, amount FROM orders
WHERE order_date >= '2026-01-01'
  AND order_date < '2027-01-01';

-- Check query plan
EXPLAIN SELECT * FROM employees WHERE department = 'QA';
```

**💬 How to say it in an interview:**
> "The first thing I do with a slow query is run EXPLAIN to see if it's doing a full table scan instead of using an index. At Office Depot, we had a product search query that was timing out. I ran EXPLAIN and saw it was scanning 2 million rows. I added a composite index on the search columns and the query went from 8 seconds to 200 milliseconds. The key rule I always follow: never apply a function to an indexed column in WHERE, because it makes the index useless."

---

## Q16. Indexing?

**Simple Answer:**
An index is like a book's index — instead of reading every page, you jump directly to the right page. It makes SELECT queries much faster, but slightly slows down INSERT/UPDATE/DELETE because the index also needs updating.

**Types of Indexes:**

| Type | Description | When to Use |
|------|-------------|------------|
| **Single-Column** | Index on one column | Frequently filtered/searched column |
| **Composite** | Index on multiple columns (order matters!) | Multiple columns always used together in WHERE |
| **Unique** | Enforces uniqueness + speeds up lookup | Email, username, employee ID |
| **Clustered** | Physically orders the table rows | Primary key (auto-created) |
| **Non-Clustered** | Separate structure with pointers to rows | Additional lookup columns |

```sql
CREATE INDEX idx_emp_name ON employees(name);
CREATE UNIQUE INDEX idx_emp_email ON employees(email);
CREATE INDEX idx_dept_salary ON employees(department, salary);  -- composite

SHOW INDEX FROM employees;         -- view all indexes on a table
DROP INDEX idx_emp_name ON employees;
```

**When NOT to create an index:**
- Very small tables (full scan is faster)
- Columns with many NULL values
- Columns that are rarely used in WHERE or JOIN
- Tables with very heavy INSERT/UPDATE/DELETE load (indexes slow down writes)

**💬 How to say it in an interview:**
> "I understand indexes from both a developer and tester perspective. When I write database validation queries in my tests, I make sure I'm not accidentally causing full table scans on production-size tables. I've added indexes to test databases to keep my validation queries fast. The key interview point is: indexes speed up reads but slow down writes — so you don't add an index on every column, only the ones that are frequently used in WHERE, JOIN, and ORDER BY."

---

## Q17. UNION vs UNION ALL?

**Simple Answer:**
Both combine results from two SELECT queries. `UNION` removes duplicates (slower). `UNION ALL` keeps everything including duplicates (faster).

| Aspect | UNION | UNION ALL |
|--------|-------|-----------|
| Duplicates | ❌ Removes duplicates (extra sort step) | ✅ Keeps all duplicates |
| Performance | Slower | **Faster** |
| Use when | You need unique results | You know there are no duplicates, or you want all rows |

```sql
-- UNION: removes duplicates — shows each name only once
SELECT name FROM employees_delhi
UNION
SELECT name FROM employees_pune;

-- UNION ALL: keeps duplicates — faster, no sorting
SELECT name FROM employees_delhi
UNION ALL
SELECT name FROM employees_pune;
```

**Important Rule:** Both SELECT statements must have the SAME number of columns with compatible data types.

**💬 How to say it in an interview:**
> "The rule is simple: UNION removes duplicates but is slower because it sorts the data. UNION ALL keeps everything and is faster. I use UNION ALL when I know the data sets don't overlap — like combining test results from two different test runs. I use UNION when I specifically need unique values, like getting a list of all unique email addresses from multiple tables."

---

## Q18. Subquery vs JOIN?

**Simple Answer:**
Both can get the same results, but JOINs are usually faster because the database can optimise them better. Subqueries are sometimes easier to read for simple cases. Use JOINs for large datasets and complex joins.

```sql
-- Subquery: find employees in the Engineering department
SELECT * FROM employees
WHERE dept_id IN (SELECT id FROM departments WHERE name = 'Engineering');

-- Same result with JOIN (usually faster on large tables)
SELECT e.* FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE d.name = 'Engineering';

-- Correlated subquery: re-executes for every row (SLOW — avoid on large tables)
SELECT name, salary FROM employees e1
WHERE salary > (
    SELECT AVG(salary) FROM employees e2
    WHERE e2.department = e1.department   -- references outer query
);

-- Better: use CTE or JOIN instead of correlated subquery
WITH dept_avg AS (
    SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department
)
SELECT e.name, e.salary
FROM employees e
JOIN dept_avg d ON e.department = d.department
WHERE e.salary > d.avg_sal;
```

**💬 How to say it in an interview:**
> "I prefer JOINs over subqueries for performance, but I use subqueries when the logic is simpler to read. The one I always avoid is a correlated subquery — where the inner query references the outer query — because it executes once for every row in the outer query, which can be extremely slow on large tables. I replace those with CTEs or JOINs."

---

## Q19. Find Names Starting with a Vowel?

**Simple Answer:**
Use `REGEXP` if your database supports it, or use `LIKE` with multiple conditions. The cleanest modern approach is REGEXP.

```sql
-- Method 1: REGEXP (MySQL/PostgreSQL) — cleanest
SELECT name FROM employees
WHERE name REGEXP '^[AEIOUaeiou]';

-- Method 2: SUBSTRING — works everywhere
SELECT name FROM employees
WHERE LOWER(SUBSTRING(name, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');

-- Method 3: Multiple LIKE — verbose but universally supported
SELECT name FROM employees
WHERE name LIKE 'A%' OR name LIKE 'E%' OR name LIKE 'I%'
   OR name LIKE 'O%' OR name LIKE 'U%';

-- Bonus: Names ending with a vowel
SELECT name FROM employees
WHERE LOWER(RIGHT(name, 1)) IN ('a', 'e', 'i', 'o', 'u');

-- Bonus: Names starting AND ending with a vowel
SELECT name FROM employees
WHERE LOWER(LEFT(name, 1))  IN ('a','e','i','o','u')
  AND LOWER(RIGHT(name, 1)) IN ('a','e','i','o','u');
```

---

## Q20. Find Duplicate Records?

**Simple Answer:**
Use GROUP BY + HAVING COUNT(*) > 1 to find which values are duplicated. To see the full duplicate rows with all their data, combine it with a subquery or JOIN.

```sql
-- Step 1: Which emails appear more than once?
SELECT email, COUNT(*) AS duplicate_count
FROM employees
GROUP BY email
HAVING COUNT(*) > 1;

-- Step 2: Show all the actual duplicate rows (with all columns)
SELECT * FROM employees
WHERE email IN (
    SELECT email FROM employees GROUP BY email HAVING COUNT(*) > 1
)
ORDER BY email;   -- group them together so duplicates appear side by side
```

**💬 How to say it in an interview:**
> "Finding duplicates is something I do regularly in database validation. After running a test that inserts data, I query for duplicates to make sure my test didn't accidentally create double records. GROUP BY + HAVING COUNT > 1 tells me which values are duplicated. The IN subquery then shows me all the actual rows so I can see the full details and decide which one to keep."

---

## Q21. Primary Key vs Foreign Key vs Unique Key?

**Simple Answer:**
- **Primary Key** = the unique identifier for each row — cannot be NULL, must be unique
- **Foreign Key** = a column that points to the Primary Key of another table — it links two tables together
- **Unique Key** = like Primary Key but allows one NULL value, and a table can have multiple Unique Keys

| Aspect | Primary Key | Foreign Key | Unique Key |
|--------|-------------|-------------|------------|
| Purpose | Uniquely identifies each row | Links two tables together | Ensures no duplicate values |
| NULL allowed? | ❌ Never | ✅ Yes | ✅ Yes (one NULL) |
| How many per table? | Only **1** | Multiple | Multiple |
| Duplicate values? | ❌ Not allowed | ✅ Allowed | ❌ Not allowed |
| Auto-creates index? | ✅ Yes (clustered) | Recommended | ✅ Yes (non-clustered) |

**💬 How to say it in an interview:**
> "Primary Key, Foreign Key, and Unique Key are the three main constraints. In my database validation, I often check referential integrity — meaning, if my test creates an order, the order's customer_id (Foreign Key) must point to a real customer_id in the customers table (Primary Key). If a test inserts an order with an invalid customer_id, the database should reject it. I verify this in negative test scenarios."

---

## Q22. Find Employees With No Department?

**Simple Answer:**
Use a LEFT JOIN between employees and departments, then filter where the department's ID is NULL. This finds employees who exist in the employees table but have no matching record in the departments table.

```sql
-- Find employees who don't belong to any department
SELECT e.*
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id
WHERE d.id IS NULL;    -- NULL means no match was found in departments table
```

**💬 How to say it in an interview:**
> "This is a classic 'find orphaned records' query. I use LEFT JOIN and then filter WHERE the joined table's column IS NULL. In testing, this is very useful — for example, finding orders that have no associated customer (data integrity violation), or finding test records that weren't cleaned up properly. It's one of the most practical SQL patterns in real testing work."

---

## Q23. Get Current Date and Time?

**Simple Answer:**
Different databases use different functions, but the concept is the same — get the current timestamp. In testing, you use this to validate that a record was created at the correct time.

```sql
SELECT NOW();                -- MySQL: returns 2026-07-21 11:22:00
SELECT CURRENT_DATE;         -- SQL standard: returns 2026-07-21 (date only)
SELECT CURRENT_TIMESTAMP;    -- SQL standard: returns date + time
SELECT GETDATE();            -- SQL Server
SELECT SYSDATE FROM DUAL;    -- Oracle
SELECT NOW()::DATE;          -- PostgreSQL: extract just the date part
```

**In Testing — How I Use This:**
```sql
-- Verify a record was created in the last 5 minutes (just now by my test)
SELECT * FROM orders
WHERE created_at >= NOW() - INTERVAL 5 MINUTE
ORDER BY created_at DESC;
```

---

## Q24. What is a View?

**Simple Answer:**
A View is a saved SQL query that you can use like a table. It doesn't store actual data — every time you query it, it runs the underlying SQL and gives you fresh results. Think of it as a shortcut to a complex query.

```sql
-- Create a view that shows only active employees and hides sensitive columns
CREATE VIEW active_employee_summary AS
SELECT id, name, department, job_title
FROM employees
WHERE status = 'Active';

-- Now use it like a normal table
SELECT * FROM active_employee_summary WHERE department = 'QA';
SELECT department, COUNT(*) FROM active_employee_summary GROUP BY department;

-- Drop a view
DROP VIEW active_employee_summary;
```

**Why Views are useful:**
- **Security:** Hide sensitive columns (like salary or SSN) from certain users
- **Simplicity:** Wrap a complex 5-table JOIN into one simple view name
- **Consistency:** All teams query the same view — no one writes the same complex query differently

**💬 How to say it in an interview:**
> "Views are useful for test data validation. At Aflac, I created a view that joined 4 tables — policy, customer, claims, and payments — into one clean view. All my test validation queries just selected from this view instead of writing the same complex JOIN every time. It made my SQL tests much shorter and easier to maintain."

---

## Q25. What is a Trigger?

**Simple Answer:**
A Trigger is an automatic action that runs when something happens to a table — like when a row is inserted, updated, or deleted. You don't call it manually; the database fires it automatically.

```sql
-- Create a trigger that automatically logs every salary change
CREATE TRIGGER log_salary_change
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF OLD.salary != NEW.salary THEN
        INSERT INTO salary_audit_log (
            emp_id, old_salary, new_salary, changed_by, changed_at
        )
        VALUES (
            NEW.id, OLD.salary, NEW.salary, CURRENT_USER(), NOW()
        );
    END IF;
END;
```

**Types of Triggers:**
- **BEFORE trigger** — runs before the INSERT/UPDATE/DELETE. Used to validate or modify data before it's saved.
- **AFTER trigger** — runs after the INSERT/UPDATE/DELETE. Used for audit logging, sending notifications.

**💬 How to say it in an interview:**
> "Triggers are important to understand from a testing perspective because they run automatically and can affect your test data in unexpected ways. At Aflac, there was a trigger on the payments table that automatically updated the policy status when a payment was inserted. When my test inserted a payment record, the trigger fired and changed the policy status — which then caused my policy status assertion to pass, even though I hadn't explicitly tested that flow. Understanding triggers helped me design better, more complete test scenarios."

**⚡ Key Points:**
- Trigger = automatic action on INSERT, UPDATE, or DELETE
- BEFORE = validate/modify before saving; AFTER = log/notify after saving
- As a tester, know that triggers exist — they can affect test data without you explicitly calling anything
