---
title: "ADF Incremental Load Pattern"
date: "2026-06-01"
category: "ETL/ELT"
author: "The Mahesh"
excerpt: "Production-grade incremental loading with a watermark strategy."
tags: "Azure Data Factory, ETL, Production"
---

# ADF Incremental Load Pattern

Incremental loads keep pipelines efficient by copying only new or changed records.

## The Pattern

Store the last successful watermark in a control table. On the next run, query only records newer than that watermark.

## Control Table

Track the source name, target name, watermark column, last successful value, and last run status.

## Pipeline Flow

1. Read the current watermark.
2. Copy changed records from source to staging.
3. Merge into the target table.
4. Update the watermark only after success.

## Watch Outs

- Handle late-arriving records with a small overlap window.
- Make loads idempotent so reruns do not duplicate data.
- Separate inserts from updates when the target requires merge logic.

## Takeaway

Never update the watermark before the target is safely written. That is how data disappears.
