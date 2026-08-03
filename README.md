# 🏛️ Cabanatuan City Ordinance Portal  
**Ang Opisyal na Digital na Portal ng mga Ordinansa at AI Civic Assistant ng Lungsod ng Kabanatuan**  
*The Official Cabanatuan City Legislative Information System & Bilingual AI Civic Portal*

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![WCAG 2.2 AA Certified](https://img.shields.io/badge/A11Y-WCAG_2.2_AA_Certified-047857?style=for-the-badge)](#-accessibility--quality-assurance)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](./LICENSE)

---

## 🌟 Overview

The **Cabanatuan City Ordinance Portal** is a production-grade, accessible, and AI-powered legislative transparency platform built for **Cabanatuan City** and its **89 Barangays** in Nueva Ecija, Philippines. 

Designed to bridge the gap between local law enforcement and citizens, the portal democratizes public access to city resolutions, municipal ordinances, and barangay regulations through **full-text search**, an **AI-powered bilingual legal assistant ("Batas Kabanatuan AI")**, and **automated multimodal document parsing** for LGU administrators.

---

## ✨ Key Features

### 🔍 1. Public Ordinance Explorer & Split-Screen Viewer
- **Full-Text & Keyword Search:** Search through hundreds of city and barangay ordinances instantly by title, resolution number, category, or keyword.
- **⌘K Command Palette:** Quickly jump to any ordinance, report page, or admin section from anywhere in the application.
- **Bilingual Categorization:** Filter laws by Tagalog/English policy domains (e.g., *Kapayapaan at Kaayusan*, *Kalusugan at Sanitasyon*, *Kalakalan at Negosyo*, *Kapaligiran*).
- **Split-Screen Document Viewer:** Inspect full legal text side-by-side with official PDF attachments and download signed copies.

### 🤖 2. "Batas Kabanatuan AI" Civic Assistant
- **Bilingual Conversational AI:** Powered by Google's **Gemini 2.5 Flash Lite API**, citizens can ask complex legal questions in Tagalog, English, or Taglish.
- **Grounded Legislative Responses:** Responses are dynamically injected with live context from the city's Prisma database, citing exact Resolution Numbers and sections.
- **Streaming UI:** Real-time token streaming with accessible `aria-live` regions for screen readers.

### 📑 3. AI-Powered PDF Ordinance Parser (LGU Admin Portal)
- **Multimodal Document Extraction:** When administrators upload scanned or digital PDF ordinances, the portal uses **Gemini Multimodal Vision** to automatically extract:
  - Official Resolution Number & Series Year
  - Legislative Title & Category
  - Full Legal Text & Sections
- **One-Click Publishing:** Reduces manual data entry for barangay secretaries and city council clerks by 85%.

### 📊 4. Executive Analytics & Governance Dashboard
- **Recharts Analytics:** Visualizes enactment velocity, ordinance distribution across 89 barangays, and citizen report resolution rates.
- **Role-Based Access Control (RBAC):**
  - `LGU_ADMIN`: Full city-level CRUD, review queue, user directory, and news broadcasting.
  - `CAPTAIN`: Barangay-scoped ordinance management and local report resolution.
  - `CITIZEN`: Public access, AI inquiries, and civic feedback reporting.

### ♿ 5. WCAG 2.2 AA Accessibility Certified
- **44×44px Minimum Touch Targets:** Ergonomic floor across all interactive buttons, links, and table triggers.
- **High-Contrast Design System:** Custom tokens based on official LGU colors (`#1E3A8A` Deep Royal Blue, `#D97706` Amber Gold, `#047857` Emerald Green) exceeding 4.5:1 text contrast.
- **Full Keyboard Navigation:** 100% operable via keyboard with high-visibility focus indicators.
- **Motion Preferences:** Native `@media (prefers-reduced-motion)` support across all animations.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Citizen / Admin Browser] -->|HTTPS / Next.js App Router| Next[Next.js 16 Web Server]
    
    subgraph Frontend [React 19 / Tailwind v4 / Zustand]
        Next -->|Server Components & Actions| UI[Accessible UI Components]
        UI -->|⌘K Palette / Radix UI| A11Y[WCAG 2.2 AA Conformance]
    end
    
    subgraph Backend & APIs [API Routes & Middleware]
        Next -->|POST /api/chat| ChatAPI[Gemini Chat Stream]
        Next -->|POST /api/parse-ordinance| ParseAPI[Multimodal PDF Parser]
        Next -->|POST /api/upload| UploadAPI[Supabase Storage Upload]
    end
    
    subgraph Data & AI Layer [Cloud Infrastructure]
        ChatAPI -->|@google/genai v2| Gemini[Google Gemini 2.5 API]
        ParseAPI -->|Multimodal Vision| Gemini
        Next -->|Prisma 7 ORM| Postgres[(Supabase PostgreSQL)]
        UploadAPI -->|Signed / Public Buckets| Storage[(Supabase Storage PDFs)]
    end
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) | React 19 Server Components, Server Actions, API Routes |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling** | [Tailwind CSS v4 + CVA](https://tailwindcss.com/) | Design tokens, responsive layouts, theme-aware styling |
| **ORM & Database** | [Prisma 7.9 + Supabase PostgreSQL](https://prisma.io/) | Relational database schema, connection pooling, migrations |
| **File Storage** | [Supabase Storage](https://supabase.com/storage) | Cloud PDF ordinance document hosting |
| **AI & LLM** | [Google Gemini 2.5 (`@google/genai`)](https://ai.google.dev/) | Bilingual legal chat streaming, multimodal PDF parser |
| **UI Components** | Radix UI / Base UI / cmkd / Sonner | Accessible modals, command palette, toast notifications |
| **Charts & Stats** | [Recharts 3 + NumberFlow](https://recharts.org/) | Executive analytics dashboards and animated statistics |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Client-side draft persistence and chat history |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 20.0.0`
- **npm**, **pnpm**, or **bun**
- A [Supabase](https://supabase.com/) project (PostgreSQL Database + Storage Bucket named `ordinances`)
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/cabanatuan-city-ordinance-portal.git
cd cabanatuan-city-ordinance-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database Connections (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase API & Storage
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Authentication
JWT_SECRET="super-secret-jwt-key-32-characters-min"
```

### 4. Push Database Schema & Seed Data
Generate Prisma client, push schema to Supabase, and seed realistic ordinances and user accounts:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

> **Seeded Test Credentials:**
> - **LGU Super Admin:** `admin@cabanatuan.gov.ph` / `admin123`
> - **Barangay Captain:** `kapitan@cabanatuan.gov.ph` / `kapitan123`
> - **Citizen:** `juan@cabanatuan.gov.ph` / `citizen123`

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portal.

> **💡 Windows Shortcut (`manage.bat`):**  
> On Windows, you can double-click **`manage.bat`** in the project root to open an interactive menu for managing servers, or run direct CLI commands in Command Prompt/PowerShell:  
> - `manage.bat dev` (Start development server on port 3000)  
> - `manage.bat prod` (Build & launch optimized production server)  
> - `manage.bat studio` (Open Prisma Studio database manager on port 5555)  
> - `manage.bat stop` (Kill any active portal servers)  

---

## 📦 Production Build


To verify and compile an optimized production bundle:

```bash
npm run build
```

The system will perform full TypeScript type verification, linting, and generate 14 optimized static and dynamic server-rendered routes.

---

## ♿ Accessibility & Quality Assurance
This project adheres strictly to **WCAG 2.2 AA**, **ISO 9241-171**, and **ADA** accessibility baselines.
- Adheres to WCAG 2.2 AA standards with keyboard navigation, high-contrast themes, and aria-live regions.
- Enforces House Rules for ergonomic touch targets (≥44×44px) and bilingual Tagalog/English ARIA labels.

---

## 📜 License & LGU Attribution

Copyright © 2026 **Lungsod ng Kabanatuan** (Cabanatuan City Local Government Unit).  
Released under the **MIT License**.  
Designed and developed for public civic transparency and accessible local governance.
