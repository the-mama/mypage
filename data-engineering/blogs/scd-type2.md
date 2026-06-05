---
title: "Slowly Changing Dimensions Type 2"
date: "2026-05-30"
category: "Data Modeling"
author: "The Mahesh"
excerpt: "How to preserve dimension history with effective dates and current flags."
tags: "SQL, Data Warehouse, Kimball"
---

# Slowly Changing Dimensions Type 2

SCD Type 2 preserves history when dimension attributes change.

## Example

If a customer changes address, you do not overwrite the old address. You expire the old row and insert a new current row.

## Table Design

Useful columns include a surrogate key, natural key, effective start date, effective end date, current flag, and changed attributes.

## Load Steps

1. Compare incoming records against current dimension rows.
2. Expire rows where tracked attributes changed.
3. Insert a new row for the latest version.

## Common Mistakes

- Not handling null comparisons.
- Forgetting the natural key in joins.
- Missing indexes on current records.
- Tracking attributes that should not trigger history.

## Takeaway

SCD Type 2 is about answering historical questions accurately: what did we know at that point in time?
