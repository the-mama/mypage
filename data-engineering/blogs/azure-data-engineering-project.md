---
title: "Azure Data Engineering Project - End-to-End Azure Data Platform"
date: "2026-02-03"
category: "Azure Data Engineering"
author: "The Mahesh"
excerpt: "In my recent project, I built an end-to-end Azure data platform that ingested semi-structured JSON data from multiple APIs and delivered analytics-ready datasets modelled in a star schema…"
tags: "Azure, Data Platform"
source: "https://idataengineer.blogspot.com/2026/02/azure-data-engineering-project.html"
---

# Azure Data Engineering Project - End-to-End Azure Data Platform

In my recent project, I built an end-to-end Azure data platform that ingested
semi-structured JSON data from multiple APIs and delivered
analytics-ready datasets modelled in a star schema within Azure Synapse.
The solution was metadata-driven, secure, and well governed,
and designed to scale as new data sources were onboarded.

[![Blog image](data-engineering/blogs/images/azure-data-engineering-project-1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYr1-Eu5smJUtK0dArYgkeQwiRcdxO7CN4k6vGJugp_GukViKMiNDPjA02fVafFrS4spdik0Zm3sXa5qrVjgk9VmAtu88iOahyphenhyphen0uG66qx5uS11A7t2RFe8NAqBFZYKJ_UQe-mI52sARWkfF8rN3IMjM4_soooQkIAmCCMD2vyw2Jvm4RDCQ8pOWQbWvjrz/s1536/ChatGPT%20Image%20Feb%203,%202026,%2004_56_24%20PM.png)

For ingestion, I used **Azure Data Factory** and followed a
**metadata-driven approach** rather than hardcoding logic into pipelines.
I maintained **control and watermark tables** that defined how each API
source should be processed, including source name, API endpoint,
authentication method, pagination logic, incremental load column,
target schema and table, load type, and whether the data contained PII.

The watermark tables stored the **last successful load timestamp or record ID**,
pipeline run status, and load timings. At runtime, ADF pipelines read from
these tables and updated the watermark after successful execution,
enabling **true incremental loading and restartability**.

**Design approach:** One generic, reusable pipeline handled multiple APIs
using metadata and parameters instead of creating one pipeline per source.

The ADF pipelines were **fully generic and parameterised**.
A single pipeline accepted parameters such as source name, entity name,
API URL, file path, target schema, target table, load type, and watermark value.
These were driven from metadata lookups and passed into Databricks notebooks.

For transformations, I used **Azure Databricks**, which was particularly
effective for handling **nested and semi-structured JSON**.
Using Spark, I flattened complex structures, handled schema drift,
applied business rules, and enforced data quality checks.

I implemented a **medallion architecture** in **ADLS Gen2**:
the Bronze layer stored raw API JSON payloads,
the Silver layer stored cleansed and normalised data in
**Parquet format**, and the Gold layer contained curated business
entities loaded into **Azure Synapse**.

Data governance was applied throughout the platform.
This included schema validation, record count checks,
null checks, duplicate detection, and role-based access control
across ADLS, Databricks, and Synapse, with full auditability.

One of the source systems contained **PII data**.
All secrets and credentials were stored in **Azure Key Vault**.
PII columns were identified via metadata and masked or encrypted
in the Silver layer. In Synapse, access was controlled using
**column-level security, dynamic data masking, and RBAC**.

For monitoring, I integrated **Azure Monitor and Log Analytics**
to capture pipeline metrics and failures.
I also implemented **Azure Logic Apps** to send
**email alerts when pipelines failed**.

Finally, the Gold layer was modelled in **Azure Synapse**
using **fact and dimension tables** following a star schema.
**Materialised views** were created for key KPIs,
supporting fast reporting in **Power BI**.

Overall, the solution was **scalable, metadata-driven, secure,
and well governed**, with a clear separation between ingestion,
transformation, and consumption layers.

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/02/azure-data-engineering-project.html).*
