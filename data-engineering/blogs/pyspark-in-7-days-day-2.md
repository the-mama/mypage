---
title: "PySpark in 7 Days (Day 2)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 2 Welcome to Day 2 of the PySpark in 7 Days series . Today is one of the most important days because DataFrames are the core abstraction used in real-world…"
tags: "PySpark"
source: "https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-2.html"
---

# PySpark in 7 Days (Day 2)

# Learn PySpark in 7 Days – Day 2

Welcome to **Day 2 of the PySpark in 7 Days series**.
Today is one of the **most important days** because DataFrames are the
**core abstraction** used in real-world Spark pipelines.

**Day 2 Focus:**

• Understanding PySpark DataFrames

• Reading CSV and JSON files

• Schema inference vs manual schema

• select, filter, withColumn operations

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-2-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBueham3m40U5ZsCUtpFhFh8ZRLM_Y28sQA6BUbSLPf3Wq53oCRDeQgWpmED_SStFYYmjfNw3PdOX_H2yjBwiR-rF_l0oUd-S5csfbdw206SO_V2dSE17s8QdtY8mfJCxjwVHsSvX1IhjCl8GpThwEIazj8kN9SuMEaY9mnAWLw08yG37c58MbryuWBlTY/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## What Is a PySpark DataFrame?

A PySpark DataFrame is a **distributed table-like structure** with rows and columns,
similar to a SQL table or Pandas DataFrame, but designed to work on **large-scale data**.

- Immutable (cannot be changed in place)
- Schema-aware
- Optimised using Spark Catalyst engine

## Creating SparkSession (Recap)

from pyspark.sql import SparkSession spark = SparkSession.builder \ .appName("Day2-PySpark") \ .getOrCreate()

## Reading CSV Files

df = spark.read \ .option("header", "true") \ .option("inferSchema", "true") \ .csv("/path/employees.csv") df.show() df.printSchema()

**Interview Tip:**

inferSchema is convenient but expensive for large files. In production, prefer

**explicit schemas**

.

## Reading JSON Files

json_df = spark.read.json("/path/employees.json") json_df.show()

## Defining a Manual Schema

from pyspark.sql.types import StructType, StructField, IntegerType, StringType schema = StructType([ StructField("emp_id", IntegerType(), True), StructField("name", StringType(), True), StructField("department", StringType(), True), StructField("salary", IntegerType(), True) ]) df = spark.read \ .option("header", "true") \ .schema(schema) \ .csv("/path/employees.csv")

## Common DataFrame Operations

### Select Columns

df.select("name", "salary").show()

### Filter Rows

df.filter(df.salary > 50000).show()

### Add or Modify Column (withColumn)

from pyspark.sql.functions import col df = df.withColumn("salary_bonus", col("salary") * 1.10) df.show()

**Important:**

withColumn always returns a

**new DataFrame**

.

## Rename Columns

df = df.withColumnRenamed("emp_id", "employee_id")

## Key Concepts You Learned Today

- What a PySpark DataFrame is
- Reading CSV and JSON data
- Schema inference vs manual schema
- select, filter, withColumn usage

## What’s Coming on Day 3?

**Day 3 – PySpark SQL & Expressions**

- Spark SQL vs DataFrame API
- createOrReplaceTempView
- SQL queries on DataFrames
- Case when, aggregations

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Target Audience:**

Data Engineers & SQL Professionals

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-2.html).*
