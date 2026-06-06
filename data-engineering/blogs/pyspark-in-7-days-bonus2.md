---
title: "PySpark in 7 Days (bonus2)"
date: "2026-01-17"
category: "PySpark"
author: "The Mahesh"
excerpt: "PySpark Cheat Sheet – Data Engineer Edition TL;DR • SparkSession is the entry point • Transformations are lazy, actions trigger execution • Avoid shuffles, prefer broadcast joins • Use…"
tags: "PySpark"
source: "https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-bonus2.html"
---

# PySpark in 7 Days (bonus2)

# PySpark Cheat Sheet – Data Engineer Edition

**TL;DR**

• SparkSession is the entry point

• Transformations are lazy, actions trigger execution

• Avoid shuffles, prefer broadcast joins

• Use Parquet/Delta, not CSV

• Window functions = “Top N per group”

• repartition increases, coalesce reduces partitions

• Always think: DAG → stages → tasks

[![Blog image](data-engineering/blogs/images/pyspark-in-7-days-bonus2-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxgyVnyYR4iZRpWs-Ygtemkk3wCuKrWYDgy1ZhIxgCjMBofQ_aiUiRT8O0obzpVw7gNjY_AYJVup05PIMxn7rkUl0FvimKuSFpw3Qc8rN2R8-ViG02OrKE9sS9fWD9mxmPf57d_3U3OmgPtoQxSiUQmmQhDTp2D-BtjiHsMBfa6kwvST8OcwpvquAm6_5O/s1536/726CD5A7-F4EA-45AE-90BB-724359C42F78.png)

## 1. Spark Session

from pyspark.sql import SparkSession spark = SparkSession.builder \ .appName("AppName") \ .getOrCreate()

## 2. Reading Data

| Format | Example |
| --- | --- |
| CSV | spark.read.option("header","true").csv(path) |
| JSON | spark.read.json(path) |
| Parquet | spark.read.parquet(path) |
| Delta | spark.read.format("delta").load(path) |

## 3. Writing Data

df.write.mode("overwrite").parquet(path) df.write.partitionBy("date").parquet(path)

## 4. DataFrame Basics

df.show() df.printSchema() df.count() df.columns

## 5. Select / Filter / withColumn

from pyspark.sql.functions import col df.select("id","name") df.filter(col("salary") > 50000) df.withColumn("bonus", col("salary") * 0.1)

## 6. Null Handling

df.dropna() df.fillna(0) df.filter(col("col").isNotNull())

## 7. Joins

| Type | Syntax |
| --- | --- |
| Inner | df1.join(df2, "id", "inner") |
| Left | df1.join(df2, "id", "left") |
| Right | df1.join(df2, "id", "right") |
| Full | df1.join(df2, "id", "outer") |

### Broadcast Join

from pyspark.sql.functions import broadcast df.join(broadcast(dim_df), "id")

## 8. Aggregations

from pyspark.sql.functions import avg, count, max df.groupBy("dept").agg( count("*"), avg("salary"), max("salary") )

## 9. Window Functions

from pyspark.sql.window import Window from pyspark.sql.functions import row_number, rank, dense_rank w = Window.partitionBy("dept").orderBy(col("salary").desc()) df.withColumn("rn", row_number().over(w))

## 10. Spark SQL

df.createOrReplaceTempView("employees") spark.sql(""" SELECT dept, AVG(salary) FROM employees GROUP BY dept """)

## 11. Partitions & Performance

| Operation | Use Case |
| --- | --- |
| repartition(n) | Increase / rebalance partitions (shuffle) |
| coalesce(n) | Reduce partitions (no shuffle) |

df.repartition(10) df.coalesce(1)

## 12. Cache & Persist

df.cache() from pyspark import StorageLevel df.persist(StorageLevel.MEMORY_AND_DISK)

## 13. Execution Plan & Debugging

df.explain() df.explain(True)

## 14. Delta Lake (Must-Know)

MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *

## 15. Structured Streaming (Basics)

df.writeStream \ .format("delta") \ .option("checkpointLocation", "/chk") \ .start("/out")

## 16. Common Interview Triggers

- Slow job → shuffle or skew
- Top N per group → window functions
- Small lookup table → broadcast join
- Repeated use → cache
- Analytics storage → Parquet / Delta

**Outcome:**

This cheat sheet covers 90% of PySpark used in real production pipelines and interviews.

**Level:**

Data Engineer (Intermediate → Advanced)

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/pyspark-in-7-days-bonus2.html).*
