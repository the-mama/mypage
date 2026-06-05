---
title: "dbt Project Structure & Best Practices"
date: "2026-06-03"
category: "Resources"
author: "The Mahesh"
type: "guide"
excerpt: "How to organize and structure a production-grade dbt project"
---

# dbt Project Structure & Best Practices

## What It Is

A reference guide for organizing dbt projects in a scalable, maintainable way that works across team sizes.

## Why It's Useful

Bad dbt structure leads to:
- Circular dependencies
- Slow runs
- Difficult testing
- Messy handovers

Good structure prevents all of that.

## Folder Organization

```
dbt_project/
├── models/
│   ├── staging/          # Raw → clean (1:1 transformations)
│   │   ├── stg_customers.sql
│   │   ├── stg_orders.sql
│   │   └── stg_payments.sql
│   ├── intermediate/     # Business logic
│   │   ├── int_customer_orders.sql
│   │   └── int_order_payments.sql
│   └── marts/            # Final, user-facing tables
│       ├── fct_orders.sql
│       ├── dim_customers.sql
│       └── dim_dates.sql
├── tests/
│   ├── generic/
│   ├── singular/
│   └── staging/
├── macros/
├── seeds/
└── snapshots/
```

## The Three Layers (Medallion)

### Staging (`stg_*`)
- 1-to-1 with source
- Rename, cast, basic cleaning
- No joins or aggregations
- Tag: `@staging`

### Intermediate (`int_*`)
- Join and aggregate
- Business logic
- Hidden from end users
- Tag: `@intermediate`

### Marts (`fct_*`, `dim_*`)
- Final, exposed tables
- Ready for analysts/BI tools
- Fact (aggregated) and dimension (lookup) tables
- Tag: `@marts`

## Naming Conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| Staging | stg_{source}_{entity} | stg_salesforce_accounts |
| Intermediate | int_{verb}_{noun} | int_customers_with_revenue |
| Fact | fct_{grain} | fct_daily_orders |
| Dimension | dim_{entity} | dim_customers |

## Testing Strategy

```yaml
# dbt_project.yml
tests:
  staging:
    - unique
    - not_null
    - relationships
  marts:
    - dbt_expectations
    - custom_tests
```

**Minimal tests by layer:**
- Staging: not_null on primary keys
- Marts: all of the above + data quality checks

## Performance Tips

- Filter early (staging level)
- Materialize as table (not view) for marts
- Use ref() not source() for internal dependencies
- Snapshot only when necessary
- Version your sources

## Common Mistakes

❌ All logic in one model  
✅ Break into logical layers

❌ No documentation  
✅ Document every model with its purpose

❌ Unclear column names  
✅ Use clear, consistent naming

❌ No tests  
✅ Test data quality at each layer

## Commands You'll Use

```bash
dbt run                    # Run all models
dbt test                   # Run all tests
dbt run --select staging   # Run specific layer
dbt run -s +my_model       # Run my_model + downstream
dbt snapshot               # Capture point-in-time
dbt docs generate; dbt docs serve  # Generate documentation
```

## Best Practice Checklist

- [ ] Clear folder structure (staging → intermediate → marts)
- [ ] Consistent naming conventions
- [ ] Documentation on every model
- [ ] Tests on critical paths
- [ ] CI/CD pipeline running on every PR
- [ ] Versions pinned in packages.yml
- [ ] Clear understanding of materialization strategy

---

**Published:** 2026-06-03  
**Category:** Resources  
**Reading Time:** ~6 minutes
