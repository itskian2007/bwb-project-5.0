# Contributing to DeshDarshan AI (देशदर्शन)

Thank you for your interest in contributing to **DeshDarshan AI**! We welcome community contributions, bug fixes, algorithmic enhancements, and documentation improvements.

---

## 🧭 Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions within this project.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher (Recommended: `v20.x`)
- **npm**: `v9.x` or higher
- **Git**

### 2. Fork and Clone
```bash
git clone https://github.com/itskian2007/bwb-project-5.0.git
cd bwb-project-5.0
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### 5. Build & Typecheck Verification
Before submitting any changes, verify that the project builds cleanly without TypeScript or Next.js compilation errors:
```bash
npm run build
```

---

## 🌳 Branching Strategy & Git Workflow
- `main`: Production-ready, stable codebase.
- Feature branches: `feat/<feature-name>` (e.g., `feat/agent-reinforcement-learning`)
- Bugfix branches: `fix/<bug-name>` (e.g., `fix/leaflet-marker-rendering`)
- Documentation: `docs/<doc-name>` (e.g., `docs/evaluator-walkthrough`)

### Commit Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:
- `feat:` A new feature or module
- `fix:` A bug fix
- `docs:` Documentation changes only
- `style:` Formatting or UI styling changes that do not affect logic
- `refactor:` Code improvements without changing functionality
- `test:` Adding or updating tests
- `chore:` Build scripts, package manager changes, configs

---

## 📂 Project Architecture Overview
```
bwb-project-5.0/
├── docs/                 # Evaluator guide, architecture diagrams, protocol specs
├── src/
│   ├── app/              # Next.js App Router (layout, page, global styling)
│   ├── components/       # Domain-specific UI modules (Load Balancer, Agents, ONDC, GIS)
│   ├── data/             # Circuit models, telemetry feeds, carrying capacity thresholds
│   ├── lib/              # Utility helpers and class mergers
│   └── types/            # TypeScript interfaces & domain schemas
├── .github/              # CI workflows, issue and PR templates
└── public/               # Static assets and icons
```

---

## 🧪 Testing & Quality Assurance
- Ensure zero linting or TypeScript errors:
  ```bash
  npm run build
  ```
- Test all major interactive circuits on the home view (Shimla, Manali, Mussoorie, Ooty, Goa, Bundi).
- Verify dark/light contrast ratios and responsive viewports.

---

## 🚀 Submitting a Pull Request
1. Push your branch to your fork.
2. Open a Pull Request targeting `main`.
3. Fill out the [PR Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Ensure the CI verification check passes.
