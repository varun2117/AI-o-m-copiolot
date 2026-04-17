## Implementation Plan: AI O&M Copilot for Utility-Scale Solar
**Stack**: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui + SQLite (better-sqlite3) + OpenAI
**Estimated files**: 45

### Data Model
```sql
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  capacity REAL,
  location TEXT,
  block_count INTEGER DEFAULT 0,
  latest_inspection_date TEXT,
  health_score REAL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS asset_locations (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'BLOCK', 'ROW', 'STRING'
  identifier TEXT NOT NULL,
  parent_id TEXT REFERENCES asset_locations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inspection_batches (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
  upload_date TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS uploaded_files (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES inspection_batches(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'THERMAL', 'RGB', 'ALARM_CSV', 'WEATHER_CSV', 'MAINTENANCE_CSV'
  storage_path TEXT NOT NULL,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES inspection_batches(id) ON DELETE CASCADE,
  location_id TEXT REFERENCES asset_locations(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  confidence REAL NOT NULL,
  recommendation TEXT NOT NULL,
  explanation TEXT,
  impact_band TEXT,
  reviewer_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'EDITED', 'REJECTED'
  reviewer_comment TEXT,
  ai_metadata TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contextual_events (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  location_id TEXT REFERENCES asset_locations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'ALARM', 'WEATHER', 'MAINTENANCE'
  timestamp TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'FINDING', 'BATCH', 'SITE'
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'REVIEW', 'OVERRIDE'
  user_id TEXT NOT NULL,
  details TEXT,
  timestamp TEXT DEFAULT (datetime('now'))
);
```

### API Routes Table
| Method | Path | Request Body | Response | Description |
|--------|------|-------------|----------|-------------|
| GET | /api/sites | — | `{ data: Site[] }` | List all sites |
| POST | /api/sites | `{ name, capacity, location }` | `{ data: Site }` | Create a site |
| GET | /api/sites/:id | — | `{ data: Site }` | Get site details |
| POST | /api/sites/:id/batches | `{ }` | `{ data: Batch }` | Create a new inspection batch |
| POST | /api/batches/:id/files | `FormData (file, type)` | `{ data: File }` | Upload images, videos, CSVs |
| POST | /api/batches/:id/analyze | `{ }` | `{ data: JobStatus }` | Start an analysis job |
| GET | /api/jobs/:id | — | `{ data: JobStatus }` | Return job status and logs |
| GET | /api/batches/:id/findings | — | `{ data: Finding[] }` | Return findings for the batch |
| GET | /api/findings/:id | — | `{ data: Finding }` | Return detailed evidence/explanation |
| PATCH | /api/findings/:id | `{ reviewerStatus, comment, ... }` | `{ data: Finding }` | Update reviewer decision/fields |
| GET | /api/sites/:id/report | — | `{ data: Report }` | Generate or fetch summary report |
| GET | /api/health | — | `{ status: 'ok' }` | Return application health status |

### Component Tree
```
RootLayout
├── ThemeProvider
├── (auth)/
│   ├── LoginPage → LoginForm
│   └── RegisterPage → RegisterForm
└── (dashboard)/
    ├── DashboardLayout → Sidebar + Header
    ├── DashboardPage → DashboardStats + RecentBatches
    ├── sites/
    │   ├── SitesPage → SitesTable + CreateSiteDialog
    │   └── [id]/
    │       ├── SiteDetailPage → SiteMetadata + BatchesList
    │       ├── batches/new/
    │       │   └── NewBatchPage → FileUpload
    │       └── report/
    │           └── ReportPage → ReportSummary
    ├── batches/
    │   └── [id]/findings/
    │       └── FindingsPage → FindingsTable + Filters
    └── findings/
        └── [id]/
            └── FindingDetailPage → FindingEvidence + ReviewPanel
```

### Phase 1: Project Setup & Configuration
- [ ] Task 1.1: Initialize Next.js project structure
  - Files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `.env.example`, `.gitignore` (CREATE)
- [ ] Task 1.2: Set up design system and UI components
  - Files: `src/lib/utils.ts`, `src/app/globals.css`, `components.json` (CREATE)
- [ ] Task 1.3: Set up database schema and better-sqlite3 client
  - Files: `schema.sql`, `src/lib/db.ts` (CREATE)
- [ ] Task 1.4: Set up authentication and security middleware
  - Files: `src/lib/auth.ts`, `src/middleware.ts` (CREATE)

### Phase 2: Core UI Components & Layout
- [ ] Task 2.1: shadcn/ui base components
  - Files: `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `table.tsx`, `badge.tsx`, `dialog.tsx`, `label.tsx`, `select.tsx`, `sonner.tsx` (CREATE)
- [ ] Task 2.2: App layout
  - Files: `src/app/layout.tsx`, `src/components/sidebar.tsx`, `src/components/header.tsx` (CREATE)
- [ ] Task 2.3: Auth pages
  - Files: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` (CREATE)

### Phase 3: Master Data & Intake
- [ ] Task 3.1: Site Management API & UI
  - Files: `src/app/api/sites/route.ts`, `src/app/api/sites/[id]/route.ts`, `src/app/(dashboard)/sites/page.tsx`, `src/app/(dashboard)/sites/[id]/page.tsx` (CREATE)
- [ ] Task 3.2: Inspection Batch Creation & File Upload API
  - Files: `src/app/api/sites/[id]/batches/route.ts`, `src/app/api/batches/[id]/files/route.ts`, `src/lib/storage.ts` (CREATE)
- [ ] Task 3.3: Batch Upload UI
  - Files: `src/app/(dashboard)/sites/[id]/batches/new/page.tsx`, `src/components/file-upload.tsx` (CREATE)

### Phase 4: AI Processing & Findings
- [ ] Task 4.1: Batch Analysis Job API (Mock/Simulated)
  - Files: `src/app/api/batches/[id]/analyze/route.ts`, `src/app/api/jobs/[id]/route.ts`, `src/lib/ai-service.ts` (CREATE)
- [ ] Task 4.2: Issue Queue UI
  - Files: `src/app/api/batches/[id]/findings/route.ts`, `src/app/(dashboard)/batches/[id]/findings/page.tsx`, `src/components/findings-table.tsx` (CREATE)
- [ ] Task 4.3: Finding Detail & Review UI
  - Files: `src/app/api/findings/[id]/route.ts`, `src/app/(dashboard)/findings/[id]/page.tsx`, `src/components/finding-evidence.tsx`, `src/components/review-panel.tsx` (CREATE)

### Phase 5: Dashboards & Reporting
- [ ] Task 5.1: Main Dashboard
  - Files: `src/app/(dashboard)/page.tsx`, `src/components/dashboard-stats.tsx` (CREATE)
- [ ] Task 5.2: Report Generation
  - Files: `src/app/api/sites/[id]/report/route.ts`, `src/app/(dashboard)/sites/[id]/report/page.tsx` (CREATE)

### Phase 6: Polish & Documentation
- [ ] Task 6.1: Error handling and loading states
  - Files: `src/app/error.tsx`, `src/app/loading.tsx`, `src/components/ui/skeleton.tsx` (CREATE)
- [ ] Task 6.2: Documentation
  - Files: `README.md` (CREATE)
