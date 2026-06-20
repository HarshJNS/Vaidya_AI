# Vaidya MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private family Ayurvedic health assistant PWA with a FastAPI backend, Supabase schema, Gemini chat pipeline, safety checks, and installable Next.js frontend.

**Architecture:** The repo is a monorepo with `frontend/`, `backend/`, `supabase/`, and `docs/`. The backend owns safety, RAG, Gemini, profile context, admin data, and audit logging; the frontend owns auth, profile editing, chat UX, admin views, and PWA assets.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, FastAPI, Pydantic, Supabase, pgvector, Gemini, pytest, Vitest.

---

### Task 1: Workspace and Test Harness

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vitest.config.ts`
- Create: `backend/requirements.txt`
- Create: `backend/pytest.ini`
- Create: `.gitignore`

- [ ] Create installable frontend and backend dependency manifests.
- [ ] Add Vitest and pytest configurations so core behavior can be tested locally.
- [ ] Run dependency installation for both projects.

### Task 2: Backend Core

**Files:**
- Create: `backend/services/safety_service.py`
- Create: `backend/services/profile_service.py`
- Create: `backend/tests/test_safety_service.py`
- Create: `backend/tests/test_profile_service.py`

- [ ] Write failing tests for emergency detection, medicine hard blocks, Hindi emergency responses, and profile completeness.
- [ ] Implement safety and profile helpers until tests pass.

### Task 3: Backend API and Database

**Files:**
- Create: `backend/main.py`
- Create: `backend/models/schemas.py`
- Create: `backend/models/database.py`
- Create: `backend/services/ai_service.py`
- Create: `backend/services/rag_service.py`
- Create: `backend/routers/chat.py`
- Create: `backend/routers/profile.py`
- Create: `backend/routers/admin.py`
- Create: `backend/routers/upload.py`
- Create: `backend/routers/emergency.py`
- Create: `supabase/migrations/001_create_tables.sql`
- Create: `supabase/migrations/002_rls_policies.sql`
- Create: `supabase/migrations/003_vector_setup.sql`

- [ ] Add FastAPI app, routers, Supabase access, Gemini/RAG services, and SQL migrations matching the spec.
- [ ] Run backend tests and import checks.

### Task 4: Frontend PWA

**Files:**
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx`
- Create: `frontend/app/(auth)/login/page.tsx`
- Create: `frontend/app/chat/page.tsx`
- Create: `frontend/app/family/page.tsx`
- Create: `frontend/app/family/[id]/page.tsx`
- Create: `frontend/app/admin/page.tsx`
- Create: `frontend/app/profile/page.tsx`
- Create: `frontend/components/*.tsx`
- Create: `frontend/lib/*.ts`
- Create: `frontend/public/manifest.json`
- Create: `frontend/public/icons/*.svg`

- [ ] Build the installable dark Vaidya interface with Hindi/English toggle, chat, profile, family, and admin screens.
- [ ] Add client-side safety tests and API streaming parser.

### Task 5: Verification

**Files:**
- Modify any files needed to fix test, type, lint, or runtime issues.

- [ ] Run `pytest` in `backend`.
- [ ] Run `npm test`, `npm run lint`, and `npm run build` in `frontend`.
- [ ] Start the frontend dev server and verify the app loads locally.
