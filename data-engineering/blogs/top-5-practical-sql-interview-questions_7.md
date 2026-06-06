---
title: "Top 5 Practical SQL Interview Questions"
date: "2026-01-07"
category: "SQL"
author: "The Mahesh"
excerpt: "These five SQL problems are frequently asked in data engineering and analytics interviews because they test real work: ranking, deduplication, incremental logic, and business-style…"
tags: "SQL, Interview"
source: "https://idataengineer.blogspot.com/2026/01/top-5-practical-sql-interview-questions_7.html"
---

# Top 5 Practical SQL Interview Questions

BLOGGER POST (HTML)

These five SQL problems are frequently asked in data engineering and analytics interviews because they test real work:
 ranking, deduplication, incremental logic, and business-style reporting. Each question includes a clear solution query.
 (Examples are written in a SQL Server-friendly style, but the logic works in most SQL engines.)

---

===================== Q1 =====================

## 1) Find the Top 3 highest-paid employees in each department

Tests window functions and ranking within groups.

Solution (ROW_NUMBER)

```
SELECT dept_id, emp_id, emp_name, salary
FROM (
    SELECT
        e.*,
        ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM Employees e
) x
WHERE x.rn <= 3
ORDER BY dept_id, salary DESC;

```

===================== Q2 =====================

## 2) Calculate a running total of spending per customer (by date)

Tests window aggregation and ordering.

Solution (SUM OVER)

```
SELECT
    customer_id,
    order_id,
    order_date,
    order_total,
    SUM(order_total) OVER (
        PARTITION BY customer_id
        ORDER BY order_date, order_id
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM Orders
ORDER BY customer_id, order_date, order_id;

```

===================== Q3 =====================

## 3) De-duplicate records and keep only the latest row per key

Very common in ingestion pipelines. Tests CTE usage + window ranking for dedupe.

Solution (CTE + ROW_NUMBER)

```
WITH ranked AS (
    SELECT
        t.*,
        ROW_NUMBER() OVER (
            PARTITION BY business_key
            ORDER BY updated_at DESC, id DESC
        ) AS rn
    FROM StagingTable t
)
DELETE FROM ranked
WHERE rn > 1;

```

Replace **business_key** with your natural key (e.g., customer_id, emp_id) and **updated_at** with your latest timestamp column.

===================== Q4 =====================

## 4) Return customers who have orders above the overall average order value

Tests subqueries and benchmarking logic.

Solution (Subquery)

```
SELECT DISTINCT o.customer_id
FROM Orders o
WHERE o.order_total > (
    SELECT AVG(order_total) FROM Orders
)
ORDER BY o.customer_id;

```

===================== Q5 =====================

## 5) Perform an upsert (MERGE): update existing rows and insert new rows

This is a day-to-day data engineering requirement: incremental loads and idempotent pipelines.

Solution (MERGE)

```
MERGE INTO DimCustomer AS tgt
USING StgCustomer AS src
ON tgt.customer_id = src.customer_id
WHEN MATCHED AND (
       ISNULL(tgt.customer_name,'') <> ISNULL(src.customer_name,'')
    OR ISNULL(tgt.city,'')          <> ISNULL(src.city,'')
) THEN
    UPDATE SET
        tgt.customer_name = src.customer_name,
        tgt.city          = src.city,
        tgt.updated_at    = GETDATE()
WHEN NOT MATCHED BY TARGET THEN
    INSERT (customer_id, customer_name, city, created_at, updated_at)
    VALUES (src.customer_id, src.customer_name, src.city, GETDATE(), GETDATE());

```

---

## Summary

- Ranking within groups (Top-N) using **ROW_NUMBER**
- Running totals using **SUM OVER**
- De-duplication using **CTE + ROW_NUMBER**
- Benchmark filtering using **subqueries**
- Incremental loading using **MERGE** (upsert)

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/top-5-practical-sql-interview-questions_7.html).*
