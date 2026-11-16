# PJN TECH HRMS
## DAY 1 IMPLEMENTATION PROCEDURE & OPERATIONAL RUNBOOK
**Module:** Web Frontend (Admin & HR Portal)  
**Assigned Developer:** Jagadeesh  
**Review Lead:** Imran (Project Lead)  
**Date:** 16 November 2026  
**Target Branch:** `feat/hrms-web-day1-jagadeesh` → `dev`

---

## 1. Overview & Objectives

This runbook outlines the exact step-by-step procedure to implement, verify, and deliver the **Day 1 UI Design Handoff** for the PJN Tech HRMS Web application.

### Key Deliverables:
1. Reusable responsive Application Shell (`Sidebar`, `Header`, `AppShell`)
2. Login / Authentication Screen with full input, validation, and demo mock states
3. Admin / HR Dashboard with 4 KPI cards, SVG Attendance Line Chart, Leave Requests, and Quick Actions
4. Employee Management List screen with search bar, department & status filters, table view, pagination, and preview modals
5. Route fallbacks ("Coming Soon" screens) for unbuilt modules to eliminate broken clicks

---

## 2. Git Branching & Workflow Protocol

In compliance with the project repository rules (Section 8 & 9 of `README.md`):

```bash
# 1. Ensure you are in the repository root
cd HRMS_Project

# 2. Check out the dev branch (or create it from main if first time)
git checkout -b dev

# 3. Create your dedicated Day 1 feature branch
git checkout -b feat/hrms-web-day1-jagadeesh

# 4. Verify branch tracking
git branch --show-current
# Output should show: feat/hrms-web-day1-jagadeesh
```

> **Rule:** Never push directly to `main`. All PRs must target `dev` and be approved by Imran before merging.

---

## 3. Project Scaffolding & Setup

The web application is located under the `web/` directory.

### Directory Structure:
```text
HRMS_Project/
└── web/
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── vite-env.d.ts
        ├── types/
        │   └── index.ts
        ├── data/
        │   └── mockData.ts
        ├── layouts/
        │   └── AppShell.tsx
        ├── components/
        │   ├── Header.tsx
        │   └── Sidebar.tsx
        └── pages/
            ├── Login.tsx
            ├── Dashboard.tsx
            ├── EmployeeList.tsx
            └── ComingSoon.tsx
```

### Installation & Launch:
Run the following commands from the `web` directory:

```bash
# Navigate to web application directory
cd web

# Install dependencies (React 18, React Router v6, Lucide Icons, Tailwind CSS, Vite)
npm install

# Start Vite local development server
npm run dev
```

Default local URL: `http://localhost:3000`

---

## 4. Design Tokens & Styling Standard

Tailwind has been configured with the official brand tokens defined in the design handoff:

| Design Token | CSS / Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Purple** | `#6338DF` | Primary CTA buttons, active tab indicators, chart lines |
| **Hover Purple** | `#5229cb` | Button hover and focus states |
| **Deep Sidebar** | `#161A3D` | Sidebar background, primary brand typography |
| **Page Neutral** | `#F7F7FC` | Screen backgrounds and body canvas |
| **Card White** | `#FFFFFF` | Container cards, tables, popovers |
| **Status: Present** | `#10B981` (Bg: `#ECFDF5`) | Present badges, positive indicators |
| **Status: Pending** | `#F59E0B` (Bg: `#FFFBEB`) | Pending approvals, late arrival warnings |
| **Status: Absent** | `#EF4444` (Bg: `#FEF2F2`) | Absent badges, validation error banners |
| **Radius** | `12px` (`rounded-xl`) | Cards, tables, modals, input containers |

---

## 5. Screen Implementation Walkthrough

### 5.1 Authentication Screen (`/login`)
- **Visual Composition:** Centered responsive login card on desktop (`1440 × 900`); comfortable vertical padding on mobile (`390 × 844`).
- **Input Fields:**
  - `email`: Validates required field. Pre-filled with `admin@pjntech.com` for convenience.
  - `password`: Password field with interactive eye (`Eye`/`EyeOff`) toggle.
- **States:**
  - *Default:* Neutral borders with subtle icons.
  - *Focus:* Purple active ring (`ring-2 ring-[#6338DF]`).
  - *Validation Error:* Red banner alerting empty fields or non-PJN emails.
  - *Loading State:* Disabled button with spinning SVG indicator.
  - *Quick Fill Demo Buttons:* One-click buttons to test Admin and Jagadeesh accounts.

### 5.2 Application Shell (`/`)
- **Sidebar (`Sidebar.tsx`):**
  - Dark navy `#161A3D` with PJN Tech HRMS logo.
  - Active route highlighted in `#6338DF`.
  - Responsive mobile drawer triggered by top-bar hamburger button.
  - Footer with Admin credentials and quick logout session control.
- **Top Header (`Header.tsx`):**
  - Dynamic page title derived from current URL.
  - Notification bell with unread red badge.
  - Profile avatar dropdown with "My Profile", "Security & Roles", and "Logout".

### 5.3 Dashboard (`/dashboard`)
- **KPI Metrics:** 4 metric cards: Total Employees (154), Present Today (142), On Leave (8), Late Arrivals (4).
- **Attendance Overview:** Custom responsive SVG line chart plotting Mon through Fri attendance with active data circles and purple gradient area fill.
- **Leave Requests Widget:** Recent submissions from Arun Kumar, Priya S, and Rahul M with colored status pill badges.
- **Quick Action Grid:** 4 actionable cards linking to *Add Employee*, *Apply Leave*, *Check Attendance*, and *Generate Report*.

### 5.4 Employee Management (`/employees`)
- **Action Header:** Page title + "Add Employee" CTA button.
- **Search & Filters:** Real-time text search (names, ID, email, designation) + Department dropdown + Status dropdown.
- **Data Table:** Formatted columns for Employee ID (purple mono font), Name, Department, Designation, Email, Status badge, and View/Edit action buttons.
- **Empty States & Pagination:** Handles 0-result searches gracefully; supports clean page transitions.
- **UI Modal:** Clicking Add/View/Edit opens a modal dialog clearly explaining upcoming Day 3 backend API wiring.

### 5.5 Coming Soon Fallback (`/coming-soon/:module`)
- Prevents broken links or console errors when clicking unbuilt sidebar links. Displays a clean schedule roadmap aligned with the 7-day development plan.

---

## 6. Testing & Quality Assurance Verification

Before marking the checklist items as complete:

### 1. Viewport Checks:
- [ ] **Desktop (1440 × 900):** Verify 4 KPI cards in a row, fixed sidebar, full table width.
- [ ] **Tablet (768 × 1024):** Verify 2 KPI cards in a row, responsive table scroll, intact layout.
- [ ] **Mobile (390 × 844):** Verify sidebar folds into hamburger drawer, single-column KPI stack, horizontal table scroll.

### 2. Code Quality Checks:
```bash
# Run TypeScript compilation check
npm run build
```
Verify:
- 0 TypeScript compiler warnings or errors (`tsc`).
- 0 Browser console errors (`F12` Developer Tools).
- Smooth navigation without full-page reloads.

---

## 7. Daily Reporting Format (5:30 PM Review)

Post the daily status report in the team channel following Section 10 of `README.md`:

```markdown
### Daily Status Report — Day 1 (16 Nov 2026)
**Developer:** Jagadeesh  
**Role:** Web Frontend (React.js + TypeScript)  
**Branch:** feat/hrms-web-day1-jagadeesh  
**Pull Request:** [PR Link to dev]  

#### Completed Tasks:
- [x] Initialized Vite + React 18 + TypeScript + Tailwind CSS project in `web/`
- [x] Implemented responsive AppShell with desktop sidebar and mobile drawer
- [x] Built Login screen with validation, password toggle, and loading state
- [x] Built Dashboard screen with 4 KPI cards, SVG attendance chart, leave requests, and quick actions
- [x] Built Employee Management table with search, filters, pagination, and preview modals
- [x] Added "Coming Soon" route handlers for remaining HRMS modules

#### Pending Tasks:
- [ ] Day 2: Company and Branch Management UI
- [ ] Day 3: Employee Add/Edit form validation and backend contract alignment

#### Test Results:
- Viewports tested: 1440px (Desktop), 768px (Tablet), 390px (Mobile)
- TypeScript build: PASSED (0 errors)
- Console warnings: NONE

#### Blockers:
- None. Ready for 5:30 PM review with Imran.
```
