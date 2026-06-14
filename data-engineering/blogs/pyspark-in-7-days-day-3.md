---
title: "PySpark in 7 Days (Day 3)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 3 Welcome to Day 3 . Today is a very important day for SQL professionals , because we focus on Spark SQL and how PySpark allows you to run SQL directly on…"
tags: "PySpark"
---

# PySpark in 7 Days (Day 3)

# Learn PySpark in 7 Days – Day 3

Welcome to **Day 3**.
Today is a **very important day for SQL professionals**, because we focus on
**Spark SQL** and how PySpark allows you to run SQL directly on DataFrames.

**Day 3 Focus:**

• Spark SQL vs DataFrame API

• Temporary views

• Writing SQL queries on DataFrames

• Aggregations and CASE WHEN logic

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-3-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgP3iv1F2FxDnGB2gyG8ojp33uxwWBrM8dnyCAakPx7SWAxSojwVR5wCFUgdfe9YDBjjqeeTI81cFBCc3JmCqnwzA6Hj8e6ykxGF8WhcZP8lOPaOxczQo7Mz5VBHYruMyKW1umG9Mvm5zQleobJsoQm9BC1B8GMK2LD_NW7esPPNCrivWdVj0mqxdPwGTIB/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## Why Spark SQL Is Important

Most data engineers come from a **SQL background**.
Spark SQL allows you to reuse your SQL knowledge while working on
**distributed big data**.

- Easier to read and maintain
- Business-friendly
- Optimised by Spark Catalyst engine

## Creating a Sample DataFrame

data = [ (1, "IT", 60000), (2, "HR", 45000), (3, "IT", 75000), (4, "Finance", 80000) ] columns = ["emp_id", "department", "salary"] df = spark.createDataFrame(data, columns) df.show()

## Creating a Temporary View

df.createOrReplaceTempView("employees")

Temporary views exist only for the current Spark session.

## Querying Data Using Spark SQL

spark.sql(""" SELECT * FROM employees WHERE salary > 50000 """).show()

## Aggregations Using SQL

spark.sql(""" SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary FROM employees GROUP BY department """).show()

## CASE WHEN Logic in Spark SQL

spark.sql(""" SELECT emp_id, department, salary, CASE WHEN salary >= 70000 THEN 'High' WHEN salary >= 50000 THEN 'Medium' ELSE 'Low' END AS salary_band FROM employees """).show()

## Same Logic Using DataFrame API

from pyspark.sql.functions import when, col df.withColumn( "salary_band", when(col("salary") >= 70000, "High") .when(col("salary") >= 50000, "Medium") .otherwise("Low") ).show()

**Interview Tip:**

Spark SQL and DataFrame API are equivalent. Choose SQL for readability and DataFrame API for programmatic logic.

## Key Concepts You Learned Today

- How Spark SQL works
- Creating and using temp views
- Running SQL queries on DataFrames
- Aggregations and CASE WHEN logic

## What’s Coming on Day 4?

**Day 4 – Joins & Performance Basics**

- Inner, Left, Right, Full joins
- Join conditions and pitfalls
- Broadcast joins
- Basic performance tips

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Level:**

SQL → PySpark Transition
