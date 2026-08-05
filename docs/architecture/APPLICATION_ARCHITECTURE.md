# GeoVaris Data Health Framework™

# Application Architecture

Project: GeoVaris Data Health Framework™
Backlog Item: P1-105
Owner: GeoVaris
Status: Draft
Version: 1.0
Last Updated: 2026-08-03

## 1. Executive Overview

The GeoVaris Data Health Framework™ (GDHF) is a cloud-native, multi-tenant assessment platform designed to evaluate, measure, and improve organizational data health.

The platform uses a generic assessment engine rather than hardcoded questionnaires. Assessment structures, sections, questions, answer options, scoring rules, maturity levels, recommendations, and report configurations are stored in the database and rendered dynamically by the application.

GeoVaris maintains reusable master questionnaire templates for assessment offerings such as:

- Data health
- Data governance maturity
- Data quality
- AI readiness
- GIS maturity
- Broadband data quality
- Regulatory data readiness

For each client engagement, an approved master template is copied into a client-specific questionnaire template. GeoVaris and the client may then configure that template to reflect the client's industry, terminology, business priorities, data domains, regulatory environment, and assessment scope.

Each assessment is created from a published version of a questionnaire template. After an assessment begins, its questionnaire configuration is preserved so that later template changes do not alter historical answers, scores, findings, or reports.

This approach enables GeoVaris to deliver repeatable methodologies while supporting controlled client-specific configuration without requiring software changes.

## 2. Core Architectural Decision

GDHF will use a generic metadata-driven assessment engine.

The application will not hardcode:

- Assessment pillars or sections
- Categories
- Questions
- Answer types
- Answer choices
- Help text
- Evidence requirements
- Scoring weights
- Scoring formulas
- Maturity thresholds
- Recommendation rules
- Report sections

These elements will be stored as versioned configuration records in PostgreSQL.

The Next.js application will read the applicable configuration from the database and dynamically generate the assessment experience.

## 3. Template Hierarchy

GDHF will use the following template hierarchy:

```text
Assessment Methodology
        ↓
Master Questionnaire Template
        ↓
Template Version
        ↓
Client Questionnaire Template
        ↓
Client Template Version
        ↓
Assessment Instance
        ↓
Responses, Evidence, Scores and Reports

## 2. Business Objectives

The objectives of GDHF are to:

- Standardize enterprise data health assessments.
- Reduce consulting delivery time through reusable automation.
- Improve data governance maturity.
- Provide measurable scoring across multiple governance domains.
- Generate executive-ready reporting.
- Support AI readiness initiatives.
- Create a repeatable consulting methodology for GeoVaris.
- Deliver a scalable SaaS platform for recurring customer engagements.

## 3. Guiding Principles

The GeoVaris Data Health Framework™ is built around the following engineering principles:

### Cloud First

All platform components should be deployable within modern cloud environments.

### Security by Design

Authentication, authorization, encryption, and tenant isolation are built into the architecture rather than added later.

### Configuration over Customization

Assessment logic should be data-driven through configuration whenever practical.

### Modular Design

Business capabilities should be implemented as reusable services and components.

### AI Assisted

Artificial Intelligence augments consultant expertise but never replaces governance methodology.

### Scalable Architecture

The platform must support growth from individual consultants to enterprise customers without architectural redesign.

### ADR-002 — Generic Metadata-Driven Assessment Engine

**Status:** Accepted

**Decision:**  
GDHF will implement a generic assessment engine whose questionnaire structure, scoring configuration and report behavior are derived from versioned database records.

The GeoVaris Data Health Framework will be implemented as the first configured methodology rather than hardcoded into the application.

**Rationale:**

- Supports client-specific questionnaires
- Allows methodology changes without software releases
- Enables additional GeoVaris assessment products
- Preserves reusable intellectual property
- Provides template lineage and auditability
- Prevents historical assessments from changing when templates evolve

**Consequences:**

- Database design will be more sophisticated
- Template versioning and publication workflows are required
- Configuration validation is critical
- The user interface must render multiple question and answer types dynamically
- Published configurations must be immutable


## 6. High-Level System Architecture

GDHF will use a cloud-native, layered architecture that separates presentation, business logic, authentication, data storage, file storage, and external services.

```text
Users
  │
  ▼
app.geovaris.com
  │
  ▼
Vercel
  │
  ▼
Next.js Application
  ├── Presentation Layer
  ├── Application Services
  ├── Assessment Engine
  ├── Authorization Services
  ├── Reporting Services
  └── Integration Services
         │
         ├── Neon Auth — prototype authentication
         ├── Neon PostgreSQL — application and configuration data
         ├── Azure Blob Storage — evidence files and generated reports
         └── OpenAI API — future AI-assisted analysis


## Then add the architecture layers

```markdown
## 7. Application Layers

GDHF will use the following logical layers:

```text
Presentation Layer
        ↓
Application Service Layer
        ↓
Domain and Assessment Engine
        ↓
Data Access Layer
        ↓
PostgreSQL and External Services


## 8. Technology Stack

The GeoVaris Assessment Platform will use a modular technology stack designed to minimize prototype complexity while preserving a path to enterprise deployment.

| Layer | Prototype Technology | Purpose |
|---|---|---|
| Web framework | Next.js | Application pages, server-side logic and API endpoints |
| Programming language | TypeScript | Type-safe application development |
| User interface | React | Reusable application components |
| Styling | Tailwind CSS | Responsive layout and GeoVaris branding |
| Hosting | Vercel | Application hosting, preview deployments and CI/CD |
| Database | Neon PostgreSQL | Configuration, assessment and operational data |
| Database access | Drizzle ORM | Type-safe database queries and schema migrations |
| Authentication | Neon Auth | Prototype user registration, login and sessions |
| Source control | GitHub | Version control, branches and pull requests |
| File storage | Local prototype storage or Azure Blob Storage | Evidence files and generated reports |
| AI services | OpenAI API | Future assisted findings, summaries and recommendations |
| Production identity | Microsoft Entra ID with Auth.js | Customer authentication, MFA and enterprise identity |
| Production domain | app.geovaris.com | Public address for the GDHF application |

### Technology Selection Principles

Technology decisions will favor:

- Low prototype operating cost
- Managed cloud services
- Minimal infrastructure administration
- Strong Next.js compatibility
- Standard and portable data technologies
- Security and tenant isolation
- Incremental scalability
- Clear migration paths
- Avoidance of unnecessary vendor lock-in

### PostgreSQL as the System of Record

PostgreSQL will serve as the authoritative system of record for:

- Organizations
- Users and organization memberships
- Clients
- Assessment methodologies
- Assessment templates and versions
- Sections and questions
- Scoring and recommendation configuration
- Assessment responses
- Scores
- Findings
- Recommendations
- Roadmap items
- Report metadata
- Audit events

Large binary files should not normally be stored directly in PostgreSQL.

The database will instead store file metadata, ownership, storage location and access-control information.

## 9. Prototype Architecture

The prototype will use the simplest viable architecture needed to prove the complete assessment workflow.

```text
User Browser
      │
      ▼
Next.js on Vercel
      │
      ├── Neon Auth
      │
      ├── Neon PostgreSQL
      │
      └── Prototype file storage

  
## Important architecture rule

The platform should never use a person’s email address as the permanent primary key.

Instead:

```text
users.id

