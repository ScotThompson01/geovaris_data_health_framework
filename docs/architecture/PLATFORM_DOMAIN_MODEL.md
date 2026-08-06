# GeoVaris Assessment Platform™

## Platform Domain Model

**Project:** GeoVaris Data Health Framework™  
**Backlog Item:** P2-203  
**Owner:** GeoVaris  
**Status:** Draft  
**Version:** 1.0  
**Last Updated:** 2026-08-06

---

## 1. Purpose

This document defines the core business concepts, terminology, responsibilities, and relationships of the GeoVaris Assessment Platform™.

The domain model is independent of any specific database, programming language, cloud provider, or user interface. It establishes the business language that will guide:

- Database design
- Application services
- User-interface design
- API design
- Security and authorization
- Assessment configuration
- Scoring
- Reporting
- Future product development

The GeoVaris Assessment Platform is the reusable software platform.

The GeoVaris Data Health Framework™ is the first commercial framework configured and delivered through the platform.

---

## 2. Platform Vision

The GeoVaris Assessment Platform is a configurable, metadata-driven platform for creating, administering, scoring, reviewing, and reporting organizational assessments.

The platform is designed to support multiple GeoVaris assessment products without requiring a separate software application for each product.

Examples include:

- GeoVaris Data Health Framework™
- Data Governance Maturity Framework
- AI Readiness Framework
- GIS Data Health Framework
- Broadband Data Quality Framework
- FCC Regulatory Readiness Framework
- Client-specific assessment frameworks

The platform provides shared capabilities for:

- Organization and client management
- Framework configuration
- Assessment methodology management
- Template versioning
- Dynamic questionnaires
- Evidence collection
- Scoring
- Findings
- Recommendations
- Roadmaps
- Executive reporting
- Audit history

---

## 3. Core Domain Hierarchy

The primary configuration hierarchy is:

```text
GeoVaris Assessment Platform
        │
        └── Framework
                │
                └── Methodology
                        │
                        └── Assessment Template
                                │
                                └── Template Version
                                        │
                                        ├── Sections
                                        ├── Questions
                                        ├── Answer Options
                                        ├── Evidence Requirements
                                        ├── Validation Rules
                                        ├── Scoring Rules
                                        ├── Maturity Levels
                                        └── Recommendation Rules
```

The primary execution hierarchy is:

```text
Organization
        │
        └── Client
                │
                └── Assessment
                        │
                        ├── Participants
                        ├── Scope
                        ├── Responses
                        ├── Evidence
                        ├── Scores
                        ├── Findings
                        ├── Recommendations
                        ├── Roadmap
                        └── Reports
```

---

## 4. Domain Terminology

### 4.1 Platform

The **Platform** is the software capability that executes configured assessment products.

The platform provides reusable technical capabilities such as:

- Authentication
- Authorization
- Tenant isolation
- Client management
- Configuration management
- Assessment execution
- Scoring
- Reporting
- Audit logging
- File and evidence management

The platform itself does not define the content of any particular assessment.

There is one GeoVaris Assessment Platform deployment, but it may support many organizations, frameworks, methodologies, templates, clients, and assessments.

### 4.2 Framework

A **Framework** is a named GeoVaris assessment product that organizes related methodologies under a common commercial purpose, brand, and value proposition.

Examples:

- GeoVaris Data Health Framework™
- AI Readiness Framework
- Broadband Data Quality Framework

A framework may define:

- Product name
- Product code
- Description
- Branding
- Intended market
- Business objectives
- Default terminology
- Documentation
- Licensing rules
- One or more methodologies

A framework is a product-level concept. It does not directly contain client responses or assessment results.

### 4.3 Methodology

A **Methodology** defines the repeatable approach used to measure a particular subject or capability.

A methodology answers:

> What are we evaluating, and how do we evaluate it?

Examples within the GeoVaris Data Health Framework may include:

- Enterprise Data Health
- Data Governance Maturity
- Data Quality Maturity
- Analytics Maturity
- AI Readiness

A methodology may define:

- Purpose
- Scope
- Assessment domains
- Measurement approach
- Maturity model
- Scoring philosophy
- Expected deliverables
- One or more assessment templates

A methodology belongs to one framework.

### 4.4 Assessment Template

An **Assessment Template** defines a reusable assessment configuration for a specific audience, industry, scope, or delivery model.

Examples:

- Small Business Data Health Assessment
- Enterprise Data Health Assessment
- Telecommunications Data Governance Assessment
- Healthcare AI Readiness Assessment
- Custom Client Assessment

A template may contain:

- Sections
- Questions
- Answer types
- Guidance
- Evidence requirements
- Validation rules
- Scoring rules
- Recommendation mappings
- Report configuration

An assessment template belongs to one methodology.

### 4.5 Assessment Template Version

An **Assessment Template Version** is an immutable published configuration of an assessment template.

Examples:

```text
1.0
1.1
2.0
```

A version contains the exact configuration used to conduct an assessment.

Rules:

- Draft versions may be edited.
- Published versions are immutable.
- Changes to a published version require a new version.
- Each assessment references one published template version.
- Historical assessments remain linked to the version under which they were performed.
- Updating a template must not silently change historical scores or reports.

### 4.6 Section

A **Section** groups related assessment content.

Depending on the methodology, a section may represent a:

- Pillar
- Domain
- Category
- Capability
- Process area
- Topic
- Subsection

Sections may be nested, ordered, weighted, optional, or required.

Example:

```text
Data Governance
    ├── Ownership
    ├── Stewardship
    ├── Policies
    └── Decision Rights
```

### 4.7 Question

A **Question** is a configured assessment item presented to a participant or assessor.

A question may define:

- Question text
- Guidance
- Answer type
- Required status
- Weight
- Applicability
- Conditional logic
- Evidence requirements
- Validation behavior
- Scoring behavior
- Recommendation mappings

Questions are stored as configuration and must not be hardcoded into application pages.

### 4.8 Answer Option

An **Answer Option** is an allowed response value for a configured question.

Examples:

```text
Yes
Partially
No
Not Applicable
```

or:

```text
1 — Initial
2 — Developing
3 — Defined
4 — Managed
5 — Optimized
```

An answer option may include:

- Display label
- Stored value
- Score value
- Display order
- Evidence requirement
- Comment requirement
- Recommendation trigger

### 4.9 Validation Rule

A **Validation Rule** defines whether a response is complete, acceptable, or internally consistent.

Examples:

- A required question must be answered.
- A “No” response requires a comment.
- A high-risk answer requires supporting evidence.
- A percentage must be between 0 and 100.
- One question becomes required based on another response.

Validation rules are configuration-driven but enforced by application services.

### 4.10 Scoring Rule

A **Scoring Rule** translates assessment responses or imported metrics into calculated scores.

Scoring may occur at multiple levels:

- Question
- Subsection
- Section
- Pillar
- Methodology
- Overall assessment

Scoring-rule examples:

- Direct answer-option score
- Weighted average
- Numeric range
- Percentage range
- Manual assessor score
- Exclusion from calculation
- Imported data-quality metric

Scores must be explainable and reproducible.

### 4.11 Maturity Model

A **Maturity Model** defines named levels that describe organizational capability or performance.

Example:

```text
1 — Initial
2 — Developing
3 — Defined
4 — Managed
5 — Optimized
```

Each maturity level may include:

- Name
- Description
- Minimum score
- Maximum score
- Expected characteristics
- Target-state guidance

A methodology may define a default maturity model. A template version may use that model or an approved variation.

### 4.12 Recommendation Rule

A **Recommendation Rule** defines when a draft recommendation should be proposed.

Triggers may include:

- A specific answer
- A low question score
- A low section score
- A maturity level
- Missing evidence
- A rule-generated finding
- A combination of assessment conditions

Generated recommendations remain drafts until reviewed and approved by an authorized assessor.

### 4.13 Organization

An **Organization** is a tenant operating within the platform.

The initial organization is GeoVaris.

Future organizations may include:

- GeoVaris business units
- Authorized consulting partners
- Licensed assessment providers
- Enterprise customers with self-service capabilities

An organization owns or controls its:

- Users and memberships
- Clients
- Framework access
- Methodologies
- Templates
- Assessments
- Reports
- Audit records

Tenant-owned records must be isolated by organization.

### 4.14 Client

A **Client** is a company, government entity, nonprofit, business unit, or other organization receiving assessment services.

A client may have:

- Contacts
- Business units
- Systems
- Data sources
- Data domains
- Assessment engagements
- Findings
- Recommendations
- Roadmaps
- Reports

A client belongs to one platform organization.

### 4.15 Assessment

An **Assessment** is a client-specific execution of one published template version.

An assessment references:

- Organization
- Client
- Framework
- Methodology
- Assessment template
- Published template version
- Scope
- Participants
- Status
- Assessment period

Once an assessment begins, its template version cannot be replaced.

An assessment produces:

- Responses
- Evidence
- Scores
- Findings
- Recommendations
- Roadmaps
- Reports

### 4.16 Response

A **Response** records the answer to one configured question within an assessment.

A response may contain:

- Selected option
- Multiple selected options
- Text
- Numeric value
- Percentage
- Date
- Boolean value
- Comments
- Respondent
- Review status
- Submission and review timestamps

Responses must reference questions contained in the assessment’s published template version.

### 4.17 Evidence

**Evidence** is supporting material submitted or linked during an assessment.

Examples:

- Policy documents
- Data dictionaries
- Screenshots
- System exports
- Spreadsheets
- Data-quality reports
- Interview notes
- Web links

The database stores evidence metadata and relationships. Binary files are stored in the approved external storage service.

### 4.18 Score

A **Score** is a calculated or approved measurement associated with part or all of an assessment.

Score scopes include:

- Question
- Section
- Pillar
- Methodology
- Overall assessment

Scores must preserve:

- Template version
- Applicable scoring rules
- Input responses
- Exclusions
- Weights
- Calculation version
- Approval status

### 4.19 Finding

A **Finding** is an observed strength, gap, risk, issue, or opportunity identified during an assessment.

Finding types may include:

- Strength
- Gap
- Risk
- Observation
- Opportunity
- Compliance issue

A finding may be:

- Created by an assessor
- Generated from a configured rule
- Assisted by AI
- Imported from automated profiling

Findings require assessor review before client delivery.

### 4.20 Recommendation

A **Recommendation** describes an action intended to address a finding, reduce risk, or improve maturity.

Recommendations may include:

- Priority
- Estimated effort
- Expected benefit
- Estimated cost range
- Target maturity level
- Dependencies
- Ownership
- Implementation guidance

Recommendations generated by rules or AI remain drafts until approved.

### 4.21 Roadmap

A **Roadmap** organizes approved recommendations into a practical implementation plan.

A roadmap may define:

- Phases
- Priorities
- Owners
- Dependencies
- Planned dates
- Estimated effort
- Estimated cost
- Expected outcomes
- Status

Typical phases may include:

- Immediate quick wins
- 30-day actions
- 90-day actions
- Six-month initiatives
- Twelve-month strategic initiatives

### 4.22 Report

A **Report** is a generated client-facing deliverable based on assessment data.

Examples:

- Executive Scorecard
- Data Health Report
- Governance Maturity Report
- Findings and Recommendations Report
- Quick Wins Report
- Implementation Roadmap
- Final Assessment Report

Reports reference immutable assessment data and preserve a structured source-data snapshot for reproducibility.

---

## 5. Product Configuration Model

The product configuration model is:

```text
Framework
    └── Methodology
            └── Assessment Template
                    └── Assessment Template Version
                            ├── Section
                            ├── Question
                            ├── Answer Option
                            ├── Validation Rule
                            ├── Evidence Requirement
                            ├── Scoring Rule
                            ├── Maturity Model
                            ├── Recommendation Rule
                            └── Report Configuration
```

This model allows GeoVaris to create a new assessment offering primarily through configuration rather than source-code changes.

---

## 6. Client Configuration Model

A client-specific assessment configuration is derived from an approved master template version.

```text
Master Template Version
        │
        ▼
Client Template Draft
        │
        ▼
Client Review and Configuration
        │
        ▼
Published Client Template Version
        │
        ▼
Assessment
```

Client configuration may include:

- Client terminology
- Industry-specific questions
- Data domains in scope
- Systems in scope
- Optional questions
- Additional questions
- Evidence requirements
- Approved scoring-weight adjustments
- Client-specific guidance
- Report branding and configuration

Client-specific configuration must retain lineage to the originating master template version.

---

## 7. Configuration Versus Platform Logic

The following capabilities should be configuration-driven:

- Framework definitions
- Methodologies
- Assessment templates
- Template versions
- Sections
- Questions
- Answer options
- Guidance
- Evidence requirements
- Basic validation rules
- Scoring rules
- Maturity thresholds
- Recommendation mappings
- Report structures

The following capabilities remain protected application logic:

- Authentication
- Authorization
- Tenant isolation
- Template publication controls
- Version immutability
- Assessment freezing
- Cross-tenant access prevention
- Audit logging
- File-access controls
- Calculation execution
- Data-retention enforcement
- Legal-hold enforcement
- Security validation

Database-driven configuration does not permit unrestricted modification of platform security or lifecycle rules.

---

## 8. Framework and Methodology Relationships

```text
Framework
    │
    ├── Branding
    ├── Product Documentation
    ├── Licensing Configuration
    └── Methodologies
            │
            ├── Maturity Models
            ├── Scoring Philosophy
            ├── Expected Deliverables
            └── Assessment Templates
```

Relationship rules:

- One framework may contain many methodologies.
- One methodology belongs to one framework.
- One methodology may contain many assessment templates.
- One assessment template belongs to one methodology.
- One assessment template may have many versions.
- One assessment references one published template version.
- Historical assessments retain all version references.

---

## 9. Proposed Framework Examples

### GeoVaris Data Health Framework™

Potential methodologies:

- Enterprise Data Health
- Data Governance Maturity
- Data Quality Maturity
- Metadata and Lineage
- Analytics Maturity
- AI Readiness
- Operational Data Management

### Broadband Data Quality Framework

Potential methodologies:

- FCC BDC Readiness
- Fabric Validation
- Availability Data Quality
- Service Qualification
- Regulatory Filing Quality

### GIS Data Health Framework

Potential methodologies:

- GIS Governance
- Spatial Data Quality
- Metadata and Lineage
- Enterprise GIS Architecture
- Field Data Collection
- GIS Operational Maturity

### AI Readiness Framework

Potential methodologies:

- Data Readiness
- Governance and Risk
- Technical Architecture
- Model Operations
- Workforce Readiness
- Responsible AI

---

## 10. Lifecycle Rules

### Framework Lifecycle

```text
Draft
  ↓
Review
  ↓
Active
  ↓
Retired
```

### Methodology Lifecycle

```text
Draft
  ↓
Review
  ↓
Approved
  ↓
Active
  ↓
Retired
```

### Template Version Lifecycle

```text
Draft
  ↓
Review
  ↓
Approved
  ↓
Published
  ↓
Retired
```

### Assessment Lifecycle

```text
Draft
  ↓
Configured
  ↓
In Progress
  ↓
Submitted
  ↓
Review
  ↓
Completed
  ↓
Archived
```

Published versions and completed assessments are historically controlled and must not be altered in ways that invalidate delivered results.

---

## 11. Core Business Rules

1. Every methodology belongs to one framework.
2. Every assessment template belongs to one methodology.
3. Every assessment references one published template version.
4. Published template versions are immutable.
5. A template version change creates a new version.
6. Historical assessments retain their original template-version relationship.
7. Questions and scoring rules are configuration records.
8. Platform security and lifecycle controls remain application-enforced.
9. Client-specific templates retain lineage to master templates.
10. Rule-generated and AI-assisted findings or recommendations require human review.
11. Scores must be reproducible and explainable.
12. Organization-owned records must remain tenant-isolated.
13. Framework retirement does not delete historical assessments.
14. Methodology or template retirement prevents new use but preserves prior records.
15. Audit history is required for publication, approval, scoring, and delivery activities.

---

## 12. Initial Database Implications

The domain model anticipates the following configuration entities:

```text
frameworks
assessment_methodologies
assessment_templates
assessment_template_versions
template_sections
template_questions
question_answer_options
validation_rules
evidence_requirements
scoring_rules
maturity_models
maturity_levels
recommendation_rules
report_templates
report_template_versions
```

The execution entities include:

```text
assessments
assessment_participants
assessment_scope_items
assessment_responses
assessment_response_options
evidence_items
score_calculation_runs
assessment_scores
findings
recommendations
roadmaps
roadmap_items
reports
report_snapshots
```

The physical schema may evolve during implementation, but it must preserve the domain relationships and business rules defined in this document.

---

## 13. Current Architectural Decision

GDHF will implement a framework layer above methodologies.

The hierarchy will be:

```text
Framework
    └── Methodology
            └── Assessment Template
                    └── Assessment Template Version
                            └── Assessment
```

The GeoVaris Data Health Framework™ will be the first framework created in the platform.

Existing methodology and template schema work under P2-203 will be updated to include this framework relationship before the next database migration is generated.

---

## 14. Definition of Done

This platform domain model is complete when:

- Core terms are defined.
- Framework and methodology responsibilities are distinct.
- Configuration and execution concepts are separated.
- Template-versioning rules are defined.
- Client-configuration lineage is defined.
- Core lifecycle rules are documented.
- Database implementation can be traced to domain concepts.
- The architecture documents and ERD are updated to include frameworks.
- The P2-203 schema includes the approved framework relationships.

---

## 15. Related Documents

- `APPLICATION_ARCHITECTURE.md`
- `DOMAIN_MODEL.md`
- `ENTITY_RELATIONSHIP_MODEL.md`
- `README.md`
- `../standards/CODING_STANDARDS.md`