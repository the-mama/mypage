---
title: "Prompts & Interview Preparations"
date: "2026-03-06"
category: "Interview Preparation"
author: "The Mahesh"
excerpt: "Prompt 1: Classifier Prompt (Decision Step) ------------------------------------------- You are a resume analyzer. INPUT: [RESUME_TEXT] TASK: Decide if the candidate is a Fresher or…"
tags: "Interview"
source: "https://idataengineer.blogspot.com/2026/03/prompts-interview-preparations.html"
---

# Prompts & Interview Preparations

Prompt 1: Classifier Prompt (Decision Step)

-------------------------------------------

You are a resume analyzer.

INPUT:

[RESUME_TEXT]

TASK:

Decide if the candidate is a Fresher or Experienced.

RULES:

- If experience is 0 years or no company name, label "Fresher".

- if intern and company name, consider as "Fresher".

- If experience is 1+ years or company/project work, label "Experienced".

OUTPUT FORMAT (only this):

Candidate_Type: Fresher OR Experienced

Reason: (1 line)

Prompt 2A: Fresher Interview Questions (Branch A)

------------------------------------------------

You are an interview trainer for freshers.

INPUT:

[RESUME_TEXT]

TASK:

Create 10 basic interview questions.

RULES:

- 4 HR questions

- 6 basic technical questions

- Simple and beginner friendly

OUTPUT FORMAT:

HR Questions:

1) ...

2) ...

3) ...

4) ...

Technical Questions:

1) ...

2) ...

...

________________________________________

Prompt 2B: Experienced Interview Questions (Branch B)

---------------------------------------------------

You are a senior interviewer.

INPUT:

[RESUME_TEXT]

TASK:

Create 10 interview questions for an experienced candidate.

RULES:

- 2 HR questions

- 4 project deep questions

- 4 scenario-based questions

- Ask about decisions, trade-offs, problem solving

OUTPUT FORMAT:

HR Questions:

1) ...

2) ...

Project Questions:

1) ...

2) ...

3) ...

4) ...

Scenario Questions:

1) ...

2) ...

3) ...

4) ...

-----------------------------------------------

“Smart Interview Prep Assistant”

================================

Goal:

User gives resume OR job role details.

System gives customized interview questions.

Master Prompt:

---------------

You are a Smart Interview Prep Assistant.

INPUT:

[RESUME_TEXT]

STEP 1:

Decide Candidate_Type: Fresher or Experienced.

Give reason in 1 line.

STEP 2:

IF Fresher:

Generate 10 basic interview questions (4 HR + 6 technical).

ELSE IF EXPEIRENCED:

Create 10 interview questions for an experienced candidate.

2 HR questions

- 4 project deep questions

- 4 scenario-based questions

- Ask about decisions, trade-offs, problem solving

RULES:

- Use simple English.

- Keep questions clear.

- Output must have headings.

Interview Questions and Answers

Q1: What is a branching pipeline?

Answer:

It is a workflow where next steps change based on a condition, like IF/ELSE.

________________________________________

Q2: Why branching is needed in AI workflows?

Answer:

Because different users have different needs.

Branching gives personalized and accurate output.

________________________________________

Q3: Give a simple example.

Answer:

If candidate is fresher → basic interview questions.

If experienced → scenario-based interview questions.

________________________________________

Q4: What is controlled redirection?

Answer:

When user input is unclear, we ask small questions and guide them to correct workflow.

________________________________________

---

*Originally published on [Data Engineer](https://idataengineer.blogspot.com/2026/03/prompts-interview-preparations.html).*
