---
title: "SCD Type 2: When to Use It"
date: "2026-01-12"
category: "Data Engineering"
author: "The Mahesh"
excerpt: "& Interview Questions SCD Type 2: When to Use It & Interview Questions What is SCD Type 2? SCD Type 2 (Slowly Changing Dimension Type 2) is a data warehouse technique that tracks the…"
tags: "SCD Type 2"
source: "https://idataengineer.blogspot.com/2026/01/scd-type-2-when-to-use-it.html"
---

# SCD Type 2: When to Use It

# SCD Type 2: When to Use It & Interview Questions

## What is SCD Type 2?

SCD Type 2 (Slowly Changing Dimension Type 2) is a data warehouse technique that tracks the complete history of changes to dimension records. Instead of updating existing records, it creates new versions with effective date ranges.

**Simple Example:**

An employee moves from Sales to Marketing department.

| Employee_Key | Employee_ID | Name | Department | Start_Date | End_Date | Is_Current |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | E123 | John Smith | Sales | 2023-01-01 | 2024-06-30 | No |
| 2 | E123 | John Smith | Marketing | 2024-07-01 | 9999-12-31 | Yes |

Notice: Same Employee_ID (E123) has two records with different surrogate keys. This preserves history.

## When to Use SCD Type 2

### Best Use Cases:

**1. Regulatory & Compliance Requirements**

Financial institutions, healthcare, and insurance need complete audit trails. You must track who had what access or status at any point in time. Regulators may ask "What was this customer's risk rating on March 15, 2023?" SCD Type 2 answers this precisely.

**2. Historical Analysis & Reporting**

Business needs to analyze trends over time accurately. Examples: "How many customers were in Premium tier each month for the past 3 years?" or "What were regional sales performance when territories were different?" Without history, these questions can't be answered correctly.

**3. Customer or Product Attributes That Change Infrequently**

Customer addresses, product categories, employee departments, or organizational hierarchies don't change daily but when they do change, you need to know when. The "slowly" in Slowly Changing Dimension is key here.

**4. Point-in-Time Reporting**

Management wants to see dashboards "as they were" on specific dates. Month-end reports need to reflect the data state at month-end, not current state. SCD Type 2 enables time-travel queries.

**When NOT to use SCD Type 2:**

- Attributes that change very frequently (use Type 1 or separate fact tables)
- When storage cost is critical and history isn't needed
- Real-time operational systems (adds complexity and query overhead)
- When only current state matters and no one will ever ask historical questions

## 5 Common Interview Questions

### Question 1: Tell me about a time when you implemented SCD Type 2. What was the business requirement?

Situation:

In my previous role, we were building a data warehouse for an NHS organization that tracked patient appointments across multiple GP practices. The business needed to analyze historical appointment patterns, but GP practices frequently changed their operating hours, available services, and even merged with other practices. The reporting team was getting incorrect historical reports because we were only storing current practice information.

Task:

I was responsible for redesigning the Practice dimension table to track historical changes accurately. The key requirement was that when analysts ran reports for "Q1 2023 appointment rates," they should see practice details as they existed in Q1 2023, not current details. Additionally, we needed to track when practices merged or closed for capacity planning.

Action:

I implemented SCD Type 2 on the Practice dimension with these specific fields: Practice_Key (surrogate key), Practice_ID (natural key), Practice_Name, Operating_Hours, Services_Offered, Effective_Start_Date, Effective_End_Date, and Is_Current flag. I built a merge stored procedure that compared incoming data with existing records. When changes were detected in tracked attributes, it expired the old record by setting End_Date to yesterday and Is_Current to false, then inserted a new record with today's Start_Date. For the appointment fact table, I ensured it used Practice_Key (surrogate) not Practice_ID (natural) so historical appointments pointed to the correct historical practice version.

Result:

Historical reports became accurate. When the team analyzed appointment trends over 3 years, they could now see how practice changes affected capacity. For example, they discovered that a practice merger in 2022 initially caused appointment backlogs because the combined operating hours didn't match the sum of individual practices. This insight led to better planning for future mergers. The audit team also appreciated having complete change history for compliance reviews.

### Question 2: How do you handle SCD Type 2 updates in your ETL pipeline? Walk me through your approach.

Situation:

At my previous company, we had a customer dimension with over 2 million records that needed daily SCD Type 2 processing. The challenge was that the source system sent full extracts daily, and we needed to identify changes efficiently without comparing every field for every record, which was taking over 4 hours and causing downstream delays.

Task:

I needed to redesign the SCD Type 2 logic to process the daily customer feed within a 1-hour window while maintaining complete history accuracy. The ETL had to detect changes in address, phone, email, and customer tier, then create new versions appropriately.

Action:

I implemented a hash-based change detection approach. First, I created a computed hash column combining all tracked attributes using HASHBYTES in SQL Server. In the staging layer, I calculated the same hash for incoming records. Then I used a MERGE statement that compared only the hash values between staging and the current dimension (where Is_Current = 1). This reduced comparison overhead by 80%. For actual changes detected, the MERGE performed three operations: UPDATE to expire old records (set End_Date and Is_Current), INSERT new versions with new surrogate keys, and a simple UPDATE for records with no changes to tracked attributes but updated non-tracked fields like Last_Updated_Timestamp. I also added data quality checks to handle edge cases like records appearing, disappearing, and reappearing.

Result:

Processing time dropped from 4 hours to 35 minutes. The hash comparison approach made change detection nearly instantaneous. We successfully maintained complete history while meeting the processing window. An unexpected benefit was that the hash column also helped with data quality monitoring because sudden spikes in changed records indicated potential source system issues, which we caught twice before they affected reporting.

### Question 3: What's the difference between SCD Type 1 and Type 2, and when would you choose each?

**Short Answer:**

**Type 1:** Overwrites old values with new values. No history kept. Use when you only need current state and history doesn't matter (e.g., correcting data entry errors, updating email addresses).

**Type 2:** Creates new records for changes, preserving complete history. Use when you need to track changes over time for analysis, compliance, or audit (e.g., customer addresses, product categories, employee departments).

**Example Decision:**

**Customer phone number:** Use Type 1. When a customer updates their phone, you just need the current one. Old numbers aren't analytically useful.

**Customer loyalty tier:** Use Type 2. Business wants to analyze "How long do customers stay in Gold tier on average?" This requires history.

### Question 4: How do you query SCD Type 2 tables to get current vs historical data?

**Get Current Records:**

`SELECT * FROM Dim_Customer WHERE Is_Current = 1;`

Or:

`SELECT * FROM Dim_Customer WHERE End_Date = '9999-12-31';`

**Get Historical State at Specific Date:**

`
SELECT *
FROM Dim_Customer
WHERE '2023-03-15' BETWEEN Start_Date AND End_Date;
            `

This returns how customers looked on March 15, 2023.

**Join Facts with Correct Historical Dimension:**

`
SELECT f.Order_Date, c.Customer_Name, c.Tier, f.Order_Amount
FROM Fact_Orders f
JOIN Dim_Customer c ON f.Customer_Key = c.Customer_Key
WHERE f.Order_Date BETWEEN '2023-01-01' AND '2023-12-31';
            `

The fact table stores the surrogate key (Customer_Key), so it automatically joins to the correct historical version.

### Question 5: What challenges have you faced with SCD Type 2 and how did you solve them?

**Common Challenges & Solutions:**

**1. Storage Growth:** History accumulates quickly. Solution: Implement archival strategy for very old versions to cheaper storage, or use data retention policies based on compliance requirements.

**2. Query Performance:** More records mean slower queries. Solution: Partition tables by date ranges, create filtered indexes on Is_Current flag, and educate users to always filter by date ranges or Is_Current.

**3. Late-Arriving Facts:** Fact records arrive after dimension changes. Solution: Use effective dating on facts and implement logic to join to the correct dimension version based on transaction date, not load date.

**4. Handling Deletes:** Source records disappear. Solution: Add a status column (Active/Inactive/Deleted) rather than physically deleting. Close the record with End_Date but keep it for historical fact references.

**5. Performance of Daily Loads:** Full comparison is slow. Solution: Use hash columns to quickly identify changes, or implement CDC (Change Data Capture) at source to receive only changed records.

## Key Takeaways

- SCD Type 2 is for tracking complete history of dimension changes
- Use it when business needs historical analysis, compliance, or point-in-time reporting
- Don't use it for rapidly changing attributes or when only current state matters
- Implementation requires surrogate keys, effective dates, and current flags
- Performance optimization is critical: use hashing, partitioning, and proper indexing
- Always use surrogate keys in fact tables, never natural keys

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/scd-type-2-when-to-use-it.html).*
