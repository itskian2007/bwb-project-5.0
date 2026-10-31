# 🏗️ DeshDarshan AI System Architecture

This document provides a comprehensive technical blueprint of the **DeshDarshan AI (देशदर्शन)** system architecture, data models, multi-agent mesh, and protocol integrations.

---

## 🏛️ High-Level System Architecture

```mermaid
flowchart TD
    subgraph DataIngestion ["1. Telemetry & Sensor Layer"]
        FT["FASTag Toll Plaza Feeds"]
        HBP["Hotel Booking Velocity (PMS)"]
        GIS["Municipal GIS & Parking Sensors"]
        WMS["Water & Waste Municipal Telemetry"]
    end

    subgraph MultiAgentMesh ["2. 5-Agent Multi-AI Autonomous Mesh"]
        A1["Agent 1: Crowd Forecaster\n(ARIMA / LSTM Surrogate)"]
        A2["Agent 2: Scenic Recommender\n(Semantic Vector Matcher)"]
        A3["Agent 3: Infra Stress Auditor\n(Capacity & Bottlenecks)"]
        A4["Agent 4: Commerce Agent\n(ONDC Beckn Gateway)"]
        A5["Agent 5: Eco Preserver\n(Carbon & Waste Audit)"]
    end

    subgraph CoreEngine ["3. Decision & Digital Twin Engine"]
        DT["Digital Tourism Twin"]
        LB["Autonomous Load Balancer"]
        GK["DeshCredits Gamification"]
    end

    subgraph IntegrationProtocols ["4. Open Digital Public Infrastructure (DPI)"]
        ONDC["ONDC / Beckn Protocol (BAP-BPP Rails)"]
        UPI["Sovereign Green Karma Wallet"]
        VAI["Multilingual Speech-to-Listing Parser"]
    end

    subgraph Interfaces ["5. User & Governance Interfaces"]
        TUI["Tourist Experience Portal"]
        VUI["Rural Host Voice Portal"]
        MCC["Ministry of Tourism Command Center"]
    end

    DataIngestion --> MultiAgentMesh
    MultiAgentMesh --> CoreEngine
    CoreEngine --> IntegrationProtocols
    IntegrationProtocols --> Interfaces
```

---

## 🤖 5-Agent Multi-AI Autonomous Mesh

The core intelligence consists of 5 collaborative micro-agents running an autonomous evaluation cycle:

```mermaid
sequenceDiagram
    autonumber
    participant A1 as Agent 1: Crowd Forecaster
    participant A3 as Agent 3: Infra Stress Auditor
    participant A2 as Agent 2: Scenic Matcher
    participant A4 as Agent 4: ONDC Commerce
    participant A5 as Agent 5: Eco Preserver
    participant LB as Load Balancer Engine

    A1->>A3: Alert: Hotspot saturation > 85% projected in T+2h
    A3->>A2: Trigger alternative search (Water deficit > 3.0 MLD)
    A2->>A4: Query rural nodes within 30km with > 85% similarity
    A4->>A5: Verify homestay & artisan inventory on ONDC
    A5->>LB: Compute net CO2 savings & credit bonus (+500 DeshCredits)
    LB-->>A1: Rebalancing active: Dynamic permits throttled
```

### Detailed Agent Responsibilities

1. **Agent 1: Crowd Forecasting Agent**
   - **Input**: Real-time FASTag inbound vehicle velocity, hotel check-in API logs, historical peak seasonality.
   - **Function**: Projects crowd swells up to 3 hours in advance before physical gridlock manifests at destination entry gates.
   - **Output**: Predictive saturation index $S(t+3)$ and congestion alerts.

2. **Agent 2: Scenic Semantic Recommendation Agent**
   - **Input**: High-dimensional vector embeddings of altitude, weather, forest cover, heritage, culinary traditions, and adventure activities.
   - **Function**: Calculates cosine similarity between congested choke points and under-visited rural satellites within a 30 km radius.
   - **Target**: Guarantees $\ge 85\%$ subjective experience equivalence.

3. **Agent 3: Infrastructure Stress Agent**
   - **Input**: Municipal water reserve gauges, parking availability rates, sewage load factors, narrow-lane emergency clearance metrics.
   - **Function**: Computes the **Puchkov-Vorontsov Carrying Capacity Stress Ratio**:
     $$\text{Stress Index} = \frac{\text{Current Active Population} + \text{Inbound Influx}}{\text{Ecological Threshold Capacity}}$$
   - **Output**: Automatic safety thresholds for permit issuance.

4. **Agent 4: ONDC Commerce Agent**
   - **Input**: Beckn open protocol discovery queries (`search`, `select`, `init`, `confirm`).
   - **Function**: Queries rural homestays, verified GI handloom weavers, and organic farm experiences directly without middleman aggregators.
   - **Output**: Real-time booking payloads delivering **96% direct host revenue retention**.

5. **Agent 5: Sustainability & Ecological Preserver Agent**
   - **Input**: Idle vehicle transit hours, elevation climb energy, solid waste diversion models.
   - **Function**: Real-time calculation of avoided emissions:
     $$\text{CO}_2 \text{ avoided (kg)} = \Delta \text{Idling Hours} \times 2.4\,\text{kg/hr} + \Delta \text{Gridlock Delay} \times \text{Transit Factor}$$
   - **Output**: Sovereign **DeshCredits** allocation to incentivize tourist compliance.

---

## 🌐 ONDC (Beckn Protocol) Architecture

DeshDarshan AI implements the decentralized Beckn specifications for travel and hospitality:

```mermaid
sequenceDiagram
    autonumber
    actor Tourist as Traveler / App
    participant BAP as DeshDarshan BAP (Buyer App)
    participant BG as ONDC Open Gateway
    participant BPP as Rural Host BPP (Seller Provider)
    actor Host as Rural Homestay / Artisan

    Tourist->>BAP: Search Alternative Destinations (Narkanda, Kanatal)
    BAP->>BG: /search (intent: eco-homestay, location, dates)
    BG->>BPP: /search broadcast to registered local providers
    BPP-->>BG: /on_search (catalog with fair rates & 96% payout)
    BG-->>BAP: Aggregated catalog
    BAP-->>Tourist: Display verified local experiences
    Tourist->>BAP: Confirm Booking with DeshCredits
    BAP->>BPP: /init & /confirm
    BPP-->>BAP: Confirmed cryptographically signed token
    BAP-->>Host: Direct UPI settlement notification
```

---

## 💻 Tech Stack & Engineering Rationale

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Server-side rendering, instant page transitions, fast compilation, and standard production deployment support. |
| **Language** | **TypeScript 5.7** | Strict type safety across complex multi-agent states, circuit models, and ONDC transactional objects. |
| **Styling & Design System** | **Tailwind CSS 3.4** | Ultra-responsive, dark-mode native, low-footprint utility CSS tailored for high-density GIS and telemetry dashboards. |
| **Animations & Transitions** | **Framer Motion 11** | Smooth physics-based fluid transitions for real-time agent message pipelines and time-slider states. |
| **Cartography & Maps** | **Leaflet / Canvas GIS** | Lightweight interactive GIS mapping without heavy external API key restrictions for offline evaluator reviews. |
| **Icons & Symbols** | **Lucide React** | Clean, accessible vector icons for environmental, traffic, and municipal indicators. |
| **Voice Processing** | **Web Speech API & Custom NLP** | Low-latency client-side speech recognition enabling multilingual Hindi voice capture for rural elders. |
| **Containerization** | **Docker (Alpine Multi-Stage)** | Deterministic, secure, non-root multi-stage image under 150MB footprint. |
| **CI / CD** | **GitHub Actions** | Automated verification of TypeScript compilation, Next.js build integrity, and asset packaging on every commit. |

---

## 📁 Repository Directory Structure

```
bwb-project-5.0/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 # Automated CI build & typecheck pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Standard bug report template
│   │   └── feature_request.md     # Feature enhancement template
│   └── PULL_REQUEST_TEMPLATE.md   # Pull request review checklist
├── docs/
│   ├── ARCHITECTURE.md            # System architecture & agent diagrams (this file)
│   ├── EVALUATOR_GUIDE.md         # 10-minute guided demo for judges
│   └── BECKN_ONDC_SPECIFICATION.md# ONDC protocol integration schema
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind theme, glow effects, typography
│   │   ├── layout.tsx             # Root layout with metadata and fonts
│   │   └── page.tsx               # Primary single-page executive application
│   ├── components/
│   │   ├── CommandCenter.tsx      # Ministry of Tourism governance console
│   │   ├── DigitalTwin.tsx        # Real-time carrying capacity telemetry
│   │   ├── HeroSection.tsx        # Executive mission statement & quick stats
│   │   ├── LoadBalancer.tsx       # Core AI rebalancer & before/after matrix
│   │   ├── MultiAgentVisualizer.tsx# Live 5-Agent mesh execution pipeline
│   │   ├── Navbar.tsx             # Global navigation & live network status
│   │   ├── ONDCMarketplace.tsx    # Beckn protocol decentralized booking
│   │   ├── RuralDiscovery.tsx     # 30km radius direct rural listings
│   │   ├── SustainabilityDashboard.tsx # CO2, waste, and rural wealth metrics
│   │   ├── TourismCredits.tsx     # DeshCredits gamification & wallet simulator
│   │   ├── TourismHeatmap.tsx     # GIS map with predictive time slider (T+0 to T+3)
│   │   └── VoiceHostOnboarding.tsx# Multilingual Hindi speech-to-catalog parser
│   ├── data/
│   │   └── mockData.ts            # Circuits, telemetry, ONDC nodes, agent logs
│   ├── lib/
│   │   └── utils.ts               # Class merging & format utilities
│   └── types/
│       └── index.ts               # TypeScript types for circuits, agents & ONDC
├── .dockerignore                  # Build context exclusions
├── .env.example                   # Environment variable template
├── .gitignore                     # Git tracking exclusions
├── Dockerfile                     # Multi-stage production container
├── LICENSE                        # MIT License
├── README.md                      # Primary project presentation & evaluator hub
├── package.json                   # Dependency declarations & scripts
├── render.yaml                    # Cloud deployment specification
├── tailwind.config.js             # Styling configuration
├── tsconfig.json                  # TypeScript compiler settings
└── vercel.json                    # Edge serverless deployment rules
```
