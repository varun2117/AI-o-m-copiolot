# Requirements Summary: AI O&M Copilot for Utility-Scale Solar

## Core Objective
A prototype web platform for utility-scale solar operations teams to ingest, process, review, and report on inspection data (thermal/RGB images, alarms, weather, maintenance history). It uses AI to detect issues, correlate evidence, prioritize findings, and recommend actions, keeping a human-in-the-loop for final decisions.

## Key Entities
- **Site**: Master record for a solar plant (capacity, location, health score).
- **Asset Locations**: Block, Row, String.
- **Inspection Batch**: A collection of uploaded files (images, CSVs) linked to a Site.
- **Finding**: An AI-detected issue with severity, confidence, recommendation, and explanation.
- **Contextual Data**: Alarms, Weather, Maintenance History.
- **Report**: Generated summary of findings and actions.

## Core Workflows
1. **Setup & Intake**: Create a site, create an inspection batch, and upload multi-source files (images, CSVs).
2. **Processing**: Run asynchronous batch analysis to detect issues, correlate context, and generate findings.
3. **Review**: Analysts view a ranked issue queue, inspect finding details (evidence, explanation), and accept/edit/reject recommendations.
4. **Reporting**: Generate and export action summary reports.

## AI & Business Logic
- **Structured First**: Derive anomaly scores, recurrence, and confidence before generating text.
- **Rules First**: Apply deterministic rules for severity/recommendation before using LLMs (OpenAI) for explanations.
- **Guardrails**: Route low-confidence findings to "monitor/inspect", avoid root-cause guarantees, and prioritize multi-evidence findings.
- **Traceability**: Log model versions, prompt versions, and human overrides.

## Technical Constraints & Stack
- **Tech Stack**: Next.js (App Router), React, Tailwind CSS, shadcn/ui, SQLite (better-sqlite3), OpenAI.
- **Performance**: Demo batches process in 1-3 mins; UI updates in <5s; detail pages load in <3s.
- **Architecture**: Asynchronous background processing for analysis jobs.
- **Deployment**: Docker Compose portability.
- **Security**: Authenticated access, role-based authorization.

## Out of Scope
- Live drone control, autonomous maintenance, full CMMS/ERP integration, mobile technician app, bankable energy-loss modeling.
