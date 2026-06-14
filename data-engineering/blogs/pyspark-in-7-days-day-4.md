---
title: "PySpark in 7 Days (Day 4)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 4 Welcome to Day 4 . Today we cover one of the most tested topics in interviews and one of the most performance-critical operations in Spark: Joins . Day 4…"
tags: "PySpark"
---

# PySpark in 7 Days (Day 4)

# Learn PySpark in 7 Days – Day 4

Welcome to **Day 4**.
Today we cover one of the **most tested topics in interviews** and one of the
**most performance-critical operations** in Spark: **Joins**.

**Day 4 Focus:**

• Join types in PySpark

• Join conditions and syntax

• Broadcast joins

• Join performance basics

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-4-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1Uyh-MZ6z8DsS5YEUKkbiSYVvIjNc_NR6c2pRWrTRNLX_JYjl4c-3pL_1CJg45cpnPViXdkzC-ouNffqYQFCQ24mBMV3e1rFSKqLspHoRtQgqvy2l70fzsnmPXlRAWX8tacrUfyltF0LPON2I1cdEM0NL6mdewtNiPb_4fhc35TdZs3eak6dgrqcf4omE/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## Why Joins Matter in Spark

In real-world data engineering, data rarely comes from a single source.
Joins combine datasets but are also the **biggest cause of performance issues**
if implemented incorrectly.

## Sample DataFrames

employees = [ (1, "Mahesh", 10), (2, "Ravi", 20), (3, "Anita", 10), (4, "John", 30) ] departments = [ (10, "IT"), (20, "HR"), (30, "Finance") ] emp_df = spark.createDataFrame(employees, ["emp_id", "name", "dept_id"]) dept_df = spark.createDataFrame(departments, ["dept_id", "dept_name"])

## Inner Join

emp_df.join( dept_df, emp_df.dept_id == dept_df.dept_id, "inner" ).show()

Returns only matching records from both DataFrames.

## Left Join

emp_df.join( dept_df, emp_df.dept_id == dept_df.dept_id, "left" ).show()

Returns all records from the left DataFrame and matching records from the right.

## Right Join

emp_df.join( dept_df, emp_df.dept_id == dept_df.dept_id, "right" ).show()

## Full Outer Join

emp_df.join( dept_df, emp_df.dept_id == dept_df.dept_id, "outer" ).show()

## Handling Duplicate Columns

emp_df.alias("e").join( dept_df.alias("d"), col("e.dept_id") == col("d.dept_id"), "inner" ).select( "e.emp_id", "e.name", "d.dept_name" ).show()

## Broadcast Join (Very Important)

Use a broadcast join when one table is

**small**

and the other is

**large**

.

from pyspark.sql.functions import broadcast emp_df.join( broadcast(dept_df), emp_df.dept_id == dept_df.dept_id, "inner" ).show()

Broadcast joins avoid expensive shuffles by sending the small table to all executors.

## Join Performance Best Practices

- Filter data **before** joining
- Use broadcast joins for small lookup tables
- Avoid joining on high-cardinality columns unnecessarily
- Select only required columns after join

**Interview Tip:**

If joins are slow, the first thing to check is

**data size and shuffle**

.

## Key Concepts You Learned Today

- All major join types in PySpark
- Correct join syntax and conditions
- How broadcast joins work
- Basic join performance optimisation

## What’s Coming on Day 5?

**Day 5 – Aggregations & Window Functions**

- groupBy and aggregations
- Window functions
- Ranking and running totals
- Real interview-style problems

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Focus:**

Performance-aware Data Engineering
