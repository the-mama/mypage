---
title: "Automating Azure Databricks with Databricks SDK (Python) – Step by Step Guide"
date: "2026-01-10"
category: "Databricks"
author: "The Mahesh"
excerpt: "When working with Azure Databricks, creating clusters, jobs, repos, and secrets manually from the UI does not scale. For real-world data engineering projects, automation is essential. In…"
tags: "Databricks, Azure, Automation, VS Code"
source: "https://idataengineer.blogspot.com/2026/01/automating-azure-databricks-with.html"
---

# Automating Azure Databricks with Databricks SDK (Python) – Step by Step Guide

When working with Azure Databricks, creating clusters, jobs, repos, and secrets manually from the UI does not scale.
For real-world data engineering projects, automation is essential.

In this post, I explain **how to automate Azure Databricks resource creation using the Databricks SDK for Python**,
step by step, in a clear and practical way.

---

## Why use Databricks SDK?

- Infrastructure as Code (IaC) for Databricks
- Repeatable and consistent environments
- Easy CI/CD integration
- Less manual UI work, fewer errors

---

## Prerequisites

- An existing Azure Databricks workspace
- Permission to create clusters, jobs, repos, and secrets
- Python 3.9 or above
- Databricks Personal Access Token (PAT)

---

## Step 1: Create Python Virtual Environment

```
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
```

---

## Step 2: Install Databricks SDK

```
pip install databricks-sdk
```

---

## Step 3: Configure Authentication

Set the Databricks workspace URL and PAT token as environment variables.

```
export DATABRICKS_HOST="https://adb-<workspace-id>.<region>.azuredatabricks.net"
export DATABRICKS_TOKEN="<your_personal_access_token>"
```

*This allows the SDK to authenticate securely without hardcoding credentials.*

---

## Step 4: Test Connection to Databricks

```
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()
me = w.current_user.me()
print("Connected as:", me.user_name)
```

If this runs successfully, your SDK connection is working.

---

## Step 5: Create a Databricks Cluster using SDK

```
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

cluster = w.clusters.create(
    cluster_name="demo-sdk-cluster",
    spark_version="13.3.x-scala2.12",
    node_type_id="Standard_DS3_v2",
    num_workers=1,
    autotermination_minutes=20
)

print("Cluster ID:", cluster.cluster_id)
```

This creates a cluster programmatically instead of using the Databricks UI.

---

## Step 6: Create a Databricks Job

```
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.jobs import Task, NotebookTask, NewCluster

w = WorkspaceClient()

job = w.jobs.create(
    name="demo-sdk-job",
    tasks=[
        Task(
            task_key="run_notebook",
            notebook_task=NotebookTask(
                notebook_path="/Shared/demo_notebook"
            ),
            new_cluster=NewCluster(
                spark_version="13.3.x-scala2.12",
                node_type_id="Standard_DS3_v2",
                num_workers=1
            )
        )
    ]
)

print("Job ID:", job.job_id)
```

This is the recommended way to run production workloads using **job clusters**.

---

## Step 7: Create Databricks Repo (Git Integration)

```
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

repo = w.repos.create(
    url="https://github.com/your-org/your-repo.git",
    provider="gitHub",
    path="/Repos/demo-sdk-repo"
)

print("Repo created:", repo.id)
```

This enables Git-based development directly inside Databricks.

---

## Step 8: Create Secret Scope and Secrets

```
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

w.secrets.create_scope(scope="demo-scope")
w.secrets.put_secret(
    scope="demo-scope",
    key="storage_key",
    string_value="my-secret-value"
)
```

Secrets should always be stored securely instead of being hardcoded.

---

## Best Practices

- Use job clusters instead of all-purpose clusters
- Store configuration in YAML/JSON files
- Make scripts idempotent (check before create)
- Integrate SDK scripts into CI/CD pipelines

---

## Conclusion

The Databricks SDK allows data engineers to fully automate workspace setup,
making environments reproducible, secure, and production-ready.

If you are serious about Databricks in enterprise projects, SDK-based automation is not optional — it is essential.

---

**Happy Automating 🚀**
