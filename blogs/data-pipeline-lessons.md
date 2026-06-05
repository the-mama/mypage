---
title: "What They Don't Tell You About Building Data Pipelines"
date: "2026-06-02"
category: "Data Engineering"
author: "The Mahesh"
tags: ["data-engineering", "pipelines", "lessons-learned"]
excerpt: "The gap between tutorial pipelines and production systems"
---

# What They Don't Tell You About Building Data Pipelines

## The Tutorial vs. Reality Gap

Tutorials show you the happy path:
```
1. Read data
2. Transform it
3. Write to warehouse
4. Success!
```

Production is:
```
1. Read data (but handle schema drift)
2. Transform it (but what if upstream is down?)
3. Write to warehouse (but handle duplicates)
4. Monitor it (catch failures before users see them)
5. Debug yesterday's broken pipeline
6. Explain data quality issues to analysts
7. Refactor because your pattern doesn't scale
```

## Lesson 1: Idempotency Saves You

Most engineers learn this by causing a production incident.

I learned it by causing three.

**The problem:** Your pipeline runs twice (accidental retry, scheduler glitch, manual re-run). Now you have duplicate data.

**The solution:** Make your transformations idempotent.
- Insert or update (not append)
- Hash your keys consistently
- Test: "If I run this twice, does the output change?"

**Real example:** Our ADF incremental load crashed mid-execution. The manual re-run added duplicates to 2 years of historical data. We fixed it by implementing idempotent inserts.

## Lesson 2: Schema Evolution Will Bite You

Your schema won't stay static.

New fields appear. Types change. Nested structures get renamed.

**What breaks:**
- Schemas in Spark that expect 10 columns but get 12
- Fixed ETL code that assumes column order
- Type mismatches (int vs. string versions)

**What saves you:**
- Schema inference with fallbacks
- Explicit type casting with defaults
- Monitor schema changes actively

## Lesson 3: You Need Observability, Not Just Monitoring

**Monitoring:** "Did the job finish?"
**Observability:** "Why did the job take 3x longer than yesterday?"

**What I measure:**
- Row counts in/out (are we missing data?)
- Execution time (is it degrading?)
- Error rates by stage (where do things break?)
- Data freshness (when was this last updated?)

Most teams have 0 of these. Then wonder why their data is bad.

## Lesson 4: Data Quality Is a Requirement, Not a Feature

It's easier to catch bad data when you're writing it than when analysts complain.

I now implement quality checks:
```
- Nulls in critical columns (flag it)
- Unexpected value ranges (reject)
- Foreign key violations (alert)
- Duplicate keys (investigate)
```

These checks cost 10% more compute but save 100% of the chaos.

## Lesson 5: Your Incremental Load Will Fail Mysteriously

One day, your watermark logic breaks.

Reasons I've seen:
- Data arrives out of order (update timestamp older than the watermark)
- System clock skew between servers
- Timezone assumptions (UTC? local time? which timezone?)
- Your source deletes old data

**The fix:** Build in tolerance.
- Replay the last 7 days
- Don't delete, mark as deleted
- Double-check your watermark logic

## Lesson 6: Orchestration Matters More Than You Think

A missing comma in your orchestration config can cascade failures across dependent pipelines.

**What I've learned:**
- Version your orchestration configs (dbt projects, ADF pipelines)
- Test DAG logic in dev before production
- Catch circular dependencies (they're sneaky)
- Build retry logic that's smart (not every failure should retry)

## Lesson 7: You'll Spend 80% of Your Time on Edge Cases

The 80/20 rule applies here:
- Core logic: 20% of your effort
- Error handling, retries, monitoring, edge cases: 80%

Budget accordingly.

## What I Actually Do Now

**Before deploying any pipeline:**

1. ✅ Does it handle late-arriving data?
2. ✅ Does it handle schema changes?
3. ✅ Is it idempotent?
4. ✅ What are the failure modes?
5. ✅ Can I monitor it?
6. ✅ Can I replay it if needed?

If I can't confidently say yes to all 6, it's not going to production.

## The Mindset Shift

Stop thinking: "Does this transform data correctly?"
Start thinking: "What could go wrong, and how do I recover?"

Production pipelines don't fail silently—they fail messily. Your job is to make the failure visible, recoverable, and rare.

## Reality Check

I've built pipelines that:
- Lost data (schema wasn't nullable)
- Duplicated data (orchestration bug)
- Ran for 12 hours (no optimization)
- Broke on a Sunday (nobody to fix it)

Every one taught me something. You don't need to learn all these lessons yourself—you just need to read about them here.

---

**Published:** 2026-06-02  
**Category:** Data Engineering  
**Reading Time:** ~8 minutes
