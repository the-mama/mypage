---
title: "The Most Asked SQL Interview Question on SCD Type 2"
date: "2026-01-07"
category: "SQL"
author: "The Mahesh"
excerpt: "If you interview for Data Engineer roles, one question appears again and again: “How do you implement SCD Type 2 in SQL?” Interviewers ask this because it reveals whether you can design…"
tags: "SQL, SCD Type 2, Interview"
source: "https://idataengineer.blogspot.com/2026/01/the-most-asked-sql-interview-question.html"
---

# The Most Asked SQL Interview Question on SCD Type 2

BLOGGER POST (HTML) — Paste into Blogger "HTML view"

If you interview for Data Engineer roles, one question appears again and again:
 **“How do you implement SCD Type 2 in SQL?”**
 Interviewers ask this because it reveals whether you can design reliable historical tracking — not just write SELECT queries.

The question (as asked in interviews)

You have a **Dimension table** that must keep full history. A **staging table** arrives daily.
 Write SQL to:

1) **Expire** the current record when a change happens

2) **Insert** a new version as the current record

3) Do nothing when there is **no change**

4) Insert brand-new business keys as **new customers**

## SCD Type 2 in one line

**When a tracked attribute changes, close the old row and insert a new row.**
 That is the entire SCD2 concept — the rest is just correct SQL and clean conditions.

---

## Tables used (simple and interview-friendly)

DimCustomer (SCD2 Target)

| Column | Meaning |
| --- | --- |
| customer_sk | Surrogate key (identity) |
| customer_id | Business key (natural key) |
| customer_name | Tracked attribute |
| city | Tracked attribute |
| valid_from | Row start date/time |
| valid_to | Row end date/time (NULL = current) |
| is_current | 1 = current record, 0 = expired |

StgCustomer (Daily Incoming Snapshot)

| Column | Meaning |
| --- | --- |
| customer_id | Business key |
| customer_name | Latest value |
| city | Latest value |

---

## The core logic interviewers expect

1. **Match** staging rows to the current dimension row using **business key** (customer_id)
2. **Detect change** only on tracked attributes (customer_name, city)
3. If changed: **expire** old row (valid_to, is_current)
4. Then **insert** a new row with updated values and valid_from
5. If new customer_id: **insert** directly

---

## SCD Type 2 SQL solution (2-step approach)

This is the cleanest way to answer in an interview: first **expire**, then **insert**.
 It avoids confusion and makes your logic easy to validate.

Step 1: Expire current rows when a change is detected

```
-- Expire rows where business key matches AND tracked attributes changed
UPDATE d
SET
    d.valid_to   = CURRENT_TIMESTAMP,
    d.is_current = 0
FROM DimCustomer d
JOIN StgCustomer s
  ON s.customer_id = d.customer_id
WHERE d.is_current = 1
  AND (
        ISNULL(d.customer_name, '') <> ISNULL(s.customer_name, '')
     OR ISNULL(d.city, '')          <> ISNULL(s.city, '')
  );

```

Step 2: Insert new current rows (new keys + changed keys)

```
-- Insert:
--   A) brand-new customers (no row exists in dimension)
--   B) customers that changed (old row was expired, so no current row exists now)
INSERT INTO DimCustomer
(
    customer_id,
    customer_name,
    city,
    valid_from,
    valid_to,
    is_current
)
SELECT
    s.customer_id,
    s.customer_name,
    s.city,
    CURRENT_TIMESTAMP AS valid_from,
    NULL              AS valid_to,
    1                 AS is_current
FROM StgCustomer s
LEFT JOIN DimCustomer d
  ON d.customer_id = s.customer_id
 AND d.is_current  = 1
WHERE d.customer_id IS NULL;

```

---

## Why this answer impresses interviewers

- **No duplicates**: only one current row per business key (is_current = 1)
- **History preserved**: old values remain with valid_to stamped
- **Idempotent behavior**: if the same snapshot re-runs, nothing changes
- **Readable logic**: easy to explain, easy to troubleshoot

## Interview one-liner (memorize this)

“I compare today’s staging snapshot to the current dimension row by business key, expire the current row only if tracked attributes changed,
 and then insert a new version as the current record with updated valid_from/valid_to dates.”

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/01/the-most-asked-sql-interview-question.html).*
