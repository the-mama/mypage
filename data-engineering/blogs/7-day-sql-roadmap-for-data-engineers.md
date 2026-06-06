---
title: "SQL Server Roadmap for Data Engineers (7 Days)"
date: "2026-06-03"
category: "SQL"
author: "The Mahesh"
excerpt: "7-Day SQL Roadmap for Data Engineers Dataset Used: dbo.orders dbo.returns dbo.people Day 1 - SQL Fundamentals Topics SELECT WHERE ORDER BY DISTINCT TOP GROUP BY HAVING Aggregate Functions…"
tags: "SQL, Roadmap"
source: "https://idataengineer.blogspot.com/2026/06/7-day-sql-roadmap-for-data-engineers.html"
---

# SQL Server Roadmap for Data Engineers (7 Days)

**Dataset Used:**

- dbo.orders
- dbo.returns
- dbo.people

---

## Day 1 - SQL Fundamentals

### Topics

- SELECT
- WHERE
- ORDER BY
- DISTINCT
- TOP
- GROUP BY
- HAVING
- Aggregate Functions

### Practice Questions

1. Total Sales
2. Total Profit
3. Total Orders
4. Orders by Region
5. Sales by Region
6. Profit by Category
7. Top 10 Products by Sales
8. Customers with Sales > 5000
9. States with Negative Profit
10. Average Sales by Category

## Day 2 - Joins & Data Modelling

### Topics

- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- FULL JOIN
- SELF JOIN

### Practice Questions

1. Find Returned Orders
2. Find Non-Returned Orders
3. Return Percentage by Region
4. Sales by Regional Manager
5. Most Returned Products
6. Regions without Returns
7. Orders with Manager Information
8. Sales by Person
9. Profit by Person
10. Customer Sales with Return Flag

## Day 3 - CTEs & Subqueries

### Topics

- CTE
- Recursive CTE
- Scalar Subquery
- Correlated Subquery

### Practice Questions

1. Customers Above Average Sales
2. Products Above Category Average
3. Top Customer per Region
4. Lowest Profit Product per Category
5. Monthly Sales Trend
6. Running Profit
7. Recursive Calendar Table
8. Region Ranking
9. Product Ranking
10. Top N Products per Category

## Day 4 - Window Functions

### Topics

- ROW_NUMBER()
- RANK()
- DENSE_RANK()
- LEAD()
- LAG()
- NTILE()
- SUM OVER()

### Practice Questions

1. Rank Customers by Sales
2. Top 5 Customers per Region
3. Running Sales Total
4. Previous Month Sales
5. Month-on-Month Growth
6. Detect Sales Drops
7. First Order per Customer
8. Latest Order per Customer
9. Top Product by State
10. Moving Average Sales

## Day 5 - Data Engineering SQL

### Topics

- Deduplication
- Incremental Loads
- Watermark Logic
- MERGE
- Audit Columns

### Practice Questions

1. Remove Duplicate Orders
2. Latest Record per Customer
3. Incremental Load by Order Date
4. Create Watermark Table
5. Detect Changed Records
6. Merge Source into Target
7. Add Audit Columns
8. Soft Delete Records
9. Detect Missing Records
10. Data Reconciliation Report

## Day 6 - Data Warehouse SQL

### Topics

- Fact Tables
- Dimension Tables
- Star Schema
- SCD Type 1
- SCD Type 2

### Practice Questions

1. Create DimCustomer
2. Create DimProduct
3. Create FactSales
4. SCD Type 1 Update
5. SCD Type 2 Insert
6. Expire Existing Records
7. Current Active Customer Record
8. Historical Customer Lookup
9. Generate Surrogate Keys
10. Fact-Dimension Join Query

## Day 7 - Senior Data Engineer SQL

### Topics

- Indexing
- Execution Plans
- Partitioning
- Metadata Driven ETL
- Performance Tuning

### Practice Questions

1. Clustered vs Nonclustered Index
2. Find Missing Indexes
3. Analyze Slow Query
4. Partition Sales Table
5. Monthly Partition Query
6. Metadata Driven Load Design
7. Dynamic SQL Generator
8. Generic Incremental Load Procedure
9. Generic Audit Framework
10. End-to-End ETL Design

## Top SQL Interview Topics

| Priority | Topic |
| --- | --- |
| 1 | Window Functions |
| 2 | CTEs |
| 3 | Joins |
| 4 | Incremental Loads |
| 5 | MERGE |
| 6 | SCD Type 2 |
| 7 | Deduplication |
| 8 | Indexes |
| 9 | Star Schema |
| 10 | Metadata Driven ETL |

## Success Criteria

- Solve all 70 questions using the Superstore dataset.
- Write every query without looking at answers.
- Practice CTEs and Window Functions daily.
- Implement SCD Type 1 and Type 2 using SQL Server.
- Build a small ETL framework using metadata tables.
- Be able to explain every query during interviews.
