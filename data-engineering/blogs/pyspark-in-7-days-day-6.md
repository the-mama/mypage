---
title: "PySpark in 7 Days (Day 6)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 6 Welcome to Day 6 . Today we move from writing correct PySpark code to writing efficient and scalable PySpark code . This is where many data engineers fail…"
tags: "PySpark"
source: "https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-6.html"
---

# PySpark in 7 Days (Day 6)

# Learn PySpark in 7 Days – Day 6

Welcome to **Day 6**.
Today we move from **writing correct PySpark code** to writing
**efficient and scalable PySpark code**.
This is where many data engineers fail interviews and production pipelines.

**Day 6 Focus:**

• repartition vs coalesce

• Understanding shuffle & data skew

• cache vs persist

• Efficient file formats (Parquet)

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-6-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjA6WKtuA-K_vj1YhCaLP7Is7m4_3qpvVLdX8TYPN78o1cXhUnWO2BRuR9Or0XL31Q9q4bO7tcK6cLnEusv0A1k0LN_f46a0sNOsG__ytgVKbZ6UgL_slCWu6_Jlf8UJg6zqIdciWfAPJhGgBSXo25t-gHKkLM7d1lcLr_VourokiAOBAxieZ7IrmCASfry/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## Why Performance Matters in Spark

Spark can process terabytes of data, but poor partitioning or unnecessary shuffles
can make jobs **slow and expensive**.
Performance tuning is a **core data engineering skill**.

## Partitions in Spark (Concept)

- Data in Spark is split into partitions
- Each partition is processed in parallel
- Too few partitions → underutilised cluster
- Too many partitions → overhead

## repartition()

df_repart = df.repartition(10)

- Increases or decreases partitions
- Causes a **full shuffle**
- Use when you need even distribution

## coalesce()

df_coalesce = df.coalesce(5)

- Reduces number of partitions
- **No full shuffle**
- Best used before writing output

**Interview Tip:**

Use

**repartition**

to increase partitions,

**coalesce**

to reduce them.

## What Is a Shuffle?

A shuffle happens when Spark needs to **redistribute data across executors**,
such as during joins, groupBy, or repartition.

- Network intensive
- Disk I/O heavy
- Primary cause of slow jobs

## Data Skew (Common Problem)

Data skew occurs when one partition has significantly more data than others.

Example: One customer_id has millions of records while others have few.

### Basic Mitigation Techniques

- Broadcast small tables
- Filter early
- Increase parallelism

## cache() vs persist()

### cache()

df.cache()

- Stores DataFrame in memory
- Default storage level
- Best for repeated reuse

### persist()

from pyspark import StorageLevel df.persist(StorageLevel.MEMORY_AND_DISK)

- More control over storage
- Useful when data doesn’t fit in memory

**Best Practice:**

Cache only when DataFrame is reused multiple times.

## Why Parquet Is Preferred

df.write.mode("overwrite").parquet("/path/output/employees")

- Columnar format
- Compressed
- Faster reads and writes
- Schema stored with data

## CSV vs Parquet (Quick Comparison)

- CSV → Human readable, slow, no schema
- Parquet → Optimised, compressed, analytics-friendly

## Key Concepts You Learned Today

- How partitions affect performance
- repartition vs coalesce
- What shuffle and skew are
- When to use cache or persist
- Why Parquet is preferred in production

## What’s Coming on Day 7?

**Day 7 – End-to-End PySpark Pipeline**

- Reading raw data
- Transformations
- Joins and aggregations
- Writing curated output
- Interview-ready explanation

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Focus:**

Performance-aware Data Engineering

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-6.html).*
