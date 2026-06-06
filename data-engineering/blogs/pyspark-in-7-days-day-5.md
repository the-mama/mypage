---
title: "PySpark in 7 Days (Day 5)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 5 Welcome to Day 5 . Today we cover aggregations and window functions — two topics that appear frequently in interviews and are used extensively in real-world…"
tags: "PySpark"
source: "https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-5.html"
---

# PySpark in 7 Days (Day 5)

# Learn PySpark in 7 Days – Day 5

Welcome to **Day 5**.
Today we cover **aggregations and window functions** — two topics that appear
**frequently in interviews** and are used extensively in
**real-world analytics and reporting pipelines**.

**Day 5 Focus:**

• groupBy and aggregate functions

• Window functions fundamentals

• row_number, rank, dense_rank

• Real interview-style use cases

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-5-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXKtjtyOPG6MdO2XXkoGiEHhEXqOHSiZmrIfQeYwgDgrZ4l0CUzL7_XzPfpRCCYT7RtzvxepfRs6L_RXtxDgg6dwyve983T-i4Eq_tv-11D3rd65dF_xywy984F09xhgudCpm6UjdNzgVvblCQFEVBpaiYTPAFJPJi-Or5U0zxD1Ggi313CAfg8EVGQxfq/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## Sample Data

data = [ (1, "IT", 60000), (2, "IT", 75000), (3, "HR", 45000), (4, "HR", 50000), (5, "Finance", 80000) ] columns = ["emp_id", "department", "salary"] df = spark.createDataFrame(data, columns) df.show()

## Aggregations Using groupBy

### Basic Aggregations

from pyspark.sql.functions import avg, max, min, count df.groupBy("department").agg( count("*").alias("emp_count"), avg("salary").alias("avg_salary"), max("salary").alias("max_salary"), min("salary").alias("min_salary") ).show()

Aggregations reduce data size and are commonly used in

**Gold-layer datasets**

.

## Why Window Functions?

Aggregations collapse rows.
**Window functions** allow you to perform calculations
**without losing row-level detail**.

## Defining a Window Specification

from pyspark.sql.window import Window window_spec = Window.partitionBy("department").orderBy("salary")

## row_number()

from pyspark.sql.functions import row_number df.withColumn( "row_number", row_number().over(window_spec) ).show()

Assigns a unique sequence number per partition.

## rank()

from pyspark.sql.functions import rank df.withColumn( "rank", rank().over(window_spec) ).show()

Gives the same rank for ties but leaves gaps.

## dense_rank()

from pyspark.sql.functions import dense_rank df.withColumn( "dense_rank", dense_rank().over(window_spec) ).show()

Gives the same rank for ties **without gaps**.

## Interview Question: Highest Salary Per Department

from pyspark.sql.functions import dense_rank df.withColumn( "dr", dense_rank().over( Window.partitionBy("department").orderBy(df.salary.desc()) ) ).filter("dr = 1").show()

**Interview Tip:**

If you hear “top N per group”, think

**window functions**

.

## Key Concepts You Learned Today

- How groupBy aggregations work
- Difference between aggregation and window functions
- row_number vs rank vs dense_rank
- Solving real interview-style problems

## What’s Coming on Day 6?

**Day 6 – Performance & Partitioning**

- repartition vs coalesce
- Shuffle and skew basics
- Caching and persistence
- Reading and writing Parquet

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Focus:**

Interview & Real-World Analytics
