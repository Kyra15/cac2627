# Project Plan: LabDog (CAC Lab Helper)

**Repo:** https://github.com/Kyra15/cac2627
**Schedule:** Tue Sept 29 to Thu Oct 15, 2026 (17 days). Dates for every task are in `tasks.csv`.
**Stack (from the repo):** Expo / React Native app (SDK 54, iOS and Android) in `test-app/`; Flask backend (`server.py`) using Cohere for vision OCR; OpenCV for image cleanup. To add: Supabase (auth, database, file storage) and deployment on Render.

## 1. Vision

Patients scan or import lab documents, get plain-language insight into what the results mean, and keep every lab in a library. A separate AI assistant helps them decide what to do next: which kind of doctor to see, which providers are nearby, and safe steps to take before an appointment.

## 2. Where the repo is today

**Built:** Expo app with Home (report grid, mock data) and Scan screens; document scanner, camera, and photo picker; Flask `/analyze` that OCRs an image through Cohere's vision model and supports HEIC; an OpenCV upscale helper; a stubbed auth context.

**Missing (README todo list: ui, key insights, plan, full report view, login):**
- Real login and saved data (auth is in-memory; the library shows mock reports)
- Interpretation: `PROMPT` in `server.py` is empty, so the app only returns transcribed text
- Full report view (the `Insights` route exists in the navigation types but has no screen)
- The assistant chatbot and doctor finder
- Deployment: the app calls a hardcoded LAN address

## 3. Things I noticed that shape the plan

1. `/analyze` can return nothing (a Flask error) if JPEG encoding fails, and `post_process` is imported but never used. Fixed in 1.2.
2. `requirements.txt` includes `easyocr` (pulls in PyTorch) though the server doesn't use it. That will likely exceed Render free-tier memory, so it's removed in 1.2, along with `opencv-python` becoming `opencv-python-headless`.
3. The whole image, including name and birthdate, goes to Cohere's vision model. Redaction (2.3) covers text sent to later steps; the image itself is still sent for OCR. Say so in the consent screen (4.1) or blur the header area as a stretch.
4. `AGENTS.md` links to Expo v57 docs but `package.json` is on SDK 54. Fixed in 1.1.
5. The document scanner is a native module, so the app can't run in Expo Go; the demo needs a dev build (4.5, which already has `expo-dev-client`).
6. The scanner allows 20 pages but only page one is used. Fixed in 2.1.

## 4. Features and guiding principles

**Features:** scan/import, lab insights, lab library, separate AI assistant, nearby doctor finder.

- **Not a diagnosis.** Explain and guide; never diagnose.
- **Emergencies first.** A rule-based red-flag check runs before the AI and shows a call-911 banner.
- **Privacy.** Redact identifiers from text, row-level security, private storage, delete and export.
- **Don't guess.** Unclear value, unit, or range is marked unknown.
- **Opt-in sharing.** Labs go to the assistant only if the user attaches them.

## 5. Architecture

| Layer | Choice | Purpose |
|---|---|---|
| App | Expo React Native, react-native-document-scanner-plugin, expo-image-picker, expo-location | Scan, import, UI, location |
| Auth / DB / files | Supabase | Accounts, tables with RLS, private storage |
| Backend | Flask on Render (gunicorn) | `/analyze`, `/chat`, `/providers`; holds the Cohere key |
| AI | Cohere (already integrated) | Vision OCR, structured extraction, interpretation, chat |
| Providers | NPI Registry (free public API) | Doctors by specialty and zip; a registry, not live availability or insurance |

## 6. Timeline

| Phase | Dates | Goal | Tasks |
|---|---|---|---|
| 1. Foundation | Sep 29 - Oct 4 | Cleanup, hardened backend, Supabase, Render, real login | 1.1 - 1.7 |
| 2. Scan to library | Oct 3 - Oct 9 | Multi-page scan, redaction, structured insights, save, library, report view | 2.1 - 2.8 |
| 3. Assistant | Oct 9 - Oct 13 | Chat, red flags, guidance, doctor-type advice, provider finder | 3.1 - 3.7 |
| 4. Polish & submit | Oct 13 - Oct 15 | Consent, security, testing, demo build, video, submission | 4.1 - 4.7 |

The window is 17 days, shorter than a full month, so the plan is tight. Phases 1 and 2 are the critical path: everything after depends on the deployed backend, login, and saved reports.

## 7. Milestones

| Milestone | Target | Definition |
|---|---|---|
| M1: Backend live | Oct 2 | Render URL works; app no longer uses a LAN IP |
| M2: Login | Oct 4 | Sign up, sign in, session persists |
| M3: Scan to results | Oct 7 | A scan returns structured insights and is saved |
| M4: Library and report view | Oct 9 | Saved labs open with results |
| M5: Assistant and finder | Oct 13 | Chat with red-flag banner, specialty advice, nearby providers |
| M6: Demo ready | Oct 14 | Tested build on a phone, video recorded |
| M7: Submit | Oct 15 | Submission confirmed |

## 8. Cut order if time runs short

Cut in this order: 2.8 (PDF import), 3.5 (attach report to chat), 4.3 (delete data and account, keep report delete), 3.7 (polished provider UI; keep a plain list), 2.2 (extra image checks; keep error handling). Never cut 4.1, 4.2, or 3.2.

## 9. Responsibilities

The team builds the app. AI is used only for structuring work and debugging, so `tasks.csv` has no assignee column. Phase 0 rows are already built and have no dates.

## 10. Risks

| Risk | Mitigation |
|---|---|
| AI misreads or invents lab values | Structured JSON, show original image beside results, test task 4.4, "unknown" instead of guessing |
| Users treat output as medical advice | Consent screen, no diagnosis wording, red-flag banner |
| Health data privacy | Text redaction, RLS, private storage, no lab text in logs, image disclosure |
| Render free-tier memory and cold starts | Remove easyocr, headless OpenCV, loading state for first request |
| Native scanner not in Expo Go | Start the dev build early (4.5 can begin before Oct 13 if convenient) |
| Schedule | Cut order above; Oct 15 is buffer only |

## 11. Definition of done

Runs on a real phone, meets the `done_when` column in `tasks.csv`, and is committed.

## 12. Assumptions to confirm

- This is for the Congressional App Challenge (repo name and README suggest it). If so, check the official deadline time and required materials (usually a demo video and description) and I'll adjust 4.6 and 4.7.
- Keep Cohere as the AI provider since it's already wired in.
- Testing uses synthetic or public sample labs, not real patient records.
