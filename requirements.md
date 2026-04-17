# Requirements: AI O&M Copilot for Utility-Scale Solar

## Overview
A prototype web platform for utility-scale solar operations teams to ingest, process, review, and report on inspection data (thermal/RGB images, alarms, weather, maintenance history). The system uses AI to detect issues, correlate evidence, prioritize findings, and recommend actions, keeping a human-in-the-loop for final operational decisions.

## Functional Requirements

### Master Data & Site Management
- FR-1: User can create, edit, and view site, block, row, string, and asset-location records.
- FR-2: System stores site attributes including name, ID, capacity, location, block count, latest inspection date, health score, and inspection status.

### Inspection Intake & Processing
- FR-3: User can create an inspection batch associated with a selected site.
- FR-4: User can upload thermal images, RGB images, videos, alarms CSV, weather CSV, and maintenance history CSV to a batch.
- FR-5: System validates uploaded file type, size, required fields, timestamp format, and site-to-batch association.
- FR-6: System executes batch analysis asynchronously and exposes job status, progress, and processing logs.
- FR-7: System supports re-running a curated demo scenario or uploaded batch for testing and rehearsals.

### AI Detection & Context Enrichment
- FR-8: System detects configured issue classes (hotspot, heavy soiling, visible damage, row anomaly, inverter underperformance).
- FR-9: System groups repeated or closely related detections into a single reviewable issue record.
- FR-10: System associates findings with available alarm events, weather data, maintenance history, and site layout metadata.
- FR-11: System assigns severity based on thresholds, evidence strength, recurrence, and business rules.
- FR-12: System assigns a recommended action (inspect now, clean within 48 hours, dispatch technician, monitor next cycle, no action).
- FR-13: System assigns a confidence score/band to each finding and recommendation.
- FR-14: System generates a plain-language explanation summarizing evidence, confidence, urgency, and recommendation reason using OpenAI.
- FR-15: System displays estimated energy-loss or revenue-impact bands.
- FR-16: System shows prior maintenance events, prior alarms, and recurring issue history relevant to the finding.

### Review Workflow & Issue Management
- FR-17: System provides a ranked issue queue with sorting and filtering by severity, confidence, site, block, status, and issue type.
- FR-18: System provides a finding detail page showing thermal/RGB evidence, alarms, weather, history, explanation, recommendation, and review controls.
- FR-19: Reviewer can accept, edit, or reject a finding and record comments or override reasons.
- FR-20: Reviewer can override severity, confidence, recommendation, and business impact band.
- FR-21: System retains an audit trail for finding creation, rule application, model version, prompt version, review actions, overrides, and report generation.

### Dashboards & Reporting
- FR-22: System provides a dashboard summarizing site health, issue counts, critical findings, recurring findings, and latest inspection status.
- FR-23: System provides a site overview page with metadata, current inspection batch, weather snapshot, and top open issues.
- FR-24: System provides a map or zone summary showing issue counts and urgency labels by site area.
- FR-25: System generates a site or batch action summary report containing issue counts, top actions, recurring issues, and reviewer outcomes.
- FR-26: System supports export of summary information to PDF, DOCX, CSV, and screen-ready presentation formats.

### Administration
- FR-27: Administrators can manage thresholds, issue rules, site mappings, model versions, and prompt versions.
- FR-28: System exposes a health endpoint for service monitoring and deployment checks.

## Non-Functional Requirements
- NFR-1: **Security** — Authenticated access and role-based authorization. Cryptographically random IDs (cuid/uuid). Security headers. Request body size limits. Input validation on all endpoints with Zod.
- NFR-2: **Performance** — Demo batches process in 1-3 minutes. UI updates within 5 seconds of refresh. Finding detail pages open within 3 seconds. Asynchronous queue-based execution for analysis tasks.
- NFR-3: **Reliability** — System preserves uploaded files, batch metadata, findings, and review decisions across service restarts. Error boundaries in React. Structured API errors with meaningful HTTP status codes.
- NFR-4: **Maintainability** — Separate UI, API, storage, task processing, and AI reasoning concerns. No file > 300 lines.
- NFR-5: **Accessibility** — Semantic HTML, aria labels on interactive elements, keyboard navigation, focus management.
- NFR-6: **Documentation** — README.md with installation, running, API docs, project structure.
- NFR-7: **Portability** — Runs through Docker Compose on a laptop, workstation, or cloud VM.
- NFR-8: **AI Guardrails** — Avoid claims of guaranteed root-cause diagnosis. Route low-confidence cases to inspect/monitor. Human overrides take precedence.

## Tech Stack
- **Language**: TypeScript
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite + better-sqlite3
- **State Management**: Server Components + Zustand (if needed for complex client state)
- **Forms**: react-hook-form + Zod
- **Auth**: Custom (bcryptjs + jose JWT)
- **Testing**: Vitest + Testing Library
- **Icons**: Lucide React
- **AI Integration**: OpenAI SDK

## Data Model

### Site
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| name | String | required | |
| capacity | Float | | in MW |
| location | String | | |
| blockCount | Int | default 0 | |
| latestInspectionDate | DateTime | optional | |
| healthScore | Float | optional | |
| status | String | default 'ACTIVE' | |
| createdAt | DateTime | default now() | |
| updatedAt | DateTime | updated at | |

### AssetLocation
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| siteId | String | FK to Site | |
| type | String | required | 'BLOCK', 'ROW', 'STRING' |
| identifier | String | required | e.g., 'Block A', 'Row 12' |
| parentId | String | FK to AssetLocation | optional, for hierarchy |

### InspectionBatch
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| siteId | String | FK to Site | |
| status | String | required | 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED' |
| uploadDate | DateTime | default now() | |
| completedAt | DateTime | optional | |

### UploadedFile
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| batchId | String | FK to InspectionBatch | |
| fileName | String | required | |
| fileType | String | required | 'THERMAL', 'RGB', 'ALARM_CSV', 'WEATHER_CSV', 'MAINTENANCE_CSV' |
| storagePath | String | required | |
| uploadedAt | DateTime | default now() | |

### Finding
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| batchId | String | FK to InspectionBatch | |
| locationId | String | FK to AssetLocation | optional |
| issueType | String | required | |
| severity | String | required | 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW' |
| confidence | Float | required | 0.0 to 1.0 |
| recommendation | String | required | |
| explanation | String | optional | AI generated text |
| impactBand | String | optional | |
| reviewerStatus | String | default 'PENDING' | 'PENDING', 'ACCEPTED', 'EDITED', 'REJECTED' |
| reviewerComment | String | optional | |
| aiMetadata | String | optional | JSON string of model/prompt versions |
| createdAt | DateTime | default now() | |
| updatedAt | DateTime | updated at | |

### ContextualEvent (Alarms, Weather, Maintenance)
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| siteId | String | FK to Site | |
| locationId | String | FK to AssetLocation | optional |
| eventType | String | required | 'ALARM', 'WEATHER', 'MAINTENANCE' |
| timestamp | DateTime | required | |
| description | String | required | |
| metadata | String | optional | JSON string for specific fields |

### AuditLog
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (cuid) | PK | |
| entityType | String | required | 'FINDING', 'BATCH', 'SITE' |
| entityId | String | required | |
| action | String | required | 'CREATE', 'UPDATE', 'REVIEW', 'OVERRIDE' |
| userId | String | required | |
| details | String | optional | JSON string of changes |
| timestamp | DateTime | default now() | |

## API Endpoints

| Method | Path | Request Body | Response | Description |
|--------|------|-------------|----------|-------------|
| POST | /api/sites | { name, capacity, location } | Site | Create a site record |
| GET | /api/sites | — | Site[] | List all sites |
| GET | /api/sites/:id | — | Site | Get site details |
| POST | /api/sites/:id/batches | { } | Batch | Create a new inspection batch |
| POST | /api/batches/:id/files | FormData (file, type) | File | Upload images, videos, CSVs |
| POST | /api/batches/:id/analyze | { } | JobStatus | Start an analysis job |
| GET | /api/jobs/:id | — | JobStatus | Return job status and logs |
| GET | /api/batches/:id/findings | — | Finding[] | Return findings for the batch |
| GET | /api/findings/:id | — | Finding | Return detailed evidence/explanation |
| PATCH | /api/findings/:id | { reviewerStatus, comment, ... } | Finding | Update reviewer decision/fields |
| GET | /api/sites/:id/report | — | Report | Generate or fetch summary report |
| GET | /api/health | — | { status: 'ok' } | Return application health status |

## UI/UX Requirements
- **Layout**: Sidebar navigation + main content area.
- **Key Pages/Views**: Dashboard, Site Overview, Batch Analysis, Issue Queue, Finding Detail, Report, Admin Settings.
- **Design System**: shadcn/ui + Tailwind CSS.
- **Dark Mode**: Yes (next-themes).
- **Responsive**: Desktop-first (operations tool), but usable on tablets.
- **Loading States**: Skeleton loaders for lists/dashboards, progress bars for batch uploads/analysis.
- **Empty States**: Clear illustrations + CTAs for empty queues or no sites.
- **Error States**: Error boundaries, toast notifications via sonner for actions.

## Assumptions
- Authentication will be a simple custom JWT implementation for the prototype.
- Background processing will be simulated or handled via simple async API routes for the prototype, rather than a full Redis/Celery queue, to keep the Docker setup simple.
- File uploads will be stored locally in the container/filesystem for the prototype.
- OpenAI API key will be provided via environment variables.
- The "AI" detection logic for images will be mocked or use a simplified LLM vision call for the prototype, as training a custom CV model is out of scope.

## Out of Scope
- Live drone control or mission planning.
- Autonomous maintenance execution.
- Bankable energy-loss modeling.
- Full CMMS / ERP / enterprise work-order integration.
- Production-grade multi-tenant enterprise stack.
- Field-ready offline mobile technician application.
- Unsupervised automated maintenance decisions.
