---
title: "Clean Code"
date: "2026-06-02"
category: "Books"
author: "The Mahesh"
author_book: "Robert C. Martin"
excerpt: "The discipline of writing code that people want to read"
rating: 4
---

# Clean Code

**By Robert C. Martin**

## What It's About

How to write code that's not just functional—it's readable, maintainable, and elegant. Covers naming, functions, error handling, and refactoring.

## Why I Read It

I was writing code that worked. But when I came back to it months later, I couldn't understand my own code. This book taught me why that happens and how to prevent it.

## Key Concepts

### Meaningful Names
A variable called `d` is different from `daysSinceCreation`. One is a puzzle. One is clear.

### Functions Should Do One Thing
Not: "Get user and validate and log and update database"  
Yes: "Get user" (one function does one job)

### Handle Errors Gracefully
Don't swallow exceptions. Don't return null. Use specific error types that communicate what went wrong.

## The Best Part

The chapter on refactoring. Shows real code that's terrible, then improves it step by step. Each change is small, safe, and meaningful.

You see how good code isn't born. It's grown.

## Who Should Read This

- Any developer who writes code other people will read (everyone)
- Code reviewers trying to articulate why code feels "bad"
- Junior developers building habits early
- Senior developers reinforcing fundamentals

## A Word of Caution

Some of it is dogmatic. Not every principle applies everywhere. But the underlying idea is sound: code is read more than it's written.

Optimize for readers, not writers.

---

**Published:** 2026-06-02  
**Rating:** 4/5 ⭐  
**Reading Time:** ~6 minutes
