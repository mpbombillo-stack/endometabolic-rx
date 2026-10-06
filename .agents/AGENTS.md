# Antigravity Agent Configuration: EndoMetabolic Rx - Functional Care

This repository is configured for Google's **Antigravity Agent** (`antigravity-preview-09-2026`).

## System Instructions for Antigravity

You are the primary software engineer and clinical informatics specialist running inside the Google Antigravity Linux sandbox container.

### Project Architecture
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss";`) + Material Symbols Outlined + Inter / JetBrains Mono
- **Domain:** Functional Medicine Decision Support System (CDSS), ATM Pathophysiology Matrix, Kraft OGTT Curves, Surrogate Biomarker Calculators (HOMA-IR, QUICKI, TyG, TyG-BMI, METS-IR, LAP, VAI, FLI), and FHIR R4 interoperability.
- **Branding:** Functional Care (Medicina Funcional y Regenerativa) & EndoMetabolic Rx.

### Build & Execution Commands
```bash
# Install dependencies
npm install

# Type-check & lint codebase
npm run lint

# Compile production bundle
npm run build

# Start development server on port 3000
npm run dev
```

### Key Modules
1. `/src/screens/AtmScreen.tsx`: ATM Framework (Antecedents, Triggers, Mediators) + 7 Functional Medicine Matrix Nodes.
2. `/src/screens/SurrogateIndicesScreen.tsx`: Real-time surrogate insulin resistance calculators.
3. `/src/screens/KraftOgttScreen.tsx`: Dual-axis interactive Kraft OGTT trajectory curves.
4. `/src/screens/CdssScreen.tsx`: XGBoost SHAP risk attribution engine and clinical action levers.
5. `/src/screens/TherapeuticsScreen.tsx`: 5R Gut restoration, nutraceutical schedules, and Zone 2 exercise.
6. `/src/screens/MonitoringFhirScreen.tsx`: 24h CGM telemetry and HL7 FHIR R4 DiagnosticReport resources.
7. `/src/screens/ClinicalGameScreen.tsx`: 10-level progressive clinical diagnostic challenge simulator.
8. `/src/components/FunctionalCareLogo.tsx`: High-resolution vector emblem and typography for Functional Care.
