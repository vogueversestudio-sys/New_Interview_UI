# SQL Interview Questions
## Vikrant Mishra — SDET Interview Prep

---

## Q1. WHERE vs HAVING clause?

| Aspect | WHERE | HAVING |
|--------|-------|--------|
| Filters | **Individual rows** before grouping | **Groups** after GROUP BY |
| Aggregate functions | Cannot use (SUM, COUNT, etc.) | Can use aggregate functions |
| Execution order | Before GROUP BY | After GROUP BY |
| Used with | SELECT, UPDATE, DELETE | Only with SELECT + GROUP BY |

```sql
-- WHERE: filter rows before grouping
SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE salary > 50000
GROUP BY department;

-- HAVING: filter groups after grouping
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;

-- Both together
SELECT department, AVG(salary) AS avg_sal
FROM employees
WHERE status = 'Active'
GROUP BY department
HAVING AVG(salary) > 60000;
```

**SQL Execution Order:**
```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## Q2. SQL Joins?

```sql
-- 1. INNER JOIN: Only matching rows from both tables
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- 2. LEFT JOIN: All from LEFT + matching from RIGHT (NULL if no match)
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

-- 3. RIGHT JOIN: All from RIGHT + matching from LEFT
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;

-- 4. FULL OUTER JOIN: All from BOTH (NULL where no match)
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;

-- 5. CROSS JOIN: Cartesian product (every row × every row)
SELECT e.name, d.dept_name
FROM employees e
CROSS JOIN departments d;
-- If employees has 10 rows and departments has 5, result = 50 rows

-- 6. SELF JOIN: Table joined with itself
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
JOIN employees e2 ON e1.manager_id = e2.id;
```

**Visual:**
```
LEFT JOIN:    [ALL LEFT] + [matching RIGHT]
RIGHT JOIN:   [matching LEFT] + [ALL RIGHT]
INNER JOIN:   [matching LEFT] + [matching RIGHT]
FULL JOIN:    [ALL LEFT] + [ALL RIGHT]
```

---

## Q3. What are Aggregate Functions?

Aggregate functions perform calculations on a set of values and return a single value.

| Function | Purpose | Example |
|----------|---------|---------|
| `COUNT()` | Number of rows | `SELECT COUNT(*) FROM employees;` |
| `SUM()` | Total of values | `SELECT SUM(salary) FROM employees;` |
| `AVG()` | Average value | `SELECT AVG(salary) FROM employees;` |
| `MAX()` | Maximum value | `SELECT MAX(salary) FROM employees;` |
| `MIN()` | Minimum value | `SELECT MIN(salary) FROM employees;` |

```sql
SELECT department,
    COUNT(*) AS total_employees,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary,
    SUM(salary) AS total_salary
FROM employees
GROUP BY department;
```

---

## Q4. What is GROUP BY?

`GROUP BY` groups rows that have the same values into summary rows. It is used with aggregate functions.

```sql
-- Count employees per department
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department;

-- Average salary per department, ordered highest first
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;

-- GROUP BY multiple columns
SELECT department, designation, COUNT(*) AS count
FROM employees
GROUP BY department, designation;
```

---

## Q5. What is ORDER BY?

`ORDER BY` sorts the result set by one or more columns.

```sql
-- Ascending (default)
SELECT * FROM employees ORDER BY salary ASC;

-- Descending
SELECT * FROM employees ORDER BY salary DESC;

-- Multiple columns
SELECT * FROM employees ORDER BY department ASC, salary DESC;

-- By column position
SELECT name, salary FROM employees ORDER BY 2 DESC;  -- 2 = salary column
```

---

## Q6. How to handle NULL values?

```sql
-- 1. IS NULL / IS NOT NULL
SELECT * FROM employees WHERE manager_id IS NULL;
SELECT * FROM employees WHERE email IS NOT NULL;

-- 2. COALESCE — returns first non-null value
SELECT name, COALESCE(phone, email, 'No Contact') AS contact
FROM employees;

-- 3. IFNULL (MySQL) / ISNULL (SQL Server)
SELECT name, IFNULL(salary, 0) AS salary FROM employees;        -- MySQL
SELECT name, ISNULL(salary, 0) AS salary FROM employees;        -- SQL Server

-- 4. NVL (Oracle)
SELECT name, NVL(salary, 0) AS salary FROM employees;

-- 5. CASE statement
SELECT name,
    CASE
        WHEN salary IS NULL THEN 'Not Assigned'
        ELSE CAST(salary AS VARCHAR)
    END AS salary_status
FROM employees;

-- 6. NULL in aggregations — automatically ignored
SELECT AVG(salary) FROM employees;   -- NULLs excluded from calculation
SELECT COUNT(salary) FROM employees; -- counts only non-NULL
SELECT COUNT(*) FROM employees;      -- counts ALL rows including NULL
```

**Important:** `NULL != NULL` → You CANNOT use `= NULL` or `!= NULL`. Always use `IS NULL` / `IS NOT NULL`.

---

## Q7. How to remove duplicates?

```sql
-- Method 1: DISTINCT
SELECT DISTINCT department FROM employees;

-- Method 2: GROUP BY
SELECT department, COUNT(*) FROM employees GROUP BY department;

-- Method 3: ROW_NUMBER() — find duplicate rows
SELECT *, ROW_NUMBER() OVER (
    PARTITION BY name, email ORDER BY id
) AS row_num
FROM employees;

-- Method 4: Delete actual duplicate rows (keep first occurrence)
DELETE FROM employees
WHERE id NOT IN (
    SELECT MIN(id) FROM employees GROUP BY name, email
);

-- Method 5: CTE + ROW_NUMBER (cleanest approach)
WITH CTE AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY name, email ORDER BY id
    ) AS rn
    FROM employees
)
DELETE FROM CTE WHERE rn > 1;
```

---

## Q8. CASE statement?

```sql
-- Simple CASE
SELECT name, salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 60000 THEN 'Mid-Level'
        WHEN salary >= 30000 THEN 'Junior'
        ELSE 'Intern'
    END AS level
FROM employees;

-- CASE in UPDATE
UPDATE employees
SET bonus = CASE
    WHEN performance = 'Excellent' THEN salary * 0.20
    WHEN performance = 'Good' THEN salary * 0.10
    ELSE salary * 0.05
END;

-- CASE in ORDER BY
SELECT * FROM employees
ORDER BY CASE department
    WHEN 'Engineering' THEN 1
    WHEN 'Sales' THEN 2
    ELSE 3
END;
```

---

## Q9. What is CTE (Common Table Expression)?

A **CTE** is a temporary named result set defined within a `WITH` clause, available only for the duration of that query.

```sql
-- Simple CTE
WITH active_employees AS (
    SELECT * FROM employees WHERE status = 'Active'
)
SELECT department, COUNT(*) AS count
FROM active_employees
GROUP BY department;

-- Multiple CTEs
WITH
dept_stats AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
),
high_paid AS (
    SELECT e.*, d.avg_salary
    FROM employees e
    JOIN dept_stats d ON e.dept_id = d.dept_id
    WHERE e.salary > d.avg_salary
)
SELECT * FROM high_paid;

-- Recursive CTE (org hierarchy)
WITH RECURSIVE org_chart AS (
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, oc.level + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level;
```

---

## Q10. RANK() vs DENSE_RANK() vs ROW_NUMBER()?

```sql
SELECT name, salary,
    RANK() OVER (ORDER BY salary DESC) AS rank_val,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank_val,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees;
```

| name | salary | RANK | DENSE_RANK | ROW_NUMBER |
|------|--------|------|------------|------------|
| Alice | 100000 | 1 | 1 | 1 |
| Bob | 100000 | 1 | 1 | 2 |
| Charlie | 90000 | **3** | **2** | 3 |
| Dave | 80000 | **4** | **3** | 4 |

**Key Difference:**
- `RANK()`: **Skips** numbers after ties → 1, 1, **3**, 4
- `DENSE_RANK()`: **No gaps** after ties → 1, 1, **2**, 3
- `ROW_NUMBER()`: Unique number for each row, no ties → 1, 2, 3, 4

---

## Q11. DELETE vs TRUNCATE vs DROP?

| Aspect | DELETE | TRUNCATE | DROP |
|--------|--------|----------|------|
| Type | DML | DDL | DDL |
| Removes | Specific rows | All rows | Entire table (structure + data) |
| WHERE clause | Yes | No | No |
| Rollback | Yes (within transaction) | No (most DBs) | No |
| Speed | Slower (row-by-row) | Faster (deallocates pages) | Fastest |
| Triggers | Fires triggers | Does NOT fire triggers | N/A |
| Auto-increment | NOT reset | Reset to seed | N/A |
| Table exists after? | Yes | Yes | **No** |

```sql
DELETE FROM employees WHERE dept_id = 5;  -- deletes specific rows
TRUNCATE TABLE employees;                  -- removes ALL rows, resets identity
DROP TABLE employees;                      -- removes entire table
```

---

## Q12. LIKE operator and Wildcards?

**LIKE** is used for **pattern matching** in strings.

**Wildcards:**
- `%` = zero or more characters
- `_` = exactly one character

```sql
SELECT * FROM employees WHERE name LIKE 'V%';        -- starts with V
SELECT * FROM employees WHERE name LIKE '%kumar';     -- ends with kumar
SELECT * FROM employees WHERE name LIKE '_i%';        -- 2nd char is 'i'
SELECT * FROM employees WHERE email LIKE '%@gmail%';  -- contains @gmail
SELECT * FROM employees WHERE name LIKE '___';        -- exactly 3 characters
```

---

## Q13. Find Nth highest salary?

```sql
-- Method 1: DENSE_RANK (BEST for interviews)
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 3;  -- 3rd highest

-- Method 2: CTE
WITH ranked AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary FROM ranked WHERE rnk = 3;

-- Method 3: LIMIT/OFFSET (MySQL)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;  -- 3rd highest (0-indexed offset)

-- Method 4: Subquery
SELECT MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
-- This gives 2nd highest

-- Method 5: Department-wise Nth highest (common follow-up)
SELECT * FROM (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

---

## Q14. Stored Procedure?

A **stored procedure** is a precompiled collection of SQL statements stored in the database that can be called by name.

```sql
-- Create stored procedure
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept_name VARCHAR(50))
BEGIN
    SELECT * FROM employees
    WHERE department = dept_name
    ORDER BY salary DESC;
END //
DELIMITER ;

-- Call it
CALL GetEmployeesByDept('Engineering');

-- Stored procedure with OUTPUT
DELIMITER //
CREATE PROCEDURE GetDeptStats(
    IN dept_name VARCHAR(50),
    OUT emp_count INT,
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
| Return | 0 or more values via OUT params | Must return exactly 1 value |
| Call | CALL procedure() | SELECT function() |
| DML allowed | Yes (INSERT, UPDATE, DELETE) | Usually No (read-only) |
| Use in SELECT | No | Yes |

---

## Q15. How to optimize SQL query?

1. **Use Indexes** on columns in WHERE, JOIN, ORDER BY, GROUP BY
2. **SELECT only needed columns** — avoid `SELECT *`
3. **Use EXPLAIN/EXPLAIN ANALYZE** to check query execution plan
4. **Avoid functions on indexed columns** — `WHERE YEAR(date) = 2026` won't use index
5. **Use JOINs instead of subqueries** where possible
6. **Limit results** — use LIMIT/TOP for large datasets
7. **Avoid LIKE with leading wildcard** — `LIKE '%abc'` can't use index
8. **Use EXISTS instead of IN** for large subqueries
9. **Avoid DISTINCT if not needed** — adds sorting overhead
10. **Partition large tables** — split by date/region

```sql
-- BAD
SELECT * FROM orders WHERE YEAR(order_date) = 2026;

-- GOOD (index-friendly)
SELECT order_id, amount FROM orders
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';
```

---

## Q16. Indexing?

An **index** is a data structure that improves the speed of data retrieval on a table at the cost of slower writes.

| Type | Description |
|------|-------------|
| **Single-Column** | Index on one column |
| **Composite** | Index on multiple columns (order matters) |
| **Unique** | Enforces uniqueness |
| **Clustered** | Determines physical order of data (1 per table) |
| **Non-Clustered** | Separate structure pointing to data (multiple per table) |
| **Full-Text** | For text searching |

```sql
CREATE INDEX idx_emp_name ON employees(name);
CREATE UNIQUE INDEX idx_emp_email ON employees(email);
CREATE INDEX idx_emp_dept_sal ON employees(department, salary);  -- composite

SHOW INDEX FROM employees;
DROP INDEX idx_emp_name ON employees;
```

**When NOT to use indexes:**
- Small tables
- Columns with many NULLs
- Columns rarely used in WHERE
- Tables with heavy INSERT/UPDATE (indexes slow down writes)

---

## Q17. UNION vs UNION ALL?

| Aspect | UNION | UNION ALL |
|--------|-------|-----------|
| Duplicates | **Removes** duplicates | **Keeps** duplicates |
| Performance | Slower (sorts to remove dups) | **Faster** (no sorting) |
| Use when | Need unique results | Need all results / know no dups |

```sql
-- UNION: removes duplicates
SELECT name FROM employees_delhi
UNION
SELECT name FROM employees_pune;

-- UNION ALL: keeps duplicates (faster)
SELECT name FROM employees_delhi
UNION ALL
SELECT name FROM employees_pune;
```

**Rule:** Both SELECT statements must have same number of columns with compatible data types.

---

## Q18. Subquery vs JOIN?

```sql
-- Subquery (nested query)
SELECT * FROM employees
WHERE dept_id IN (SELECT id FROM departments WHERE name = 'Engineering');

-- Equivalent JOIN (usually faster)
SELECT e.* FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE d.name = 'Engineering';
```

**Types of subqueries:**
- **Scalar** — returns single value: `SELECT (SELECT MAX(salary) FROM employees)`
- **Row** — returns single row
- **Table** — returns multiple rows (used with IN, EXISTS, ANY, ALL)
- **Correlated** — references outer query (re-executes for each row)

---

## Q19. Names starting with vowel?

```sql
-- Method 1: SUBSTRING + IN
SELECT name FROM employees
WHERE LOWER(SUBSTRING(name, 1, 1)) IN ('a', 'e', 'i', 'o', 'u');

-- Method 2: REGEXP (MySQL)
SELECT name FROM employees
WHERE name REGEXP '^[AEIOUaeiou]';

-- Method 3: LIKE
SELECT name FROM employees
WHERE name LIKE 'A%' OR name LIKE 'E%' OR name LIKE 'I%'
   OR name LIKE 'O%' OR name LIKE 'U%';

-- Names ending with vowel
SELECT name FROM employees
WHERE LOWER(RIGHT(name, 1)) IN ('a', 'e', 'i', 'o', 'u');

-- Names starting AND ending with vowel
SELECT name FROM employees
WHERE LOWER(SUBSTRING(name, 1, 1)) IN ('a','e','i','o','u')
  AND LOWER(RIGHT(name, 1)) IN ('a','e','i','o','u');
```

---

## Q20. Find duplicate records?

```sql
-- Find duplicates
SELECT email, COUNT(*) AS count
FROM employees
GROUP BY email
HAVING COUNT(*) > 1;

-- Find duplicate rows with details
SELECT * FROM employees
WHERE email IN (
    SELECT email FROM employees GROUP BY email HAVING COUNT(*) > 1
);
```

---

## Q21. Primary Key vs Foreign Key vs Unique Key?

| Aspect | Primary Key | Foreign Key | Unique Key |
|--------|-------------|-------------|------------|
| Purpose | Uniquely identifies each row | Links two tables | Ensures unique values |
| NULL allowed | **No** | Yes | **Yes** (one NULL) |
| Per table | Only **1** | Multiple | Multiple |
| Auto-creates index | Yes (clustered) | No (but recommended) | Yes (non-clustered) |
| Duplicates | Not allowed | Allowed | Not allowed |

---

## Q22. Find employees with no department?

```sql
SELECT e.* FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id
WHERE d.id IS NULL;
```

---

## Q23. Get current date/time?

```sql
SELECT NOW();                    -- MySQL: 2026-02-07 13:43:00
SELECT CURRENT_DATE;             -- 2026-02-07
SELECT CURRENT_TIMESTAMP;        -- Standard SQL
SELECT GETDATE();                -- SQL Server
SELECT SYSDATE FROM DUAL;       -- Oracle
```

---

## Q24. What is a View?

A **View** is a virtual table based on the result set of a SQL query. It doesn't store data — it pulls data from underlying tables each time it's queried.

```sql
-- Create view
CREATE VIEW active_employees AS
SELECT id, name, department, salary
FROM employees
WHERE status = 'Active';

-- Use view like a table
SELECT * FROM active_employees WHERE department = 'Engineering';

-- Drop view
DROP VIEW active_employees;
```

**Advantages:** Security (restrict column access), simplify complex queries, abstraction layer.

---

## Q25. What is a Trigger?

A **Trigger** is a stored procedure that automatically executes when a specific event (INSERT, UPDATE, DELETE) occurs on a table.

```sql
-- Create trigger: log salary changes
CREATE TRIGGER salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF OLD.salary != NEW.salary THEN
        INSERT INTO salary_log (emp_id, old_salary, new_salary, changed_at)
        VALUES (NEW.id, OLD.salary, NEW.salary, NOW());
    END IF;
END;
```

**Types:** BEFORE (validates data before change), AFTER (logs/audits after change)
