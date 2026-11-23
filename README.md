# 🛡️ VayuShield — Hyperlocal Air Quality & Household Smog Shield

> **AI-Powered Family Protection Assistant for Severe Smog & Temperature Inversion Episodes**

[![CI](https://github.com/saravana007-007/vayushield-air-quality-assistant/actions/workflows/ci.yml/badge.svg)](https://github.com/saravana007-007/vayushield-air-quality-assistant/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint_Zero_Warnings-success.svg)](https://oxc.rs/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Problem Statement
During severe winter inversion events across South Asian cities (Delhi NCR, Lahore, Kolkata, Dhaka), ambient AQI surges beyond **300–500+ (Hazardous)**, trapping fine particulate matter ($\text{PM}_{2.5}$) close to the ground. 

Most public air-quality dashboards only present numbers and generic advice ("stay indoors"), failing to offer actionable household containment strategies. Families with infants, asthmatic elders, and daily commuters are left exposed without practical, low-cost mitigations.

**VayuShield** bridges this gap:
1. Translates complex open meteorological data into **1 Critical Action**, a **4-stage daily routine**, and **zero-cost indoor containment hacks**.
2. Tailors protective actions dynamically to household vulnerabilities (toddlers, elderly, asthma, stove type, commute mode).
3. Provides offline resilience: 100% operational with verified local safety plans even when offline or without API keys.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    User["User / Household Profile"] --> UI["React 19 Interface"]
    
    subgraph Data Layer
        UI --> OM["Open-Meteo API\n(No key, Hourly PM2.5 & AQI)"]
        UI --> Presets["1-Click Bundled Presets\n(Delhi, Lahore, Moderate)"]
    end
    
    subgraph Engine & Protection
        OM --> Calc["AQI & Physics Calculator\n(WHO Multiplier, Best Window, Shield Score)"]
        Presets --> Calc
        Calc --> Plan["Action Plan Generator"]
    end

    subgraph Intelligence
        Plan -->|Online with Key| Gemini["Google Gemini Live AI\n(Strict JSON Schema)"]
        Plan -->|Offline / Fallback| Demo["Verified Bundled Safety Plans\n(Physician Aligned)"]
    end

    subgraph Outputs & Exports
        Gemini --> PlanView["4-Stage Routine & Low-Cost Hacks"]
        Demo --> PlanView
        PlanView --> PDF["Client-Side PDF Card (Dynamic jsPDF)"]
        PlanView --> AskVayu["Ask Vayu Voice/Text Assistant"]
```

---

## 🚀 Key Features

- **Hyperlocal Air Quality & Best-Window Algorithm**: Computes the optimal window for outdoor errands and aeration before evening temperature inversion settles.
- **Household-Specific Personalization**: Custom guidance for infants, asthmatic members, gas vs. induction stoves, and bike vs. metro commuting.
- **Household Shield Score**: Mathematical estimation of indoor isolation and particulate reduction based on building physics and adopted habits.
- **Multilingual Support (7 Languages)**: Complete localized UI and guidance for English, हिन्दी (Hindi), اردو (Urdu, RTL), বাংলা (Bengali), தமிழ் (Tamil), తెలుగు (Telugu), and मराठी (Marathi).
- **Ask Vayu Instant Consultation**: Voice-enabled or text-based assistant providing concise 3-sentence answers strictly focused on air safety.
- **Offline & Low-Bandwidth Resilient**: Automatically caches recent plans in `localStorage` and falls back to bundled verified protocols.
- **Zero-Dependency PDF Export**: Code-split, client-side PDF generation for printing or sharing family cards over WhatsApp.

---

## 🛠️ Tech Stack & Code Quality Standards

| Layer | Technologies & Tools |
|---|---|
| **Core Framework** | React 19, TypeScript 5.8 (Strict mode with `noUncheckedIndexedAccess`) |
| **Build Tool** | Vite 8 + Rolldown runtime (Code-split vendor chunks) |
| **Type Checking** | Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`) |
| **Linting** | Oxlint with `correctness`, `suspicious`, `perf`, `eqeqeq`, `no-explicit-any` |
| **Testing** | Vitest 5, `@testing-library/react`, `@testing-library/user-event`, jsdom, v8 coverage |
| **Styling** | Tailwind CSS 3.4, Lucide React icons |
| **AI Integration** | Google GenAI SDK (`@google/genai`) with strict `Schema` validation |

---

## 📂 Project Structure

```
src/
├── components/          # Accessible UI components (landmarks, dialogs, ARIA tabs)
│   ├── plan/            # Tabbed views (TodayPlanTab, HacksSwapsTab)
│   └── __tests__/       # Component & view unit tests
├── config.ts            # Centralized constants, thresholds, and storage keys
├── data/                # Swap catalog and split regional demo plans
├── hooks/               # Extracted custom hooks (useAirQuality, useActionPlan, etc.)
├── i18n/                # Multilingual translations (7 regional language modules)
├── services/            # Air quality API, Gemini SDK, schemas, and pdfService
├── types/               # Strict TypeScript domain interfaces
└── utils/               # Math calculators, errors, storage wrappers, and logger
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
git clone https://github.com/saravana007-007/vayushield-air-quality-assistant.git
cd vayushield-air-quality-assistant
npm install
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, VayuShield runs in 100% offline Demo Mode with verified safety plans.)*

### Development Server
```bash
npm run dev
```

### Verification & Testing
```bash
# Type check with strict TypeScript
npm run typecheck

# Lint with Oxlint (0 warnings)
npm run lint

# Run all unit and integration tests
npm test

# Run tests with V8 coverage report
npm run test:coverage

# Build optimized production bundle
npm run build
```

---

## 🔒 Security & Privacy

- **Strict CSP Enforced**: Configured in `vercel.json` with restricted `connect-src` to Open-Meteo and Google Generative Language APIs.
- **Input Sanitization**: Length limits and input validation for all user queries and custom condition text.
- **Zero Tracker / Cookie Policy**: All personal household profile preferences reside solely in client-side `localStorage`.
- Full details available in [SECURITY.md](SECURITY.md).

---

## ⚕️ Health & Educational Disclaimer
*VayuShield provides educational ambient air guidance and algorithmic exposure mitigation estimates based on published building physics research and WHO air quality guidelines. It does not provide medical diagnoses, prescriptions, or clinical treatments. For acute symptoms, respiratory distress, or severe chest discomfort, immediately consult a licensed physician or emergency medical care.*

---

## 📄 License
MIT © 2026 VayuShield Contributors
