---
title: "SQL Window Functions Cheatsheet"
date: "2026-06-05"
category: "Resources"
author: "The Mahesh"
type: "guide"
excerpt: "Essential window functions for data analysis and transformation"
---

# SQL Window Functions Cheatsheet

## What It Is

A guide to SQL window functions—functions that compute values over a set of rows related to the current row.

## Why It's Useful

Window functions let you:
- Calculate running totals
- Rank rows
- Access previous/next rows
- Compare current row to aggregates
- All without GROUP BY

They're powerful and reduce the need for multiple queries or complex joins.

## Common Window Functions

### ROW_NUMBER()
```sql
SELECT 
  employee_id, 
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```
Assigns unique sequential numbers.

### LAG() / LEAD()
```sql
SELECT 
  date, 
  revenue,
  LAG(revenue) OVER (ORDER BY date) AS previous_revenue,
  revenue - LAG(revenue) OVER (ORDER BY date) AS change
FROM daily_sales;
```
Access previous or next row's values.

### SUM() OVER
```sql
SELECT 
  date, 
  daily_sales,
  SUM(daily_sales) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS 7day_moving_avg
FROM sales;
```
Running totals and moving averages.

### RANK() vs DENSE_RANK()
```sql
RANK() — 1, 2, 2, 4 (gaps on ties)
DENSE_RANK() — 1, 2, 2, 3 (no gaps)
```

## When to Use

- Time series analysis
- Calculating percent of total
- Finding top N per group
- Anomaly detection
- Comparisons within groups

## Best For

- Data engineers building transformations
- Analysts writing complex queries
- Anyone who repeatedly writes self-joins

## Pro Tips

- PARTITION BY divides data into groups
- ORDER BY determines the calculation order
- Use ROWS/RANGE for precise window definition
- Test on small datasets first—window functions can be memory intensive

---

**Published:** 2026-06-05  
**Category:** Resources  
**Reading Time:** ~5 minutes
