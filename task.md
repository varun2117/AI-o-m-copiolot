# Task Breakdown: AI O&M Copilot for Utility-Scale Solar

## Phase 1: Project Setup & Configuration
- [ ] Task 1.1: Initialize Next.js project structure
  - Files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `.env.example`, `.gitignore`
  - Acceptance: `npm install` succeeds, `npm run dev` starts without errors.
- [ ] Task 1.2: Set up design system and UI components
  - Files: `src/lib/utils.ts`, `src/app/globals.css`, `components.json`, `src/components/ui/*` (shadcn components: button, card, input, table, badge, toast/sonner)
  - Acceptance: Tailwind classes work, dark mode toggle works, basic UI components render.
- [ ] Task 1.3: Set up database schema and Prisma
  - Files: `prisma/schema.prisma`, `src/lib/prisma.ts`
  - Acceptance: `npx prisma generate` and `npx prisma db push` succeed, types available.
- [ ] Task 1.4: Set up authentication and basic layout
  - Files: `src/lib/auth.ts`, `src/app/layout.tsx`, `src/components/sidebar.tsx`, `src/components/header.tsx`
  - Acceptance: App layout renders with sidebar and header, basic JWT auth utilities exist.

## Phase 2: Core Features - Master Data & Intake
- [ ] Task 2.1: Site Management API & UI
  - Files: `src/app/api/sites/route.ts`, `src/app/api/sites/[id]/route.ts`, `src/app/(dashboard)/sites/page.tsx`, `src/app/(dashboard)/sites/[id]/page.tsx`
  - Acceptance: User can create, list, and view details of solar sites.
- [ ] Task 2.2: Inspection Batch Creation & File Upload API
  - Files: `src/app/api/batches/route.ts`, `src/app/api/batches/[id]/files/route.ts`, `src/lib/storage.ts`
  - Acceptance: User can create a batch and upload files (images, CSVs) which are saved to local storage.
- [ ] Task 2.3: Batch Upload UI
  - Files: `src/app/(dashboard)/sites/[id]/batches/new/page.tsx`, `src/components/file-upload.tsx`
  - Acceptance: UI allows selecting files, shows upload progress, and creates the batch.

## Phase 3: Core Features - AI Processing & Findings
- [ ] Task 3.1: Batch Analysis Job API (Mock/Simulated)
  - Files: `src/app/api/batches/[id]/analyze/route.ts`, `src/app/api/jobs/[id]/route.ts`, `src/lib/ai-service.ts`
  - Acceptance: API triggers an async job that simulates processing, uses OpenAI for explanations, and creates Finding records in the DB.
- [ ] Task 3.2: Issue Queue UI
  - Files: `src/app/api/batches/[id]/findings/route.ts`, `src/app/(dashboard)/batches/[id]/findings/page.tsx`, `src/components/findings-table.tsx`
  - Acceptance: User can view a ranked list of findings with filtering and sorting.
- [ ] Task 3.3: Finding Detail & Review UI
  - Files: `src/app/api/findings/[id]/route.ts`, `src/app/(dashboard)/findings/[id]/page.tsx`, `src/components/finding-evidence.tsx`, `src/components/review-panel.tsx`
  - Acceptance: User can view evidence, AI explanation, and accept/edit/reject the finding.

## Phase 4: Dashboards & Reporting
- [ ] Task 4.1: Main Dashboard
  - Files: `src/app/(dashboard)/page.tsx`, `src/components/dashboard-stats.tsx`
  - Acceptance: Dashboard shows portfolio health, critical findings, and recent batches.
- [ ] Task 4.2: Report Generation
  - Files: `src/app/api/sites/[id]/report/route.ts`, `src/app/(dashboard)/sites/[id]/report/page.tsx`
  - Acceptance: System generates a summary report of findings and actions.

## Phase 5: Polish & Documentation
- [ ] Task 5.1: Error handling and loading states
  - Files: `src/app/error.tsx`, `src/app/loading.tsx`, `src/components/ui/skeleton.tsx`
  - Acceptance: Skeletons show during data fetch, errors are caught and displayed via toasts.
- [ ] Task 5.2: Documentation
  - Files: `README.md`
  - Acceptance: README includes setup instructions, tech stack, and project overview.

## Dependencies
- `next`, `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `@prisma/client`, `prisma`
- `better-sqlite3`, `@types/better-sqlite3`
- `lucide-react`
- `clsx`, `tailwind-merge`
- `zod`, `react-hook-form`, `@hookform/resolvers`
- `next-themes`
- `sonner`
- `openai`
- `bcryptjs`, `jose` (for auth)
- `vitest`, `@testing-library/react`

## Estimated Complexity
- Complex
- Estimated files: 40-50
