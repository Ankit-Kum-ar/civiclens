# CivicLens

[![Project Board](https://img.shields.io/badge/Project_Board-CivicLens-blue?logo=github&style=flat-square)](https://github.com/users/Ankit-Kum-ar/projects/3)

> **Privacy-Compliant, AI-Triaged Citizen Infrastructure Reporting**  
> Built for Hacktober HackDays 2026 • Track: Empowering Local Communities / Tech for Good

---

## 📌 Project Management

We track tasks, feature requests, and sprint progress on our official board:  
👉 **[View the CivicLens Project Board](https://github.com/users/Ankit-Kum-ar/projects/3)**

---

## 🚀 Overview

CivicLens is an open-source, community-first municipal grievance intake and triage engine designed to bridge the gap between active civic engagement and actionable municipal intervention:

- **1-Tap Frictionless Mobile Intake**: No app install needed (PWA), 1-tap Google Sign-in.
- **Automated Privacy Redaction**: Automatically blurs bystander faces and license plates at the CDN edge before media enters the public feed.
- **Multimodal Vernacular Voice Intake**: Citizens describe issues aloud; voice notes are automatically transcribed and parsed into structured urgency tags.
- **High-Speed Municipal Triage**: 3-second animated hover mini-clips allow ward engineers to triage dozens of reports without downloading 30MB+ videos.
- **Public Accountability Heatmap**: Interactive Leaflet risk heatmap with an "I'm Affected" counter and Before & After repair verification sliders.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **Styling & Components**: Tailwind CSS v4 & shadcn/ui
- **Authentication**: Auth.js / NextAuth v5 (Google OAuth)
- **Database & Spatial**: MongoDB Atlas with Mongoose (`2dsphere` spatial indexing)
- **Media & Edge Computation**: Cloudinary Edge Engine (facial redaction, speech-to-text, 3s preview generation)
- **Mapping**: Leaflet.js / React-Leaflet

---

## 🏁 Getting Started

### 1. Clone the repository & install dependencies

```bash
git clone https://github.com/Ankit-Kum-ar/civiclens.git
cd civiclens
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
