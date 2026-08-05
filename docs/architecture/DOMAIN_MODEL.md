# GeoVaris Assessment Platform™

# Domain Model

Project: GeoVaris Data Health Framework™
Backlog Item: P1-105
Owner: GeoVaris
Status: Draft
Version: 1.0
Last Updated: 2026-08-03


## Executive Overview

The GeoVaris Assessment Platform is a configurable, metadata-driven assessment platform designed to execute multiple assessment methodologies without requiring software changes.

Rather than embedding questionnaires, scoring rules, or report structures into application code, the platform derives its behavior from versioned database configuration.

Assessment methodologies define the business knowledge of the platform.

Questionnaire templates define how an assessment is conducted.

Assessment instances capture responses, evidence, findings, scores, and recommendations.

The domain model defines the business entities and relationships that support this platform independently of any programming language, database technology, or user interface.

## Core Business Domains

The platform consists of the following business domains.

### Organization Management

Responsible for:

- Organizations
- Users
- Roles
- Permissions
- Tenant isolation

---

### Client Management

Responsible for:

- Clients
- Contacts
- Systems
- Data Sources
- Engagements

---

### Methodology Management

Responsible for:

- Assessment methodologies
- Questionnaire templates
- Template versions
- Publication workflow

---

### Assessment Management

Responsible for:

- Assessments
- Responses
- Evidence
- Findings
- Scores
- Recommendations
- Roadmaps

---

### Reporting

Responsible for:

- Executive reports
- Scorecards
- Dashboards
- Exported documents

---

### Administration

Responsible for:

- Platform configuration
- Security
- Audit history
- System monitoring

## Core Business Entities
Organization

User

Role

Permission

Client

Contact

Data Source

Assessment Methodology

Questionnaire Template

Questionnaire Version

Question Section

Question

Answer Option

Evidence Requirement

Scoring Rule

Maturity Model

Recommendation Rule

Assessment

Assessment Response

Evidence

Score

Finding

Recommendation

Roadmap

Report

## Core Entity Relationships

The GeoVaris Assessment Platform is organized around five primary business concepts:

1. Organization
2. Client
3. Assessment Methodology
4. Assessment Template
5. Assessment

The relationships are:

```text
Organization
    │
    ├── Users
    ├── Clients
    ├── Assessment Methodologies
    └── Assessment Templates

Client
    │
    ├── Contacts
    ├── Data Sources
    ├── Systems
    └── Assessments

Assessment Methodology
    │
    └── Assessment Templates
            │
            └── Assessment Template Versions
                    │
                    ├── Sections
                    ├── Questions
                    ├── Answer Options
                    ├── Evidence Requirements
                    ├── Scoring Rules
                    ├── Maturity Levels
                    └── Recommendation Rules

Assessment
    │
    ├── Responses
    ├── Evidence
    ├── Scores
    ├── Findings
    ├── Recommendations
    ├── Roadmap Items
    └── Reports



## Assessment Lifecycle

An assessment follows this lifecycle:

```text
Draft
  ↓
Configured
  ↓
Published Template Selected
  ↓
Assessment Started
  ↓
Responses and Evidence Collected
  ↓
Assessment Submitted
  ↓
Scoring Completed
  ↓
Assessor Review
  ↓
Findings and Recommendations Approved
  ↓
Reports Generated
  ↓
Assessment Completed
  ↓
Archived  

