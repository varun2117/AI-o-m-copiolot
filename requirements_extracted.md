# Extracted Requirements: AI O&M Copilot for Utility-Scale Solar

## 1. Purpose
The platform shall support intake, storage, processing, review, prioritization, and reporting of solar plant operations and maintenance data, including thermal images, RGB images, alarms, weather context, and maintenance history. The objective is to help utility-scale solar operations teams move from raw inspection data to prioritized maintenance action through a controlled, traceable, human-reviewed workflow.

## 2. Scope
- This specification covers a prototype web platform for utility-scale solar operations and maintenance review.
- The system supports site setup, inspection batch intake, automated issue finding, context correlation, prioritization, recommendation generation, human review, and report export.
- The prototype is intended to look and behave like a practical operating tool for a pilot or customer demo.
- The scope is limited to batch-based processing and analyst-assisted review.

## 3. Business Context and Intended Users

### 3.1 Primary User Roles
- **Head of O&M**: Runs plant reliability, issue triage, and dispatch priorities. Views urgent findings, understands what must be fixed first, and reduces downtime.
- **Asset Manager**: Owns plant performance and financial outcomes. Sees estimated energy/revenue impact, recurring issues, and evidence-backed actions.
- **Inspection Lead**: Manages drone or inspection data collection and batch completeness. Uploads inspection batches quickly and confirms files are mapped and processed correctly.
- **Operations Analyst / Reviewer**: Reviews AI-generated findings and recommendations. Accepts, edits, or rejects system suggestions and retains review comments for traceability.
- **Executive Sponsor**: Wants quick proof of business value and pilot readiness. Sees a simple summary of site health, critical issues, and likely operational value.
- **System Administrator**: Maintains thresholds, site mappings, model versions, and prompt versions. Configures the platform, manages controls, and maintains operational traceability.

### 3.2 AI Roles in the Platform
- **Visual Detection AI**: Looks at thermal and RGB inspection images to detect likely issues (hotspots, heavy soiling, visible damage, row anomalies).
- **Evidence Correlation AI**: Joins visual findings with alarms, weather, maintenance history, and site layout.
- **Prioritization AI**: Ranks issues by severity, confidence, recurrence, and likely impact.
- **Recommendation AI**: Suggests the next action (inspect now, clean within 48 hours, dispatch technician, monitor next cycle, no action).
- **Explainability AI**: Writes a plain-language explanation of why the system raised an issue and recommended a certain action.
- **Historical Memory AI**: Checks whether the same zone, row, or string had a similar problem before and raises recurrence awareness.
- **Reporting AI**: Creates a summary report for operations, management, or pilot review using the latest approved findings.
- **Human-in-the-Loop AI**: Supports the reviewer with suggestions but does not make final operational decisions on its own.

## 4. Product Overview
The platform shall provide an operational workspace in which a user can define a solar site, upload inspection materials, run analysis jobs, inspect generated findings, review or override recommended actions, and export an action summary report.
The platform shall maintain linkage between site metadata, inspection batches, source files, findings, contextual records, reviewer decisions, and generated reports.

## 5. Major User Workflows
- Create and maintain site, block, row, string, and inspection-batch records.
- Upload thermal images, RGB images, alarms CSV, weather CSV or fetched weather data, and maintenance history CSV.
- Start a batch-analysis job and monitor job status, progress, and logs.
- Review findings grouped by issue class, severity, confidence, and site location.
- Open a finding detail page to inspect visual evidence, alarms, weather, prior history, explanation, and recommended action.
- Accept, edit, or reject a finding and record reviewer comments or override reasons.
- Generate and export an action summary report for operations, asset management, or executive review.

## 6. Functional Requirements
- **FR-01 Master data setup**: The system shall allow authorized users to create, edit, and view site, block, row, string, and asset-location records.
- **FR-02 Site attributes**: The system shall store site name, site ID, capacity, location, block count, latest inspection date, health score, and inspection status.
- **FR-03 Inspection batch creation**: The system shall allow users to create an inspection batch associated with a selected site.
- **FR-04 Multi-source file intake**: The system shall support upload of thermal images, RGB images, videos where applicable, alarms CSV, weather CSV, and maintenance history CSV to an inspection batch.
- **FR-05 File validation**: The system shall validate uploaded file type, file size, required fields, timestamp format, and site-to-batch association before processing.
- **FR-06 Background processing**: The system shall execute batch analysis asynchronously and expose job status, progress, and processing logs.
- **FR-07 Visual issue detection**: The system shall detect or flag configured issue classes such as hotspot, heavy soiling, possible crack or visible damage, row anomaly, and inverter-correlated underperformance suspicion.
- **FR-08 Finding consolidation**: The system shall group repeated or closely related detections into a single reviewable issue record when they refer to the same location or condition cluster.
- **FR-09 Context enrichment**: The system shall associate findings with available alarm events, weather data, maintenance history, and site layout metadata.
- **FR-10 Severity assignment**: The system shall assign a severity level to each finding based on configured thresholds, evidence strength, recurrence, and business rules.
- **FR-11 Action recommendation**: The system shall assign a recommended action such as inspect now, clean within 48 hours, dispatch technician, monitor next cycle, or no action.
- **FR-12 Confidence scoring**: The system shall assign a confidence score or confidence band to each finding and recommendation.
- **FR-13 Explainability view**: The system shall present a plain-language explanation summarizing evidence, confidence, urgency, and the reason for the recommendation.
- **FR-14 Business impact view**: The system shall display an estimated energy-loss band or revenue-impact band where configured for the prototype.
- **FR-15 Historical memory**: The system shall show prior maintenance events, prior alarms, and recurring issue history relevant to the current finding.
- **FR-16 Issue queue**: The system shall provide a ranked issue queue with sorting and filtering by severity, confidence, site, block, status, and issue type.
- **FR-17 Finding detail page**: The system shall provide a detail page showing thermal evidence, RGB evidence, alarms, weather, maintenance history, explanation, recommendation, and reviewer actions.
- **FR-18 Human review workflow**: The system shall allow a reviewer to accept, edit, or reject a finding and record comments or override reasons.
- **FR-19 Recommendation override**: The system shall allow a reviewer to change severity, confidence, recommendation, and business impact band before report generation.
- **FR-20 Audit trail**: The system shall retain change history for finding creation, rule application, model version, prompt version, review actions, overrides, and report generation.
- **FR-21 Dashboard view**: The system shall provide a dashboard summarizing site health, issue counts, critical findings, recurring findings, and latest inspection status.
- **FR-22 Site overview**: The system shall provide a site overview page with metadata, current inspection batch, weather snapshot, and top open issues.
- **FR-23 Map or zone summary**: The system shall provide a block or row summary view showing issue counts and urgency labels by site area.
- **FR-24 Report generation**: The system shall generate a site or batch action summary report containing issue counts, top actions, recurring issues, and reviewer outcomes.
- **FR-25 Report export**: The system shall support export of summary information to PDF, DOCX, CSV, and screen-ready presentation format where required for pilot review.
- **FR-26 Administrative configuration**: The system shall allow administrators to manage thresholds, issue rules, site mappings, model versions, and prompt versions without code changes where practical.
- **FR-27 Health endpoint**: The system shall expose a health endpoint for service monitoring and deployment checks.
- **FR-28 Scenario replay**: The system shall support re-running a curated demo scenario or uploaded batch so the same case can be used for testing and rehearsals.

## 7. AI-Specific Requirements
- **AI-01 Structured evidence first**: The AI stack shall derive structured signals such as anomaly score, recurrence score, alarm correlation, and confidence before generating narrative explanations.
- **AI-02 Rules before free-text reasoning**: The system shall apply deterministic rules for severity and action recommendation before invoking a language model for explanation or wording.
- **AI-03 Low-confidence handling**: The system shall route low-confidence cases toward inspect or monitor recommendations instead of over-confident repair-now recommendations.
- **AI-04 Multi-evidence confidence boost**: The system shall raise confidence when multiple evidence sources agree, such as thermal anomaly plus alarm correlation plus repeat maintenance history.
- **AI-05 Non-over-escalation behavior**: The system shall distinguish between non-urgent patterns such as broad soiling and acute fault-like patterns such as sharp hotspots.
- **AI-06 Explanation constraints**: The language model shall explain the recommendation using available structured evidence and shall avoid unsupported root-cause claims.
- **AI-07 Traceable AI outputs**: Every AI-generated finding and explanation shall store the model version, prompt version, rule version, and timestamp used to produce it.
- **AI-08 Human override precedence**: Human-reviewed decisions shall take precedence over AI-generated severity and recommendation values in downstream reporting.
- **AI-09 Repeatability**: The same curated scenario shall produce materially consistent outputs unless thresholds, model versions, or rules are changed.
- **AI-10 Guardrail language**: The platform shall present cautious wording such as likely issue, possible recurrence, or recommended inspection when certainty is not high.

## 8. Non-Functional Requirements
- **NFR-01 Usability**: The application shall provide a web-based interface suitable for operations, engineering, and management users without requiring command-line interaction.
- **NFR-02 Prototype performance**: A curated demo batch should complete within 1-3 minutes under expected prototype data volumes.
- **NFR-03 UI responsiveness**: Batch status updates should be visible within 5 seconds of refresh and finding detail pages should open within 3 seconds under prototype-scale load.
- **NFR-04 Scalability**: The system shall support batch-oriented processing and queue-based execution so that analysis tasks do not block user interaction.
- **NFR-05 Reliability**: The system shall preserve uploaded files, batch metadata, findings, and review decisions across service restarts.
- **NFR-06 Security**: The system shall require authenticated access and role-based authorization for upload, review, administration, and export functions.
- **NFR-07 Traceability**: The system shall maintain traceability from site to batch, from batch to files, and from files and contextual records to findings and reports.
- **NFR-08 Auditability**: The system shall log user actions affecting upload, analysis, review, override, configuration, and export.
- **NFR-09 Configurability**: Thresholds, rule parameters, mappings, and prompt settings shall be externally configurable without code changes where practical.
- **NFR-10 Maintainability**: The system shall separate UI, API, storage, task processing, and AI reasoning concerns so that components can be updated independently.
- **NFR-11 Observability**: The system shall expose processing logs, error traces, and health indicators for troubleshooting.
- **NFR-12 Reproducibility**: The same demo batch should produce materially consistent outputs unless configuration or AI version settings change.
- **NFR-13 Portability**: The prototype should run through Docker Compose on a laptop, workstation, or cloud VM.
- **NFR-14 Safe AI communication**: The system shall avoid claims of guaranteed root-cause diagnosis or unsupervised maintenance decisions in its user-facing explanations.
- **NFR-15 LLM**: Use OpenAI for LLM.

## 9. Data Requirements
- The system shall maintain master records for site, block, row, string, asset-location, and inspection batch.
- The system shall store metadata for uploaded files, including source type, upload timestamp, sensor type, site mapping, and storage location.
- The system shall store alarm events with timestamp, severity, code, description, and asset reference.
- The system shall store weather or irradiance context relevant to the inspection timestamp and site.
- The system shall store maintenance events with ticket ID, action taken, notes, outcome, and location reference.
- The system shall store findings with issue type, severity, confidence, evidence references, recommendation, reviewer status, and explanation text.
- The system shall store report metadata and generated output references for later retrieval.
- The system shall store model-run metadata, including model version, prompt version, rule version, and run time.

## 10. External Interfaces

### 10.1 User Interface Screens
- **Dashboard**: Portfolio or site health summary, critical findings, and latest inspection status.
- **Site overview**: Site metadata, capacity, latest inspection, weather snapshot, and summary cards.
- **Batch analysis page**: Uploaded files, processing status, counts by sensor type, and job logs.
- **Issue queue**: Ranked findings list with severity, confidence, recommendation, and status.
- **Finding detail page**: Thermal and RGB evidence, alarms, weather, history, explanation, and review controls.
- **Report page**: Executive summary, issue counts, top actions, recurring issues, and export controls.
- **Admin/configuration page**: Thresholds, site mappings, model versions, prompt versions, and rule settings.

### 10.2 API Endpoints
- `POST /sites`: Create a site record
- `POST /sites/{id}/inspection-batches`: Create a new inspection batch
- `POST /batches/{id}/files`: Upload images, videos, and CSV files
- `POST /batches/{id}/analyze`: Start an analysis job
- `GET /jobs/{id}`: Return job status and processing logs
- `GET /batches/{id}/findings`: Return findings for the selected batch
- `GET /findings/{id}`: Return detailed evidence, recommendation, and explanation
- `PATCH /findings/{id}`: Update reviewer decision or finding fields
- `GET /sites/{id}/report`: Generate or fetch a summary report
- `GET /health`: Return application health status

## 11. Business Rules and AI Guardrails
- A finding shall not be marked as closed until it has a recorded reviewer decision or a documented system disposition.
- Low-confidence findings shall be routed toward review or monitor wording rather than aggressive repair wording.
- Severity and recommended action shall be derived from configurable thresholds and contextual evidence.
- Any reviewer override shall require a retained audit entry and optional comment.
- A report shall reflect the latest approved or overridden values available at generation time.
- The system shall not claim guaranteed root-cause diagnosis unless supported by explicit deterministic logic or approved domain rules.
- Sites or zones with recurrence, strong thermal evidence, and matching alarms shall be prioritized ahead of low-evidence or single-signal cases.

## 12. Out of Scope
- Live drone control or mission planning
- Autonomous maintenance execution
- Bankable energy-loss modeling
- Full CMMS / ERP / enterprise work-order integration
- Production-grade multi-tenant enterprise stack
- Field-ready offline mobile technician application
- Unsupervised automated maintenance decisions
