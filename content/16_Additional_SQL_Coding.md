# Additional SQL Coding Problems — SDET Interview Prep
## Vikrant Mishra — India 2026 (Noida, Pune, Hyderabad, Bangalore, Gurugram, Dubai)
## Companies: Accenture, Wipro, Capgemini, TCS, Infosys, Cognizant, HCL

> These are **advanced SQL coding problems** frequently asked in 2026 SDET interviews.
> Beyond what's already covered in `08_Review_SQL_Questions.md`.

---

## Sample Data Used Throughout:

```sql
-- employees table
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    manager_id INT,
    hire_date DATE
);

INSERT INTO employees VALUES
(1, 'Adam',    'Engineering', 80000, NULL, '2020-01-15'),
(2, 'Bob',     'Engineering', 90000, 1,    '2020-03-20'),
(3, 'Charlie', 'Engineering', 85000, 1,    '2021-06-10'),
(4, 'Diana',   'Marketing',   70000, NULL, '2019-11-01'),
(5, 'Eve',     'Marketing',   75000, 4,    '2022-02-15'),
(6, 'Frank',   'Sales',       65000, NULL, '2021-08-25'),
(7, 'Grace',   'Sales',       60000, 6,    '2023-01-10'),
(8, 'Vikrant', 'Engineering', 95000, 1,    '2018-05-20'),
(9, 'Ivy',     'Marketing',   70000, 4,    '2023-07-01'),
(10,'Jack',    'Engineering', 85000, 1,    '2022-09-15');
```

---

## SQ1. Find employees with salary greater than Adam's salary (from Screenshot 3)

```sql
-- Method 1: Subquery
SELECT * FROM employees
WHERE salary > (SELECT salary FROM employees WHERE name = 'Adam');

-- Method 2: Self JOIN
SELECT e.* FROM employees e
JOIN employees adam ON adam.name = 'Adam'
WHERE e.salary > adam.salary;

-- Result: Bob (90000), Vikrant (95000)
```

---

## SQ2. Find the Nth highest salary (multiple methods — very frequently asked)

```sql
-- Method 1: DENSE_RANK (handles duplicates correctly)
SELECT * FROM (
    SELECT name, salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
    FROM employees
) ranked
WHERE rank = 3;  -- 3rd highest

-- Method 2: LIMIT + OFFSET
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;  -- 3rd highest (0-indexed offset)

-- Method 3: Subquery (no window functions)
SELECT DISTINCT salary FROM employees e1
WHERE 3 = (
    SELECT COUNT(DISTINCT salary) FROM employees e2
    WHERE e2.salary >= e1.salary
);

-- Method 4: CTE
WITH RankedSalaries AS (
    SELECT DISTINCT salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
    FROM employees
)
SELECT salary FROM RankedSalaries WHERE rank = 3;
```

---

## SQ3. Find the top 3 highest paid employees in each department

```sql
WITH RankedByDept AS (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
    FROM employees
)
SELECT name, department, salary, dept_rank
FROM RankedByDept
WHERE dept_rank <= 3
ORDER BY department, dept_rank;
```

---

## SQ4. Find employees who earn more than their manager

```sql
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager, m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

---

## SQ5. Find departments where average salary is greater than overall average

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);
```

---

## SQ6. Find employees hired in the last 2 years

```sql
-- MySQL
SELECT * FROM employees
WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 2 YEAR);

-- PostgreSQL
SELECT * FROM employees
WHERE hire_date >= CURRENT_DATE - INTERVAL '2 years';

-- SQL Server
SELECT * FROM employees
WHERE hire_date >= DATEADD(YEAR, -2, GETDATE());

-- Generic (works everywhere)
SELECT * FROM employees
WHERE hire_date >= '2024-02-07';  -- manually calculate
```

---

## SQ7. Find second highest salary in each department

```sql
WITH RankedSalaries AS (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
    FROM employees
)
SELECT name, department, salary
FROM RankedSalaries
WHERE rank = 2;
```

---

## SQ8. Find employees with consecutive IDs (gap detection)

```sql
-- Find gaps in ID sequence
SELECT id + 1 AS gap_start,
       (SELECT MIN(id) FROM employees e2 WHERE e2.id > e1.id) - 1 AS gap_end
FROM employees e1
WHERE NOT EXISTS (
    SELECT 1 FROM employees e2 WHERE e2.id = e1.id + 1
)
AND id < (SELECT MAX(id) FROM employees);
```

---

## SQ9. Pivot / Transpose rows to columns

```sql
-- Count employees per department (pivot)
SELECT
    SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS Engineering,
    SUM(CASE WHEN department = 'Marketing' THEN 1 ELSE 0 END) AS Marketing,
    SUM(CASE WHEN department = 'Sales' THEN 1 ELSE 0 END) AS Sales
FROM employees;

-- Result: Engineering=4, Marketing=3, Sales=2

-- Salary stats per department
SELECT department,
    COUNT(*) AS total,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary,
    ROUND(AVG(salary), 2) AS avg_salary,
    SUM(salary) AS total_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;
```

---

## SQ10. Running total / Cumulative sum

```sql
SELECT name, salary,
    SUM(salary) OVER (ORDER BY hire_date) AS running_total,
    AVG(salary) OVER (ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM employees
ORDER BY hire_date;
```

---

## SQ11. Find employees whose name starts and ends with a vowel

```sql
-- MySQL / PostgreSQL
SELECT * FROM employees
WHERE LOWER(name) REGEXP '^[aeiou].*[aeiou]$';

-- SQL Server
SELECT * FROM employees
WHERE name LIKE '[aeiou]%[aeiou]';

-- Generic (using SUBSTRING)
SELECT * FROM employees
WHERE LOWER(SUBSTRING(name, 1, 1)) IN ('a','e','i','o','u')
  AND LOWER(SUBSTRING(name, LENGTH(name), 1)) IN ('a','e','i','o','u');
```

---

## SQ12. Self JOIN — find employees in the same department

```sql
SELECT e1.name AS employee1, e2.name AS employee2, e1.department
FROM employees e1
JOIN employees e2 ON e1.department = e2.department
WHERE e1.id < e2.id  -- avoid duplicates and self-pairing
ORDER BY e1.department;
```

---

## SQ13. Find departments with more than 3 employees

```sql
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 3;
```

---

## SQ14. Delete duplicate rows (keep one copy)

```sql
-- Method 1: Using CTE + ROW_NUMBER
WITH CTE AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY name, department ORDER BY id) AS row_num
    FROM employees
)
DELETE FROM CTE WHERE row_num > 1;

-- Method 2: Keep the row with minimum ID
DELETE FROM employees
WHERE id NOT IN (
    SELECT MIN(id) FROM employees
    GROUP BY name, department
);

-- Method 3: Using temporary table
CREATE TABLE temp_employees AS
SELECT DISTINCT * FROM employees;
TRUNCATE TABLE employees;
INSERT INTO employees SELECT * FROM temp_employees;
DROP TABLE temp_employees;
```

---

## SQ15. LEAD and LAG — compare with next/previous row

```sql
-- Compare each employee's salary with the next higher salary
SELECT name, salary,
    LEAD(salary) OVER (ORDER BY salary) AS next_salary,
    LAG(salary) OVER (ORDER BY salary) AS prev_salary,
    salary - LAG(salary) OVER (ORDER BY salary) AS salary_diff
FROM employees
ORDER BY salary;

-- Find employees who got a salary increase (comparing with previous hire)
SELECT name, hire_date, salary,
    LAG(salary) OVER (ORDER BY hire_date) AS prev_emp_salary,
    salary - LAG(salary) OVER (ORDER BY hire_date) AS diff
FROM employees;
```

---

## SQ16. Find the department with the highest total salary

```sql
-- Method 1: ORDER BY + LIMIT
SELECT department, SUM(salary) AS total_salary
FROM employees
GROUP BY department
ORDER BY total_salary DESC
LIMIT 1;

-- Method 2: Subquery with MAX
SELECT department, SUM(salary) AS total_salary
FROM employees
GROUP BY department
HAVING SUM(salary) = (
    SELECT MAX(dept_total) FROM (
        SELECT SUM(salary) AS dept_total
        FROM employees
        GROUP BY department
    ) sub
);
```

---

## SQ17. String Functions frequently asked in interviews

```sql
-- Concatenation
SELECT CONCAT(name, ' - ', department) AS full_info FROM employees;

-- Substring
SELECT SUBSTRING(name, 1, 3) AS short_name FROM employees;  -- first 3 chars

-- Length
SELECT name, LENGTH(name) AS name_length FROM employees;

-- Upper/Lower
SELECT UPPER(name), LOWER(department) FROM employees;

-- Trim
SELECT TRIM('  Vikrant  ') AS trimmed;  -- 'Vikrant'
SELECT LTRIM('  left'), RTRIM('right  ');

-- Replace
SELECT REPLACE(name, 'a', '@') FROM employees;

-- Reverse
SELECT REVERSE(name) FROM employees;

-- Position/INSTR
SELECT name, POSITION('a' IN name) AS a_position FROM employees;  -- PostgreSQL
SELECT name, INSTR(name, 'a') AS a_position FROM employees;       -- MySQL
```

---

## SQ18. Date Functions frequently asked

```sql
-- Current date/time
SELECT NOW();                    -- 2026-02-07 14:30:00
SELECT CURDATE();                -- 2026-02-07
SELECT CURRENT_TIMESTAMP;

-- Extract parts
SELECT YEAR(hire_date), MONTH(hire_date), DAY(hire_date) FROM employees;
SELECT EXTRACT(YEAR FROM hire_date) FROM employees;  -- PostgreSQL

-- Date arithmetic
SELECT name, hire_date,
    DATEDIFF(CURDATE(), hire_date) AS days_employed,   -- MySQL
    TIMESTAMPDIFF(YEAR, hire_date, CURDATE()) AS years  -- MySQL
FROM employees;

-- Format
SELECT DATE_FORMAT(hire_date, '%d-%M-%Y') FROM employees;  -- MySQL: 15-January-2020
SELECT TO_CHAR(hire_date, 'DD-Mon-YYYY') FROM employees;   -- PostgreSQL: 15-Jan-2020

-- Find employees hired on a specific day of week
SELECT * FROM employees
WHERE DAYNAME(hire_date) = 'Monday';  -- MySQL
```

---

## SQ19. Transaction & ACID Properties (theoretical)

**ACID Properties:**

| Property | Meaning | Example |
|----------|---------|---------|
| **Atomicity** | All or nothing — transaction fully completes or fully rolls back | Transfer money: debit + credit must both succeed |
| **Consistency** | Database moves from one valid state to another | After transfer, total balance remains same |
| **Isolation** | Concurrent transactions don't interfere | Two users booking same seat — only one succeeds |
| **Durability** | Committed data survives system failure | Power outage after commit — data preserved |

```sql
-- Transaction example
START TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- debit
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- credit

-- If both succeed:
COMMIT;

-- If any fails:
ROLLBACK;
```

---

## SQ20. Common Table Expression (CTE) — Recursive (advanced)

```sql
-- Recursive CTE: Find employee hierarchy (org chart)
WITH RECURSIVE OrgChart AS (
    -- Base case: top-level managers (no manager)
    SELECT id, name, manager_id, 1 AS level,
           CAST(name AS VARCHAR(500)) AS path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: employees reporting to managers
    SELECT e.id, e.name, e.manager_id, oc.level + 1,
           CONCAT(oc.path, ' → ', e.name)
    FROM employees e
    JOIN OrgChart oc ON e.manager_id = oc.id
)
SELECT * FROM OrgChart ORDER BY path;

-- Result:
-- Adam (Level 1)
-- Adam → Bob (Level 2)
-- Adam → Charlie (Level 2)
-- Adam → Vikrant (Level 2)
-- Diana (Level 1)
-- Diana → Eve (Level 2)
```

---

## SQ21. Find employees with salary between the 25th and 75th percentile

```sql
WITH Percentiles AS (
    SELECT salary,
        PERCENT_RANK() OVER (ORDER BY salary) AS pct_rank
    FROM employees
)
SELECT * FROM employees
WHERE salary BETWEEN
    (SELECT MIN(salary) FROM Percentiles WHERE pct_rank >= 0.25)
    AND
    (SELECT MAX(salary) FROM Percentiles WHERE pct_rank <= 0.75);
```

---

## SQ22. Write a query to find all combinations (CROSS JOIN)

```sql
-- Find all possible employee-department combinations
SELECT e.name, d.department
FROM employees e
CROSS JOIN (SELECT DISTINCT department FROM employees) d
ORDER BY e.name, d.department;

-- Practical use: Generate test matrix
SELECT browser, os, resolution
FROM (SELECT 'Chrome' AS browser UNION SELECT 'Firefox' UNION SELECT 'Edge') b
CROSS JOIN (SELECT 'Windows' AS os UNION SELECT 'Mac' UNION SELECT 'Linux') o
CROSS JOIN (SELECT '1920x1080' AS resolution UNION SELECT '1366x768') r;
```

---

## SQ23. Dynamic column selection with CASE (interview favorite)

```sql
-- Grade employees based on salary
SELECT name, salary,
    CASE
        WHEN salary >= 90000 THEN 'A - Top Performer'
        WHEN salary >= 80000 THEN 'B - Above Average'
        WHEN salary >= 70000 THEN 'C - Average'
        ELSE 'D - Below Average'
    END AS grade
FROM employees
ORDER BY salary DESC;

-- Count per grade
SELECT
    SUM(CASE WHEN salary >= 90000 THEN 1 ELSE 0 END) AS grade_A,
    SUM(CASE WHEN salary >= 80000 AND salary < 90000 THEN 1 ELSE 0 END) AS grade_B,
    SUM(CASE WHEN salary >= 70000 AND salary < 80000 THEN 1 ELSE 0 END) AS grade_C,
    SUM(CASE WHEN salary < 70000 THEN 1 ELSE 0 END) AS grade_D
FROM employees;
```

---

## SQ24. COALESCE and IFNULL — handle NULLs

```sql
-- COALESCE — returns first non-NULL value
SELECT name,
    COALESCE(manager_id, 0) AS manager_id,
    COALESCE(department, 'Unassigned') AS department
FROM employees;

-- IFNULL (MySQL specific)
SELECT name, IFNULL(manager_id, 'No Manager') FROM employees;

-- ISNULL (SQL Server)
SELECT name, ISNULL(manager_id, 0) FROM employees;

-- NVL (Oracle)
SELECT name, NVL(manager_id, 0) FROM employees;

-- Practical: Replace NULL salary with department average
SELECT name, department,
    COALESCE(salary, (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department)) AS salary
FROM employees e1;
```

---

## SQ25. EXISTS vs IN — performance difference

```sql
-- IN — loads all results into memory, then checks
SELECT * FROM employees
WHERE department IN (SELECT department FROM departments WHERE active = 1);

-- EXISTS — checks row by row, stops at first match (better for large datasets)
SELECT * FROM employees e
WHERE EXISTS (
    SELECT 1 FROM departments d
    WHERE d.department = e.department AND d.active = 1
);
```

| Aspect | IN | EXISTS |
|--------|-----|--------|
| Subquery result | Loads ALL into memory | Checks row by row |
| NULL handling | Cannot match NULLs | Handles NULLs properly |
| Performance (large subquery) | Slower | **Faster** |
| Performance (small subquery) | **Faster** | Slower |
| Readability | Simpler | More complex |

**Rule of thumb:** Use `EXISTS` when the subquery result is large; use `IN` when the subquery result is small.
