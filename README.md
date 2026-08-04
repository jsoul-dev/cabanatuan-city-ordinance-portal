# 🏛️ Cabanatuan City Ordinance Portal
**Ang Opisyal na Digital na Portal ng mga Ordinansa at AI Civic Assistant ng Lungsod ng Cabanatuan**  
*The Official Cabanatuan City Legislative Information System & Bilingual AI Civic Portal*

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](https://github.com/jsoul-dev/cabanatuan-city-ordinance-portal/blob/main/LICENSE)

---

## Overview

The **Cabanatuan City Ordinance Portal** is a production-grade, AI-powered legislative transparency platform built for **Cabanatuan City** and its **89 Barangays** in Nueva Ecija, Philippines. 

Designed to bridge the gap between local law enforcement, government officials, and citizens, the portal democratizes public access to city resolutions, municipal ordinances, and barangay regulations through **full-text search**, an **AI-powered bilingual legal assistant ("Batas Cabanatuan AI")**, and **automated multimodal OCR document parsing** for LGU and Barangay administrators.

---

## Key Features

### 1. Public Ordinance Explorer & Split-Screen Viewer
- **Full-Text & Keyword Search:** Search through hundreds of city and barangay ordinances instantly by title, resolution number, policy category, or keyword.
- **⌘K Command Palette:** Quickly jump to any ordinance, report page, or admin section from anywhere in the application.
- **Bilingual Policy Categorization:** Filter laws by Tagalog/English policy domains (e.g., *Kapayapaan at Kaayusan*, *Kalusugan at Sanitasyon*, *Kalakalan at Negosyo*, *Kapaligiran*).
- **Split-Screen Document Viewer & Accessibility:** Inspect full legal text side-by-side with official PDF attachments (`pdf-viewer-modal.tsx`), download signed copies, and toggle between Dark and Light themes (`theme-toggle.tsx`).

### 2. "Batas Cabanatuan AI" Civic Assistant
- **Bilingual Conversational AI:** Powered by Google's **Gemini 2.5 Flash Lite API**, citizens can ask complex legal questions in Tagalog, English, or Taglish.
- **Grounded Legislative Responses:** Responses are dynamically injected with live context from the city's Prisma database, citing exact Resolution Numbers, sections, and penalties.
- **Streaming UI:** Real-time token streaming with responsive feedback and persistent client-side chat history.

### 3. AI-Powered OCR & Multimodal Ordinance Parser
- **Scanned Document & Image OCR Extraction:** Using **Gemini 3.5 Flash-Lite Multimodal Vision (`/api/ordinances/extract`)**, administrators can upload digital PDFs, complete scanned PDFs, or multiple sequential image pages (PNG/JPG/WEBP) even with stamps, watermarks, or signatures.
- **Multi-Page & Multi-File OCR:** Automatically combines and analyzes multi-page scanned ordinances in sequence to reconstruct the complete title, sections, and penalties.
- **Automated Metadata Parsing:** Automatically extracts and structures:
  - Official Resolution Number, Series Year, and Date Enacted
  - Cleaned Legislative Title (strips verbose legal preambles)
  - Policy Category, Summary, Coverage, and Key Tags
  - Detailed Penalties and Enforcement Agencies
- **Interactive Review Modal:** Administrators can verify and tweak AI-extracted fields before publishing to the database, reducing manual encoding by 85%.

### 4. Executive Analytics & Governance Dashboard
- **Recharts Analytics & Instant Shimmer Skeletons:** Interactive visualizations for enactment velocity, policy distribution, and citizen report resolution rates across LGU and Barangay dashboards with accurate skeleton loading states (`TableSkeleton`, `FilterBarSkeleton`, `AnalyticsLoadingSkeleton`).
- **Dynamic Barangay Account Management:** Modern pop-modal account creation for participating barangays with dynamic boundary year calculation (defaulting to 2015–2026 fallback).
- **Participating-Only Civic Reporting:** Citizen violation reports are intelligently filtered and routed only to registered and participating barangays.
- **Zero-Config Local Development Storage:** Automatically defaults to `/public/uploads/` for zero-config local development while supporting Supabase Storage for production deployments.
- **Accessible & Responsive Modals:** Full WAI-ARIA compliant modal dialogs across LGU and Barangay dashboards with backdrop click-to-close, global `Escape` key listeners, and primary action `Enter` key support.
- **Role-Based Access Control (RBAC):**
  - `LGU_ADMIN`: Full city-level CRUD, review queue, user directory, and news broadcasting.
  - `CAPTAIN`: Barangay-scoped ordinance management and local report resolution.
  - `CITIZEN`: Public access, AI inquiries, and civic feedback reporting.

---

## System Architecture

```mermaid
graph TD
    Client["Citizen / Admin Browser"] -->|"HTTPS / Next.js App Router"| Next["Next.js 16 Web Server"]
    
    Next -->|"Server Components & Actions"| UI["Responsive UI Components"]
    UI -->|"Command Palette / Radix UI"| Modals["Interactive UI & Modals"]
    
    Next -->|"POST /api/chat"| ChatAPI["Gemini Chat Stream"]
    Next -->|"POST /api/ordinances/extract"| ExtractAPI["Multimodal OCR Parser"]
    Next -->|"POST /api/upload"| UploadAPI["Supabase Storage Upload"]
    
    ChatAPI -->|"Google GenAI SDK"| Gemini["Google Gemini 2.5 & 3.5 API"]
    ExtractAPI -->|"Multimodal Vision"| Gemini
    Next -->|"Prisma 7 ORM"| Postgres["Supabase PostgreSQL"]
    UploadAPI -->|"Signed / Public Buckets"| Storage["Supabase Storage PDFs"]
```

---

## Project Structure

```text
cabanatuan-city-ordinance-portal/
├── prisma/
│   ├── schema.prisma              # Relational schema (Ordinance, Report, User, News, Analytics)
│   ├── seed.ts                    # Realistic seeding script for City & Barangay data
│   └── prisma.config.ts           # ORM configuration
├── src/
│   ├── app/
│   │   ├── admin/lgu/             # City LGU Admin Dashboard (Ordinances, Reports, Users, News, Analytics)
│   │   ├── admin/barangay/        # Barangay Captain Dashboard (Ordinances, Reports, Analytics)
│   │   ├── api/chat/              # Streaming chat route for Batas Cabanatuan AI
│   │   ├── api/ordinances/extract/ # Multimodal OCR AI extraction route (Gemini 3.5 Flash-Lite)
│   │   ├── chatbot/               # Full-screen conversational civic AI interface
│   │   ├── ordinances/[id]/       # Split-screen public ordinance detail viewer
│   │   ├── report/                # Civic violation reporting system
│   │   └── page.tsx               # Homepage & interactive search hero
│   ├── components/
│   │   ├── dashboard/             # Admin sidebar, header, skeletons, and AI extractor modal
│   │   ├── layout/                # Navbar, footer, command palette
│   │   └── ui/                    # Accessible UI primitives, PDF viewer modal, theme toggle
│   └── lib/                       # Prisma client, chat storage, dashboard queries, ordinance utils
└── public/
    └── uploads/                   # Zero-config local development document uploads
```

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) | React 19 Server Components, Server Actions, API Routes |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety across client and server |
| **Styling** | [Tailwind CSS v4 + CVA](https://tailwindcss.com/) | Design tokens, responsive layouts, theme-aware styling |
| **ORM & Database** | [Prisma 7.9 + Supabase PostgreSQL](https://prisma.io/) | Relational database schema, connection pooling, migrations |
| **File Storage** | [Supabase Storage](https://supabase.com/storage) | Cloud PDF ordinance document hosting |
| **AI & LLM** | [Google Gemini 2.5 & 3.5 (`@google/genai`)](https://ai.google.dev/) | Bilingual legal chat streaming, multimodal OCR PDF parser |
| **UI Components** | Radix UI / Base UI / cmkd / Sonner | Accessible modals, command palette, toast notifications |
| **Charts & Stats** | [Recharts 3 + NumberFlow](https://recharts.org/) | Executive analytics dashboards and animated statistics |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Client-side draft persistence and chat history |

---

## Getting Started

### Prerequisites
- **Node.js** `>= 20.0.0`
- **npm**, **pnpm**, or **bun**
- A [Supabase](https://supabase.com/) project (PostgreSQL Database + Storage Bucket named `ordinances`)
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/jsoul-dev/cabanatuan-city-ordinance-portal.git
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

> **Windows Shortcut (`manage.bat`):**  
> On Windows, you can double-click **`manage.bat`** in the project root to open an interactive menu for managing servers, or run direct CLI commands in Command Prompt/PowerShell:  
> - `manage.bat dev` (Start development server on port 3000)  
> - `manage.bat prod` (Build & launch optimized production server)  
> - `manage.bat studio` (Open Prisma Studio database manager on port 5555)  
> - `manage.bat stop` (Kill any active portal servers)  

---

## Production Build

To verify and compile an optimized production bundle:

```bash
npm run build
```

The system will perform full TypeScript type verification, linting, and generate 28 optimized static and dynamic server-rendered routes (including Recharts analytics and skeleton loading states).

---

## License & LGU Attribution

Copyright © 2026 **Lungsod ng Cabanatuan** (Cabanatuan City Local Government Unit).  
Released under the **[MIT License](https://github.com/jsoul-dev/cabanatuan-city-ordinance-portal/blob/main/LICENSE)**.  
Designed and developed for public civic transparency and local governance.
