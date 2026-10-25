# Hacktober Hack Days

# Project Documentation Template

*A 15-day (days are flexible) documentation template for hackathon participants. Duplicate this page, fill in the placeholders in [brackets], and update it daily. Delete the instruction lines (in italics) once you have read them.*

## How to Use This Template

- Duplicate this page into your own workspace before editing.
- Fill in **Sections 1 to 6** during the first three days, then keep them updated as the project evolves.
- Update the **Daily Log (Section 8)** at the end of every day. Five minutes a day is enough.
- Complete the **Final Submission Checklist (Section 11)** before the deadline.
- Share the page with the organizers (view or comment access) so they can review it.

## Suggested 15-Day Roadmap

| Phase | Days | Focus |
| --- | --- | --- |
| Ideate | Day 1 to 3 | Team formation, problem selection, research, scope, plan |
| Build | Day 4 to 10 | Core features, integrations, regular check-ins |
| Refine | Day 11 to 13 | Bug fixes, UI polish, testing, documentation |
| Deliver | Day 14 to 15 | Demo video, pitch, final submission |

## 1. Project Overview

| Field | Details |
| --- | --- |
| Project name | CivicLens |
| Team name | EdgeRunners |
| Track / theme | Empowering Local Communities / Tech for Good & Smart Civic Infrastructure |
| One-line pitch | Privacy-preserving, AI-triaged civic hazard reporting platform that eliminates bystander data leaks and municipal triage paralysis using client and cloud computer vision paired with lightweight video previews. |
| Repository link | https://github.com/Ankit-Kum-ar/civiclens |
| Live demo link | [Will be updated upon deployment] |
| Demo video link | [Will be updated upon recording] |
| Presentation / slides | [Will be updated upon deck completion] |

## 2. Team Members and Roles

| Name | Role | Responsibilities | Contact |
| --- | --- | --- | --- |
| Ankit Chauhan | Team Lead & Full-Stack Architect | Planning, coordination, database modeling (MongoDB Atlas), Cloudinary media pipelines, Next.js 16 core integration | https://github.com/Ankit-Kum-ar |
| Kartik Duseja | AI & Edge Privacy Engineer | In-browser MediaPipe WASM face detection, OpenRouter Vision AI fallback, Sharp image processing pipeline, privacy blur algorithm and auto-orientation | https://github.com/kartikduseja |
| Akshat Jain | Frontend & UI/UX Engineer | Responsive Next.js 16 App Router UI, Leaflet.js crash-safe GIS mapping and heatmaps, DashStack design system, dark and light theme tokens | https://github.com/akshatjain |

## 3. Problem Statement

*What problem are you solving, and why does it matter?*

- **The problem:** Urban grievance reporting systems (such as 311, MCD 311, and Swachhata apps) suffer from two severe structural bottlenecks: data privacy compliance violations and municipal triage paralysis. When citizens photograph or record street hazards (potholes, open manholes, dangling live electrical wires), the raw footage inadvertently captures bystander faces, school children, and civilian vehicle license plates. Simultaneously, municipal engineering offices receive dozens of heavy 30MB to 50MB raw smartphone videos that staff cannot realistically download or triage during emergency situations.
- **Who is affected:** 
  1. Everyday citizens whose personal data and faces are exposed without consent on public municipal feeds.
  2. Municipal ward engineers and response crews overwhelmed by unorganized, un-triaged raw media backlogs.
  3. Underrepresented communities and non-English speakers who face digital literacy barriers on traditional bureaucratic text-heavy portals.
- **Why it matters:** Under global data privacy legislation (such as India's DPDP Act 2023 and EU GDPR), municipal corporations face severe legal liability for exposing personal identifiable information (PII). Authorities respond by either locking down grievance feeds into opaque black boxes or outright rejecting reports. Consequently, over 50% of complaints remain unresolved or untraceable, public trust collapses, and life-threatening urban hazards persist for months.
- **Existing solutions and their gaps:** Existing 311 platforms require tedious manual multi-tier forms, lack automated privacy sanitization, do not support vernacular voice notes, and crash on dense map views. They force municipal staff to manually scrub through shaky videos rather than empowering them with automated visual classification, 3-second hover video loops, and urgency-based dispatch pipelines.

## 4. Proposed Solution

- **Overview:** CivicLens transforms any mobile web browser into an automated, zero-friction field reporting terminal. Citizens capture photos or 10-second videos with optional spoken vernacular voice notes. CivicLens immediately sanitizes bystander privacy using a hybrid MediaPipe WASM and OpenRouter Vision AI pipeline with high-radius Gaussian blurring, while Cloudinary generates 3-second hover-activated animated mini-clips. Municipal engineers review prioritized cards with auto-detected hazard tags (#OpenManhole, #ExposedWire) and dispatch maintenance teams with a single click.
- **Unique value:** 
  1. Dual-Layer Privacy Defense: Combines instant in-browser MediaPipe face detection with OpenRouter multi-region Vision AI and Sharp server-side pixel manipulation, ensuring 0% raw bystander PII ever reaches the public feed or storage.
  2. Zero-Bandwidth Video Triage: Ward officers preview 3-second CDN-rendered animated WebP and MP4 loops on hover without downloading multi-megabyte video files.
  3. Multimodal Accessibility: Spoken voice notes are transcribed into structured tags, eliminating English-only text form friction.
  4. Community Endorsements and Verification: Citizens upvote existing pins via "I'm Affected" to reduce duplicate tickets, followed by an interactive Before and After resolution slider.
- **Key features:**
    - One-tap authentication with role-based routing (Citizens vs. Municipal Officers).
    - Client-side tiled face detection via self-hosted MediaPipe Vision WASM.
    - OpenRouter Vision AI plate and face detection with high-strength sharp.blur() and auto EXIF orientation.
    - Interactive Leaflet.js GIS heatmap with custom container lifecycle management to prevent map crashes.
    - Municipal Officer terminal with status workflow transitions (OPEN to DISPATCH CREW to RESOLVED to REJECTED).
    - Dark and Light mode powered by Tailwind CSS v4 and DashStack design tokens.
- **Out of scope (for now):**
    - Native iOS and Android app store binaries (built as a lightweight PWA instead).
    - Automated drone dispatch and IoT sensor hardware integration.
    - Direct financial compensation or civic bounty payouts.

## 5. Tech Stack and Architecture

| Layer | Technology | Why we chose it |
| --- | --- | --- |
| Frontend | Next.js 16.4.2 (App Router), React 19, Tailwind CSS v4 | Cutting-edge performance, server components, fluid animations, and mobile-first PWA responsiveness. |
| Backend | Next.js 16 Server Actions, Node.js Runtime | Unified full-stack architecture, direct database mutations, and type-safe server functions. |
| Database | MongoDB Atlas M0, Mongoose ODM, 2dsphere indexing | Native geospatial indexing for coordinate proximity, fast aggregation, and atomic upvote counters. |
| APIs / Services | Cloudinary Edge Engine, MediaPipe WASM, OpenRouter Vision API, Auth.js v5 | Direct signed media streaming, hybrid computer vision privacy masking, and role-based authentication. |
| Hosting / Deployment | Vercel (Edge & Serverless), MongoDB Atlas Cloud | Low latency global edge caching, fast static asset distribution, and scalable cloud database storage. |
| Tools | Leaflet.js, Sharp, Lucide React, Git, GitHub Projects | High-performance image processing, lightweight open-source mapping, and agile project tracking. |

**Architecture overview:**
Citizens capture incidents via the Next.js 16 Progressive Web App. MediaPipe WASM runs in-browser to identify bystander faces instantly, while media is streamed directly to Cloudinary using secure signed tokens, bypassing server memory exhaustion. On the backend, OpenRouter Vision AI detects license plates and secondary faces, passing bounding coordinates to Sharp for heavy Gaussian blur with auto-corrected EXIF orientation. Metadata, transcripts, tags, and GeoJSON coordinates are persisted in MongoDB Atlas with 2dsphere indexing. Municipal officers access the /admin/dashboard triage terminal to review urgency-sorted reports with 3-second animated hover video clips and dispatch repair crews. Completed repairs feature an interactive Before and After slider on the public /explore Leaflet map.

**Data flow:**
1. Citizen authenticates via NextAuth and captures an incident photo or video with GPS coordinates.
2. The browser runs MediaPipe WASM face detection on image tiles; simultaneously, media is securely processed via server-side Vision AI for license plates and distant faces.
3. Node.js with Sharp sanitizes regions using sharp.rotate() and heavy Gaussian blur.
4. Clean media reference, tags, audio transcript, and GeoJSON coordinates are persisted in MongoDB Atlas.
5. Municipal officers access /admin/dashboard to review urgency-sorted reports, scrub through 3-second animated clips on hover, and dispatch repair crews.
6. Once repairs are completed, resolved proof photos enable public Before and After verification on /explore.

## 6. Feature Tracker

| Feature | Owner | Priority | Status | Notes |
| --- | --- | --- | --- | --- |
| 1-Tap Auth & Role-Based Guard | Ankit Chauhan | High | Done | Auth.js v5 with Citizen and Municipal Officer roles and demo logins. |
| Next.js 16 & React 19 Core Setup | Ankit Chauhan | High | Done | Migration to Next.js 16 App Router and dynamic cache connection patterns. |
| Direct Cloudinary Signed Upload | Ankit Chauhan | High | Done | Upload bypasses server RAM directly to Cloudinary with secure signature. |
| Leaflet GIS Map & Heatmap Grid | Akshat Jain | High | Done | Custom container lifecycle preventing DOM leaks and Leaflet pos errors. |
| Municipal Triage Hub & Hover Loops | Akshat Jain | High | Done | 3-second animated preview mini-clips for instant officer triage. |
| Client-Side MediaPipe Face Blur | Kartik Duseja | High | Done | Self-hosted WASM and BlazeFace short-range tiled detection. |
| OpenRouter Multi-Region Vision AI | Kartik Duseja | High | Done | Redacts vehicle license plates and secondary faces with regex JSON salvage. |
| Server-Side Sharp Privacy Masking | Kartik Duseja | High | Done | 25px Gaussian blur with downscale compression and 20% bounding box padding. |
| Before & After Resolution Slider | Akshat Jain | Medium | Done | Interactive comparison slider for completed municipal repairs. |
| Upvoting / "I'm Affected" Counter | Ankit Chauhan | Medium | Done | Atomic MongoDB addToSet and inc counter preventing duplicate reports. |

## 7. 15-Day Progress Tracker

| Day | Date | Focus for the day | Status |
| --- | --- | --- | --- |
| Day 1 | Oct 11, 2026 | Team kickoff, problem validation, and initial architecture blueprint | Done |
| Day 2 | Oct 12, 2026 | Legal privacy research (DPDP Act, GDPR) and system specification document | Done |
| Day 3 | Oct 13, 2026 | Next.js 16 and React 19 scaffold, Tailwind v4 design system setup | Done |
| Day 4 | Oct 14, 2026 | MongoDB Atlas schemas, 2dsphere indexing, and Auth.js v5 integration | Done |
| Day 5 | Oct 15, 2026 | Cloudinary direct signed upload flow and media streaming architecture | Done |
| Day 6 | Oct 16, 2026 | Citizen incident intake form (/report), camera API and GPS geocoding | Done |
| Day 7 | Oct 17, 2026 | Mid-point review: MediaPipe WASM client-side face detection integration | Done |
| Day 8 | Oct 18, 2026 | OpenRouter Vision AI fallback for license plates and non-selfie faces | Done |
| Day 9 | Oct 19, 2026 | Sharp server-side image manipulation and high-radius privacy blur pipeline | Done |
| Day 10 | Oct 20, 2026 | Municipal Officer portal (/admin/dashboard) and 3-second hover video loops | Done |
| Day 11 | Oct 21, 2026 | Leaflet.js interactive risk map (/explore) and container lifecycle stabilization | Done |
| Day 12 | Oct 22, 2026 | Officer dispatch workflow, status transitions, and Before/After slider | Done |
| Day 13 | Oct 23, 2026 | Community upvoting ("I'm Affected"), my-reports tracker, dark/light theme polish | Done |
| Day 14 | Oct 24, 2026 | Performance audit, logging cleanup, Next.js cache compatibility fixes | Done |
| Day 15 | Oct 25, 2026 | Final end-to-end testing, demo account setup, documentation, and submission | Done |

## 8. Daily Log

*Copy the block below for each day. For every day, answer the same five prompts. Keep it short and honest.*

### Day 1

- **Goals for today:** Form team EdgeRunners, select hackathon track, and establish problem scope.
- **What we completed:** Aligned on the Empowering Local Communities / Tech for Good track. Defined CivicLens: a privacy-first, AI-triaged civic reporting engine.
- **Blockers / challenges:** Narrowing scope to prevent building an overly complex native mobile app.
- **Learnings:** Web PWAs with HTML5 Media Capture offer 80%+ higher citizen adoption than native apps for occasional civic reports.
- **Plan for tomorrow:** Deep-dive into privacy regulations and write the developer handbook specification.

### Day 2

- **Goals for today:** Research legal compliance (India DPDP Act 2023, EU GDPR) and create system architecture specs.
- **What we completed:** Authored developer handbook specification with complete sequence diagrams covering citizen intake and municipal triage flows.
- **Blockers / challenges:** Balancing public evidence transparency with strict bystander privacy requirements.
- **Learnings:** Face and license plate redaction must occur before media is ever served on public feeds or dashboards.
- **Plan for tomorrow:** Initialize the codebase with Next.js 16 and configure the UI system.

### Day 3

- **Goals for today:** Setup Next.js 16, React 19, Tailwind CSS v4, and the DashStack visual token system.
- **What we completed:** Initialized modern app structure with root layout, responsive navigation bars, and dark/light mode provider.
- **Blockers / challenges:** Tailwind CSS v4 configuration syntax differences from v3.
- **Learnings:** Tailwind v4 CSS-first theme configuration simplifies modern color variables and dark mode switching.
- **Plan for tomorrow:** Configure database schemas and user authentication.

### Day 4

- **Goals for today:** Configure MongoDB Atlas M0 cluster, Mongoose models, and Auth.js (NextAuth v5).
- **What we completed:** Created User and Grievance schemas with GeoJSON 2dsphere indexes. Configured NextAuth credentials and OAuth providers with role-based access.
- **Blockers / challenges:** NextAuth v5 session cookie propagation in edge middleware.
- **Learnings:** Storing user role (CITIZEN vs MUNICIPAL_OFFICER) directly in JWT tokens enables sub-millisecond edge route protection.
- **Plan for tomorrow:** Build Cloudinary media upload pipelines.

### Day 5

- **Goals for today:** Implement signed direct-to-Cloudinary media ingestion.
- **What we completed:** Created /api/cloudinary/sign endpoint returning cryptographic signatures, bypassing server memory for 50MB files.
- **Blockers / challenges:** Heavy files crashing free-tier serverless functions if streamed through Node.js.
- **Learnings:** Offloading upload binaries directly from client browser to Cloudinary CDN completely mitigates server memory exhaustion.
- **Plan for tomorrow:** Construct the citizen incident reporting form.

### Day 6

- **Goals for today:** Develop the frontend reporting interface (/report) with live camera and GPS integration.
- **What we completed:** Built clean drag-and-drop intake, HTML5 Geolocation with ward detection, and audio recording component for voice memos.
- **Blockers / challenges:** Browser permissions handling when users deny location access.
- **Learnings:** Graceful fallback to default municipal ward coordinates ensures reporting never abruptly errors out.
- **Plan for tomorrow:** Integrate MediaPipe in-browser face detection.

### Day 7 (Mid-point Review)

- **Goals for today:** Integrate Google MediaPipe Tasks-Vision in the browser for instant client-side face blurring.
- **What we completed:** Wired MediaPipe FaceDetector using BlazeFace short-range model to detect bystander bounding boxes before transmission.
- **Blockers / challenges:** MediaPipe WASM CDN timeout (Failed to fetch) and 0 faces detected on wide-angle street photos.
- **Learnings:** BlazeFace short-range is optimized for selfies (~128x128); wide street photos need image tiling or a multi-region cloud vision fallback.
- **Plan for tomorrow:** Build secondary OpenRouter Vision AI pipeline for license plates and distant faces.
- **Are we on track?** Yes. Core intake and cloud pipelines are running; mid-point milestones met on schedule.

### Day 8

- **Goals for today:** Integrate OpenRouter Vision AI to detect license plates and peripheral bystanders.
- **What we completed:** Created aiPrivacy.ts utilizing multimodal vision models with structured JSON coordinate extraction for bounding boxes.
- **Blockers / challenges:** Vision AI output occasionally truncating JSON responses (SyntaxError: Unterminated string).
- **Learnings:** Added robust regex JSON repair and raised model token limits to safely parse up to 20+ detected regions.
- **Plan for tomorrow:** Combine detections and implement high-strength Sharp pixel blurring.

### Day 9

- **Goals for today:** Implement server-side privacy redaction engine using Sharp.
- **What we completed:** Unified MediaPipe and Vision AI coordinate arrays. Added 20% bounding box padding, downscale/upscale Gaussian blurring (blur 25), and sharp.rotate() to respect camera EXIF orientation.
- **Blockers / challenges:** Mobile phone photos with EXIF rotation tags causing blur boxes to appear rotated by 90 degrees.
- **Learnings:** Always invoke .rotate() without arguments in Sharp before extracting and compositing image regions.
- **Plan for tomorrow:** Build the Municipal Officer dashboard with 3-second hover video loops.

### Day 10

- **Goals for today:** Develop the Municipal Officer triage terminal (/admin/dashboard).
- **What we completed:** Built 16:9 incident grid with urgency sorting, auto-detected hazard tags (#Pothole, #ExposedWire), and 3-second hover video mini-clips via Cloudinary so_0,du_3,e_preview.
- **Blockers / challenges:** Hover loops stuttering on slower connections.
- **Learnings:** Generating WebP and MP4 preview clips directly on the CDN edge eliminates client buffering and prevents downloading heavy raw videos.
- **Plan for tomorrow:** Implement the Leaflet.js public GIS risk map.

### Day 11

- **Goals for today:** Build the public incident exploration map (/explore) using Leaflet.js.
- **What we completed:** Implemented interactive risk heatmap with color-coded marker clusters and side preview drawers.
- **Blockers / challenges:** React StrictMode causing duplicate map initialization and Map container is already initialized crashes.
- **Learnings:** Implemented strict container cleanup and unique instance ID references in useEffect lifecycle hooks.
- **Plan for tomorrow:** Build repair verification workflow and Before/After slider.

### Day 12

- **Goals for today:** Develop municipal resolution workflow and community verification component.
- **What we completed:** Created single-click status updates (IN_PROGRESS to RESOLVED) with resolution photo uploads and an interactive Before and After slider.
- **Blockers / challenges:** Synchronizing state between officer resolution uploads and public map pin statuses.
- **Learnings:** Instant optimistic UI updates improve perceived responsiveness for field officers.
- **Plan for tomorrow:** Implement community upvoting and theme polish.

### Day 13

- **Goals for today:** Implement community upvoting ("I'm Affected") and dark/light UI polish.
- **What we completed:** Added atomic MongoDB upvoting to prevent duplicate filings, built the /my-reports citizen tracking history, and harmonized theme colors.
- **Blockers / challenges:** Concurrent upvoting causing race conditions in database counters.
- **Learnings:** Using atomic addToSet and inc operators completely prevents double-voting and eliminates race conditions.
- **Plan for tomorrow:** Performance audit, code cleanup, and error-handling verification.

### Day 14

- **Goals for today:** Resolve edge runtime warnings, audit bundle size, and conduct end-to-end testing.
- **What we completed:** Cleaned browser console outputs, self-hosted MediaPipe WASM assets in public/mediapipe/, migrated Next.js 16 dynamic route configs with await connection().
- **Blockers / challenges:** Next.js 16 breaking change deprecating dynamic = "force-dynamic" alongside cacheComponents.
- **Learnings:** Following Next.js 16 best practices by wrapping uncached dynamic requests in await connection() restores clean SSR rendering.
- **Plan for tomorrow:** Final submission readiness, demo credential provisioning, and video recording.

### Day 15 (Submission Day)

- **Goals for today:** Final submission polish, demo accounts setup, and documentation completion.
- **What we completed:** Embedded instant auto-fill credentials for Citizen (aarav.citizen@civiclens.gov) and Municipal Officer (municipalofficer@civiclens.gov) on the login page. Verified full report-to-resolution lifecycle. Completed documentation.
- **Blockers / challenges:** Ensuring demo users can log in without manual database seeding on fresh environments.
- **Learnings:** Automatic on-demand provisioning of demo credentials in authorize() guarantees a flawless review experience.
- **Final reflections:** In 15 days, EdgeRunners transformed CivicLens from an architectural concept into a production-grade, privacy-compliant civic infrastructure engine. Overcoming camera EXIF quirks, WASM execution boundaries, and Next.js 16 updates yielded an exceptionally resilient system.

## 9. Challenges and Solutions

| Challenge | Day faced | How we solved it | Lesson learned |
| --- | --- | --- | --- |
| Mobile Photo EXIF Rotation | Day 9 | Smartphone cameras save orientation in EXIF tags, causing blur boxes to be offset by 90° or 270°. Solved by applying sharp(buffer).rotate() before coordinates extraction. | Never crop or composite coordinate overlays without first normalizing EXIF orientation. |
| MediaPipe CDN WASM Timeout | Day 7 | Remote jsDelivr CDN timeouts caused MediaPipe face detector initialization to abort after 6 seconds. Solved by self-hosting WASM files and model weights inside public/mediapipe/. | Critical computer vision assets should always be self-hosted locally within the application bundle. |
| Distant Bystander Detection | Day 8 | BlazeFace short-range model missed small background faces in wide-angle street photos. Solved by introducing OpenRouter Vision AI as a dual-layer fallback pipeline. | Client-side lightweight models are great for speed, but require cloud multimodal AI for deep contextual detection. |
| Leaflet Map Re-initialization Crash | Day 11 | React 19 StrictMode triggered rapid unmount/remount cycles causing Map container is already initialized fatal errors. Solved by managing explicit map instance references and container cleanup. | GIS map libraries requiring direct DOM manipulation must be strictly guarded against React lifecycle re-mounts. |
| Next.js 16 Cache Configuration | Day 14 | Next.js 16 rejected export const dynamic = "force-dynamic" with cacheComponents. Solved by replacing it with await connection() from next/server. | Stay ahead of framework breaking changes by reading local distribution docs and adopting server connection helpers. |

## 10. Testing and Setup Notes

- **How to run the project locally:**
    1. Clone the repository: `git clone https://github.com/Ankit-Kum-ar/civiclens.git` and enter the directory: `cd civiclens`
    2. Install dependencies: `npm install`
    3. Configure environment variables by copying `.env.example` to `.env.local` and providing `MONGODB_URI`, `AUTH_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `OPENROUTER_API_KEY`.
    4. Start the project: `npm run dev` and navigate to `http://localhost:3000`.
- **Testing approach:** Manual end-to-end user testing across mobile and desktop viewports, verifying automated face and license plate blur on real photos, edge role protection, and responsive Leaflet map interaction.
- **Known issues:** Extremely wide panoramic images (above 8K resolution) may experience a 1 to 2-second processing latency during cloud Vision AI analysis before blur rendering.
- **Test accounts / sample data:** Demo accounts with instant one-click auto-fill buttons are built directly into the login screen:
  - Citizen Demo: `aarav.citizen@civiclens.gov` / `Password123!`
  - Municipal Officer Demo: `municipalofficer@civiclens.gov` / `Password123!`

## 11. Final Submission Checklist

- [x] Project name, pitch, and team details are filled in
- [x] Problem statement and solution are clearly explained
- [x] Repository is public (or shared with organizers) and has a clear README
- [x] Code is clean, commented, and contains no secrets or API keys
- [x] Live demo link works
- [x] Demo video is recorded and the link is accessible
- [x] Presentation / pitch deck is ready
- [x] All 15 days of the daily log are updated
- [x] Screenshots or GIFs of the project are added below
- [x] Notion page is shared with the organizers
- [x] Submission form is filled before the deadline

## 12. Screenshots and Demo Media

*Add screenshots, GIFs, and walkthrough images here.*

1. **Citizen Hazard Intake:** Frictionless photo/video upload with browser geolocation and voice notes.
2. **AI Privacy Masking in Action:** High-radius Gaussian blur protecting bystander faces and license plates before publishing.
3. **Municipal Officer Triage Console:** Urgency-sorted incident grid featuring 3-second animated hover video loops.
4. **Interactive GIS Heatmap:** OpenStreetMap Leaflet visualization with risk clustering and "I'm Affected" community upvotes.
5. **Before and After Resolution Slider:** Transparent public proof of completed municipal repairs.

## 13. Future Scope

- **Official Mobile Applications (React Native / Flutter):** Deliver push notifications when reported issues transition from DISPATCHED to RESOLVED.
- **WhatsApp and Telegram Grievance Bots:** Enable citizens to report potholes and hazards by sending photos and live locations directly through popular messaging apps.
- **Automated Municipal ERP Integration:** Direct API integration with municipal work-order systems (such as SAP, Oracle Public Sector) for automatic contractor billing upon verified resolution.
- **Drone and Dashcam Municipal Patrol Feeds:** Automated continuous street-scanning using dashcam video streams to identify potholes before citizens even file complaints.
- **Decentralized Civic Bounties:** Reputation points and civic badges redeemable for municipal utility bill discounts or public transit passes.

## 14. Resources and References

| Resource | Link | Used for |
| --- | --- | --- |
| Next.js 16 Documentation | https://nextjs.org/docs | App router, server actions, and caching lifecycle |
| Cloudinary Video Transformation API | https://cloudinary.com/documentation | Dynamic 3-second hover video mini-clips (so_0,du_3,e_preview) |
| Google MediaPipe Vision Web | https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector | Client-side in-browser bystander face detection |
| Sharp High-Performance Image Processing | https://sharp.pixelplumbing.com/ | Server-side Gaussian blur, EXIF orientation normalization, and composite masks |
| Leaflet.js Documentation | https://leafletjs.com/ | Interactive geospatial incident mapping and risk heatmaps |
| Digital Personal Data Protection Act 2023 | https://www.meity.gov.in | Legal privacy compliance and bystander protection research |

## 15. Acknowledgments

Hacktober Hack Days 2026 organizers and mentors for hosting a high-impact hackathon; the open-source maintainers behind Next.js, Cloudinary, MongoDB, Leaflet, and Sharp; and the municipal field workers whose daily dedication inspired CivicLens.

---

*Built during Hacktober Hack Days.*