# GeoVaris Assessment Platform™

# Entity Relationship Model

Project: GeoVaris Data Health Framework™  
Backlog Item: P1-105  
Owner: GeoVaris  
Status: Draft  
Version: 1.0  
Last Updated: 2026-08-04


## 1. Purpose

This document defines the conceptual and logical data model for the GeoVaris Assessment Platform.

The model supports:

- Multi-tenant organizations
- Client management
- Versioned assessment methodologies
- Database-driven assessment templates
- Client-specific questionnaire configurations
- Assessment responses and evidence
- Scoring, findings and recommendations
- Roadmaps and reports
- Auditability and historical reproducibility

The model is technology-neutral at the conceptual level but is intended to be implemented using PostgreSQL and Drizzle ORM.


## 2. High-Level Entity Relationships

```text
Organization
    │
    ├── Organization Memberships ── Users
    │
    ├── Clients
    │       ├── Contacts
    │       ├── Data Sources
    │       └── Assessments
    │
    ├── Assessment Methodologies
    │       └── Assessment Templates
    │               └── Assessment Template Versions
    │                       ├── Template Sections
    │                       │       └── Template Questions
    │                       │               ├── Answer Options
    │                       │               ├── Evidence Requirements
    │                       │               └── Scoring Rules
    │                       ├── Maturity Levels
    │                       └── Recommendation Rules
    │
    └── Audit Events

Assessment
    │
    ├── Assessment Participants
    ├── Assessment Responses
    ├── Evidence Items
    ├── Assessment Scores
    ├── Findings
    ├── Recommendations
    ├── Roadmap Items
    └── Reports


## Add the first architectural rule

```markdown
## 3. Tenant Isolation

Every organization-owned record must be associated with an organization identifier.

Examples include:

- Clients
- Methodologies
- Templates
- Assessments
- Findings
- Recommendations
- Reports
- Audit events

Application queries must filter organization-owned records using the authenticated user's active organization membership.

A record must never be retrieved using only its own identifier when it is organization-owned.

For example, the application must query a client using both:

```text
clientId
organizationId

## 4. Identity and Organization Entities

### organizations

Represents a tenant using the platform.

Key attributes:

- id
- name
- legal_name
- organization_type
- status
- created_at
- updated_at

Relationships:

- One organization has many organization memberships.
- One organization has many clients.
- One organization has many methodologies and templates.
- One organization has many assessments.
- One organization has many audit events.

### users

Represents an individual platform user.

Users are independent of any one authentication provider so the platform can move from Neon Auth to Microsoft Entra ID without changing assessment ownership.

Key attributes:

- id
- email
- display_name
- status
- created_at
- updated_at

A user may belong to multiple organizations.

### user_identities

Links a platform user to an external authentication provider.

Key attributes:

- id
- user_id
- provider
- provider_user_id
- provider_email
- created_at
- updated_at

Examples of provider values:

- neon_auth
- microsoft_entra
- future_sso_provider

The combination of provider and provider_user_id must be unique.

### organization_memberships

Creates the many-to-many relationship between users and organizations.

Key attributes:

- id
- organization_id
- user_id
- membership_status
- joined_at
- created_at
- updated_at

A user must have an active organization membership before accessing organization-owned records.

### roles

Defines named permission groups.

Initial roles include:

- platform_administrator
- methodology_administrator
- assessor
- client_administrator
- client_contributor
- executive_viewer

Key attributes:

- id
- organization_id
- name
- description
- is_system_role
- created_at
- updated_at

System roles may be reused across organizations. Organization-specific roles belong to one organization.

### permissions

Defines individual allowed actions.

Examples include:

- client.create
- client.view
- assessment.create
- assessment.respond
- assessment.review
- template.edit
- template.publish
- report.view
- report.generate
- organization.manage_users

Key attributes:

- id
- permission_key
- description

### role_permissions

Creates the many-to-many relationship between roles and permissions.

Key attributes:

- role_id
- permission_id

### membership_roles

Assigns one or more roles to an organization membership.

Key attributes:

- organization_membership_id
- role_id

This design allows one user to have different roles in different organizations.

## 5. Identity Relationship Summary

```text
User
  │
  └── User Identities

User
  │
  └── Organization Memberships
            │
            ├── Organization
            └── Membership Roles
                    │
                    └── Roles
                            │
                            └── Role Permissions
                                    │
                                    └── Permissions


## Why this model matters

This lets the same person be:

```text
GeoVaris
    Platform Administrator

Client Organization
    Executive Viewer

## 6. Client and Data Estate Entities

### clients

Represents an organization receiving assessment services.

Key attributes:

- id
- organization_id
- name
- legal_name
- industry
- size_category
- status
- primary_contact_id
- created_at
- updated_at

Relationships:

- One organization has many clients.
- One client has many contacts.
- One client has many systems.
- One client has many data sources.
- One client has many assessments.

### client_contacts

Represents a business or technical contact associated with a client.

Key attributes:

- id
- organization_id
- client_id
- first_name
- last_name
- title
- email
- phone
- contact_type
- status
- created_at
- updated_at

Examples of contact types:

- executive_sponsor
- business_owner
- data_owner
- data_steward
- technical_contact
- assessment_participant

### client_systems

Represents an application, platform or operational system used by a client.

Key attributes:

- id
- organization_id
- client_id
- name
- system_type
- vendor
- business_owner_contact_id
- technical_owner_contact_id
- criticality
- lifecycle_status
- description
- created_at
- updated_at

Examples include:

- ERP
- CRM
- Data warehouse
- GIS platform
- Microsoft Fabric
- File share
- Transportation management system
- Broadband availability platform

### data_sources

Represents a dataset, database, file collection, API or other source of data included in an assessment.

Key attributes:

- id
- organization_id
- client_id
- client_system_id
- name
- data_source_type
- business_purpose
- data_owner_contact_id
- data_steward_contact_id
- sensitivity_classification
- criticality
- refresh_frequency
- source_location
- status
- created_at
- updated_at

Examples of data-source types:

- relational_database
- spreadsheet
- csv_file
- api
- data_lake
- data_warehouse
- gis_layer
- document_repository
- streaming_source

### data_domains

Represents a logical subject area used to group related client data.

Examples include:

- Customer
- Finance
- Operations
- Network
- Human Resources
- Asset Management
- Logistics
- Regulatory Reporting

Key attributes:

- id
- organization_id
- client_id
- name
- description
- owner_contact_id
- status
- created_at
- updated_at

### data_source_domains

Creates the many-to-many relationship between data sources and data domains.

Key attributes:

- data_source_id
- data_domain_id

A data source may support multiple data domains, and one data domain may contain multiple data sources.


## 7. Client Relationship Summary

```text
Organization
    │
    └── Clients
            │
            ├── Client Contacts
            ├── Client Systems
            │       └── Data Sources
            ├── Data Domains
            │       └── Data Source Domains
            └── Assessments



## 8. Methodology and Template Entities

### assessment_methodologies

Represents a reusable GeoVaris assessment offering.

Examples include:

- GeoVaris Data Health Framework
- Data Governance Maturity Assessment
- AI Readiness Assessment
- GIS Data Health Assessment
- Broadband Data Quality Assessment

Key attributes:

- id
- organization_id
- name
- code
- description
- methodology_type
- status
- owner_user_id
- created_at
- updated_at

Relationships:

- One methodology may have many assessment templates.
- One methodology may have many maturity models.
- One methodology may be used across many clients and assessments.

### assessment_templates

Represents a configurable assessment design associated with one methodology.

A template is a logical container. Its published content is stored in version records.

Key attributes:

- id
- organization_id
- methodology_id
- name
- description
- template_scope
- status
- created_by_user_id
- created_at
- updated_at

Examples of template scope:

- master
- industry
- client
- custom

Relationships:

- One methodology has many templates.
- One template has many template versions.
- A client-specific template may reference the master template from which it was derived.

### assessment_template_versions

Represents one versioned and potentially publishable configuration of an assessment template.

Key attributes:

- id
- organization_id
- assessment_template_id
- version_number
- version_status
- effective_date
- published_at
- published_by_user_id
- source_template_version_id
- change_summary
- created_at
- updated_at

Version-status examples:

- draft
- review
- approved
- published
- retired

Rules:

- Draft versions may be edited.
- Published versions are immutable.
- Changes to a published version require a new version.
- Every assessment must reference one published template version.
- Client-specific versions retain lineage to the source master version.

### template_sections

Represents an ordered section, domain, category, or pillar within one template version.

Key attributes:

- id
- organization_id
- template_version_id
- parent_section_id
- name
- code
- description
- display_order
- weight
- is_required
- status
- created_at
- updated_at

The optional parent_section_id supports nested structures such as:

```text
Pillar
    └── Category
            └── Subcategory



 
Then add this relationship summary:

```markdown
## 9. Methodology and Template Relationship Summary

```text
Assessment Methodology
        │
        ├── Maturity Models
        │       └── Maturity Levels
        │
        └── Assessment Templates
                │
                └── Assessment Template Versions
                        │
                        ├── Template Sections
                        │       └── Template Questions
                        │               ├── Answer Options
                        │               ├── Question Conditions
                        │               ├── Evidence Requirements
                        │               ├── Scoring Rules
                        │               └── Recommendation Rules
                        │
                        └── Client-Specific Derived Versions



## 10. Assessment Execution Entities

### assessments

Represents one client-specific execution of a published assessment template version.

Key attributes:

- id
- organization_id
- client_id
- methodology_id
- template_version_id
- name
- description
- assessment_status
- assessment_period_start
- assessment_period_end
- started_at
- submitted_at
- completed_at
- archived_at
- created_by_user_id
- lead_assessor_user_id
- created_at
- updated_at

Assessment-status examples:

- draft
- configured
- in_progress
- submitted
- review
- completed
- archived
- cancelled

Rules:

- An assessment must reference one published template version.
- The referenced template version cannot change after the assessment begins.
- Every assessment-owned record must include `organization_id` and `assessment_id`.
- Completed assessments should remain reproducible and historically stable.

### assessment_participants

Assigns users or client contacts to an assessment.

Key attributes:

- id
- organization_id
- assessment_id
- user_id
- client_contact_id
- participant_role
- status
- invited_at
- accepted_at
- created_at
- updated_at

Participant-role examples:

- lead_assessor
- assessor
- client_administrator
- respondent
- reviewer
- executive_viewer

A participant may reference either a platform user, a client contact, or both when the contact has a platform account.

### assessment_scope_items

Defines the client systems, data sources, domains, business units, or processes included in an assessment.

Key attributes:

- id
- organization_id
- assessment_id
- scope_type
- client_system_id
- data_source_id
- data_domain_id
- scope_name
- description
- inclusion_status
- created_at
- updated_at

Scope-type examples:

- organization
- business_unit
- system
- data_source
- data_domain
- process
- geography

### assessment_responses

Stores the response to one configured question within an assessment.

Key attributes:

- id
- organization_id
- assessment_id
- template_question_id
- respondent_user_id
- selected_option_id
- text_value
- numeric_value
- percentage_value
- date_value
- boolean_value
- response_status
- respondent_comment
- assessor_comment
- submitted_at
- reviewed_at
- reviewed_by_user_id
- created_at
- updated_at

Rules:

- Only fields applicable to the question's answer type should contain values.
- A response must reference the question from the assessment's template version.
- Changes after submission must be recorded in audit history.
- Required responses must pass validation before assessment submission.

Response-status examples:

- draft
- submitted
- accepted
- needs_clarification
- revised
- not_applicable

### assessment_response_options

Stores selections for multi-select questions.

Key attributes:

- assessment_response_id
- answer_option_id

A single-select question may use `selected_option_id` directly on the response. Multi-select questions use this bridge entity.

### evidence_items

Represents evidence submitted for an assessment, question, response, finding, or recommendation.

Key attributes:

- id
- organization_id
- client_id
- assessment_id
- response_id
- evidence_requirement_id
- evidence_type
- title
- description
- storage_provider
- storage_location
- original_file_name
- content_type
- file_size
- checksum
- submitted_by_user_id
- evidence_status
- submitted_at
- reviewed_at
- reviewed_by_user_id
- created_at
- updated_at

Evidence-status examples:

- submitted
- accepted
- rejected
- needs_clarification
- superseded
- archived

The database stores evidence metadata. File contents are stored in the approved file-storage platform.

### evidence_links

Allows one evidence item to support multiple records.

Key attributes:

- id
- organization_id
- evidence_item_id
- linked_entity_type
- linked_entity_id
- created_at

Linked-entity examples:

- assessment
- response
- section
- finding
- recommendation

The application must validate that linked records belong to the same organization and assessment context.

## 11. Scoring Entities

### assessment_scores

Stores calculated or manually approved scores.

Key attributes:

- id
- organization_id
- assessment_id
- score_scope_type
- score_scope_id
- raw_score
- weighted_score
- maximum_score
- normalized_score
- maturity_level_id
- calculation_status
- calculated_at
- calculated_by
- approved_at
- approved_by_user_id
- calculation_version
- created_at
- updated_at

Score-scope examples:

- question
- section
- category
- pillar
- overall

Calculation-status examples:

- pending
- calculated
- reviewed
- approved
- superseded

`calculated_by` may identify:

- scoring_engine
- assessor
- imported_metric

### score_calculation_runs

Records each execution of the scoring engine.

Key attributes:

- id
- organization_id
- assessment_id
- template_version_id
- calculation_version
- calculation_status
- started_at
- completed_at
- initiated_by_user_id
- error_summary
- created_at

This provides reproducibility and audit history when scores are recalculated.

### score_calculation_details

Stores detailed calculation inputs and outputs for one scoring run.

Key attributes:

- id
- organization_id
- calculation_run_id
- question_id
- response_id
- scoring_rule_id
- input_value
- base_score
- applied_weight
- exclusion_reason
- resulting_score
- created_at

These records provide explainability for score results.

## 12. Findings and Recommendations

### findings

Represents an observed issue, strength, risk, or opportunity identified during an assessment.

Key attributes:

- id
- organization_id
- client_id
- assessment_id
- section_id
- question_id
- finding_type
- title
- description
- severity
- business_impact
- likelihood
- risk_rating
- finding_status
- source_type
- created_by_user_id
- approved_by_user_id
- approved_at
- created_at
- updated_at

Finding-type examples:

- gap
- risk
- strength
- observation
- opportunity
- compliance_issue

Source-type examples:

- rule_generated
- assessor_created
- ai_assisted
- imported

Finding-status examples:

- draft
- review
- approved
- delivered
- resolved
- closed

### finding_evidence

Creates the many-to-many relationship between findings and evidence items.

Key attributes:

- finding_id
- evidence_item_id

### recommendations

Represents an improvement action associated with an assessment or finding.

Key attributes:

- id
- organization_id
- client_id
- assessment_id
- finding_id
- recommendation_rule_id
- title
- description
- priority
- recommendation_type
- estimated_effort
- estimated_cost_range
- expected_benefit
- target_maturity_level_id
- recommendation_status
- source_type
- created_by_user_id
- approved_by_user_id
- approved_at
- created_at
- updated_at

Recommendation-type examples:

- quick_win
- process
- governance
- technology
- data_quality
- training
- policy
- strategic

Recommendation-status examples:

- draft
- review
- approved
- delivered
- accepted
- deferred
- rejected
- completed

AI-generated or rule-generated recommendations must remain drafts until approved by an authorized assessor.

### recommendation_dependencies

Defines dependencies between recommendations.

Key attributes:

- recommendation_id
- depends_on_recommendation_id
- dependency_type

Dependency-type examples:

- prerequisite
- related
- blocks
- enables

## 13. Roadmap Entities

### roadmaps

Represents an implementation roadmap created from assessment recommendations.

Key attributes:

- id
- organization_id
- client_id
- assessment_id
- name
- description
- roadmap_status
- start_date
- target_end_date
- created_by_user_id
- approved_by_user_id
- approved_at
- created_at
- updated_at

### roadmap_items

Converts recommendations into planned implementation actions.

Key attributes:

- id
- organization_id
- roadmap_id
- recommendation_id
- title
- description
- priority
- phase
- owner_user_id
- owner_contact_id
- planned_start_date
- planned_end_date
- actual_start_date
- actual_end_date
- estimated_effort
- estimated_cost
- expected_outcome
- roadmap_item_status
- display_order
- created_at
- updated_at

Roadmap-item-status examples:

- proposed
- approved
- planned
- in_progress
- blocked
- completed
- deferred
- cancelled

### roadmap_item_dependencies

Defines dependencies between roadmap items.

Key attributes:

- roadmap_item_id
- depends_on_roadmap_item_id
- dependency_type

## 14. Reporting Entities

### report_templates

Defines reusable report structures.

Key attributes:

- id
- organization_id
- methodology_id
- name
- report_type
- description
- template_status
- created_at
- updated_at

Report-type examples:

- executive_scorecard
- assessment_summary
- governance_maturity
- data_quality
- quick_wins
- implementation_roadmap
- final_report

### report_template_versions

Stores immutable published versions of report configuration.

Key attributes:

- id
- organization_id
- report_template_id
- version_number
- version_status
- configuration_json
- published_at
- published_by_user_id
- created_at
- updated_at

### reports

Represents a generated report for an assessment.

Key attributes:

- id
- organization_id
- client_id
- assessment_id
- report_template_version_id
- report_type
- title
- report_status
- generated_at
- generated_by_user_id
- approved_at
- approved_by_user_id
- storage_provider
- storage_location
- file_name
- content_type
- checksum
- created_at
- updated_at

Report-status examples:

- draft
- generated
- review
- approved
- delivered
- superseded
- archived

### report_snapshots

Stores the structured data used to generate a report.

Key attributes:

- id
- organization_id
- report_id
- assessment_id
- snapshot_version
- snapshot_data
- created_at

The snapshot preserves the report's source data so the delivered output can be reproduced later.


## 15. Assessment Execution Relationship Summary

```text
Assessment
    │
    ├── Participants
    ├── Scope Items
    ├── Responses
    │       └── Selected Answer Options
    ├── Evidence
    ├── Score Calculation Runs
    │       ├── Calculation Details
    │       └── Assessment Scores
    ├── Findings
    │       └── Finding Evidence
    ├── Recommendations
    │       └── Recommendation Dependencies
    ├── Roadmaps
    │       └── Roadmap Items
    │               └── Roadmap Dependencies
    └── Reports
            └── Report Snapshots

## 16. Audit and Record Lifecycle Entities

### audit_events

Records significant activity across the platform.

Key attributes:

- id
- organization_id
- user_id
- action_type
- entity_type
- entity_id
- assessment_id
- client_id
- event_timestamp
- source_ip
- user_agent
- change_summary
- previous_values
- new_values
- correlation_id
- created_at

Examples of action types:

- create
- update
- delete
- publish
- approve
- reject
- submit
- login
- logout
- download
- generate_report
- recalculate_score
- change_role
- archive

Audit events should be append-only and should not be edited after creation.

### record_status_history

Tracks status changes for records with formal lifecycles.

Key attributes:

- id
- organization_id
- entity_type
- entity_id
- previous_status
- new_status
- changed_by_user_id
- change_reason
- changed_at

Applicable entities include:

- assessment templates
- template versions
- assessments
- evidence items
- findings
- recommendations
- roadmaps
- reports

### data_retention_policies

Defines retention requirements by organization, record type, or client agreement.

Key attributes:

- id
- organization_id
- client_id
- entity_type
- retention_period_days
- archive_after_days
- delete_after_days
- legal_hold_allowed
- policy_status
- effective_date
- created_at
- updated_at

### legal_holds

Prevents deletion of records subject to contractual, legal, or regulatory requirements.

Key attributes:

- id
- organization_id
- client_id
- entity_type
- entity_id
- hold_reason
- hold_status
- placed_by_user_id
- placed_at
- released_by_user_id
- released_at
- created_at
- updated_at

### deletion_requests

Records requests to remove or anonymize data.

Key attributes:

- id
- organization_id
- client_id
- requested_by_user_id
- request_type
- request_scope
- request_status
- requested_at
- reviewed_by_user_id
- reviewed_at
- completed_at
- completion_summary
- created_at
- updated_at

Request-type examples:

- delete
- anonymize
- export
- correct

### archived_records

Stores metadata for records moved out of active use.

Key attributes:

- id
- organization_id
- entity_type
- entity_id
- archive_reason
- archived_by_user_id
- archived_at
- storage_location
- retention_expiration_date
- created_at

## 17. Lifecycle and Deletion Principles

The platform will follow these rules:

- Published template versions are immutable.
- Completed assessments are not physically deleted during the normal retention period.
- Historical scores, reports, and assessment configurations must remain reproducible.
- Soft deletion is preferred for active business records.
- Hard deletion requires explicit authorization and retention-policy validation.
- Legal holds override deletion and retention-expiration rules.
- Audit events remain append-only.
- Personally identifiable information may be anonymized when deletion is required but historical integrity must be preserved.
- Evidence files must be deleted from both the database metadata layer and the external file-storage platform when approved for deletion.

## 18. Recommended Common Fields

Most organization-owned tables should include:

- id
- organization_id
- created_at
- updated_at
- created_by_user_id
- updated_by_user_id
- status

Where appropriate, records should also include:

- archived_at
- archived_by_user_id
- deleted_at
- deleted_by_user_id

Soft-deleted records must be excluded from normal application queries.

## 19. Data Type Conventions

The initial PostgreSQL implementation should use:

- UUIDs for primary keys
- `timestamptz` for timestamps
- `numeric` for scoring and financial values
- `jsonb` only where flexible configuration is justified
- explicit foreign keys for core business relationships
- unique constraints for business identifiers
- indexes on tenant, client, assessment, status, and version columns

Examples of recommended unique constraints:

- organization_id + methodology code
- organization_id + template name
- template_id + version_number
- provider + provider_user_id
- assessment_id + template_question_id + respondent_user_id where applicable

## 20. ERD Design Rules

The logical data model will follow these design rules:

1. Every organization-owned entity must include `organization_id`.
2. Every assessment-owned entity must include `assessment_id`.
3. Client-specific entities should include `client_id`.
4. Published versions are immutable.
5. Historical records must retain version references.
6. Cross-tenant foreign-key relationships are prohibited.
7. Authentication identities are separated from platform users.
8. Many-to-many relationships use explicit bridge entities.
9. Auditability is required for status, publication, approval, and security changes.
10. Application services must enforce lifecycle rules in addition to database constraints.


## 21. First ERD Draft Completion Status

This document now defines the first conceptual and logical ERD for the GeoVaris Assessment Platform.

The next modeling stage will convert these entities into:

- Physical PostgreSQL tables
- Primary and foreign keys
- Database constraints
- Index strategy
- Drizzle ORM schemas
- Migration scripts
- A visual entity relationship diagram
