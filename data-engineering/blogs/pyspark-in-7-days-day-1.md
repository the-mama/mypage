---
title: "PySpark in 7 Days (Day 1)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "Learn PySpark in 7 Days – Day 1 Welcome to Day 1 of the “Learn PySpark in 7 Days” series . This series is designed for data engineers, analysts, and SQL professionals who want to learn…"
tags: "PySpark"
source: "https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-1.html"
---

# PySpark in 7 Days (Day 1)

# Learn PySpark in 7 Days – Day 1

Welcome to **Day 1 of the “Learn PySpark in 7 Days” series**.
This series is designed for **data engineers, analysts, and SQL professionals**
who want to learn PySpark in a **structured, practical, and interview-ready way**.

**Day 1 Focus:**

• What is Apache Spark?

• Why PySpark is used in data engineering

• Spark architecture (Driver, Executor, Cluster)

• Installing and starting PySpark

• Your first PySpark program

## [![Blog image](data-engineering/blogs/images/pyspark-in-7-days-day-1-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoU6MwC7TlJilIudLMNOGunAfSSl0djpdOB2QOaCt80JZXkpJn0xDNfEfUMjGizYkiyadte1g-_c-NMByMXYWg8-3hN_eERroIdOtUzFhvMj9vpKXCV_QzD8SOw9KgG0zH3sgYVq4aWd7YybFYZ4oDmbnksymNlt5FrF8LUcmOQFl537BO38y8GbM2WTID/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png) What is Apache Spark?

Apache Spark is a **distributed data processing engine** designed to process
large volumes of data quickly across multiple machines.
Unlike traditional systems, Spark keeps data **in memory**, which makes it much faster
for analytics and transformations.

### Why Spark Instead of Traditional Tools?

- Handles massive datasets (GBs to PBs)
- Distributed and fault-tolerant
- Faster than MapReduce
- Supports batch and streaming workloads

## What is PySpark?

**PySpark** is the Python API for Apache Spark.
It allows Python developers to use Spark’s distributed processing capabilities
without writing Scala or Java.

If you know

**SQL + Python**

, PySpark becomes very easy to learn.

## Where Is PySpark Used?

- ETL pipelines (Bronze / Silver / Gold)
- Big data transformations
- Incremental and batch processing
- Databricks, Azure Synapse, AWS EMR

## Spark Architecture (Simple Explanation)

- **Driver** – Controls the job and holds SparkSession
- **Executors** – Execute tasks and process data
- **Cluster Manager** – Allocates resources (YARN, Kubernetes, Standalone)

Think of the

**Driver**

as the brain and

**Executors**

as the workers.

## Installing PySpark (Local Setup)

Make sure Python is installed, then run:

pip install pyspark

Verify installation:

pyspark

## Your First PySpark Program

from pyspark.sql import SparkSession spark = SparkSession.builder \ .appName("Day1-PySpark") \ .getOrCreate() data = [(1, "Mahesh"), (2, "Spark"), (3, "PySpark")] df = spark.createDataFrame(data, ["id", "name"]) df.show()

### Output

+---+-------+ | id| name| +---+-------+ | 1| Mahesh| | 2| Spark| | 3|PySpark| +---+-------+

## Key Concepts You Learned Today

- What Spark and PySpark are
- Why PySpark is critical for data engineers
- Basic Spark architecture
- How to start a Spark session
- Creating and displaying a DataFrame

## What’s Coming on Day 2?

**Day 2 – PySpark DataFrames & Schema**

- Reading CSV & JSON files
- Schema inference vs manual schema
- select, withColumn, filter
- Basic transformations

**Series:**

Learn PySpark in 7 Days

**Author:**

TrySpark

**Level:**

Beginner → Intermediate (Data Engineering Focus)

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-day-1.html).*
