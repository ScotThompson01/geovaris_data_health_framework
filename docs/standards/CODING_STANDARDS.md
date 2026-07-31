Project: GeoVaris Data Health Framework™
Backlog Item: P1-104
Document Owner: GeoVaris
Status: Draft
Version: 1.0
Last Updated: 2026-07-31

# GeoVaris Data Health Framework™

# Coding Standards

Version: 1.0

## Purpose

These standards establish a consistent development approach for the GeoVaris Data Health Framework™.

---

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- React
- PostgreSQL
- Drizzle ORM
- Azure Blob Storage

---

## Source Control

- All work is completed on feature branches.
- No direct development on `main`.
- Pull Requests required before merge.
- Squash and Merge is the preferred merge strategy.

---

## Naming Standards

### Files

Use kebab-case.

Example:

client-card.tsx

---

### Components

Use PascalCase.

Example:

ClientCard.tsx

---

### Variables

Use camelCase.

Example:

clientName

---

### Interfaces

Prefix with I.

Example:

IClient

---

### Database Tables

Plural.

Examples:

clients

assessments

users

organizations

---

### Primary Keys

id

---

### Foreign Keys

clientId

organizationId

assessmentId

---

## Formatting

- TypeScript only
- ESLint enabled
- No unused variables
- Prefer reusable components

---

## Documentation

All significant features must include documentation updates.

---

## Git Commit Format

feat:

fix:

docs:

refactor:

chore:

test:

Example:

feat(P1-201): create assessment dashboard