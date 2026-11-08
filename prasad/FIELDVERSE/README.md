# FIELDVERSE
### The Ultimate Sports Event Universe

FIELDVERSE is a modern, responsive, sports event management platform engineered as **three independent frontend applications** connected to a unified **Supabase PostgreSQL** backend.

---

## 🏛️ System Architecture

```text
FIELDVERSE/
│
├── admin/                 ──► Executive Sports Governance Control Panel
│   ├── index.html
│   ├── css/admin.css
│   ├── js/adminApp.js
│   ├── js/dataStore.js
│   ├── js/supabaseClient.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── organizer/             ──► Tournament Operations Command Centre
│   ├── index.html
│   ├── css/organizer.css
│   ├── js/organizerApp.js
│   ├── js/fixtureEngine.js (Smart Fixture Engine)
│   ├── js/dataStore.js
│   ├── js/supabaseClient.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── player/                ──► Athlete & Team Discovery Portal
│   ├── index.html
│   ├── css/player.css
│   ├── js/playerApp.js
│   ├── js/dataStore.js
│   ├── js/supabaseClient.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── database/              ──► Master PostgreSQL Schema & Security
│   ├── schema.sql         ──► Relational schema (15 tables, enums, triggers)
│   ├── rls_policies.sql   ──► Row Level Security policies
│   └── seed.sql           ──► Demo and initial sports/venues seed data
│
├── docs/                  ──► Architecture, Database, Security & Deployment Guides
│   ├── architecture.md
│   ├── database.md
│   ├── setup.md
│   ├── security.md
│   └── deployment.md
│
└── README.md
```

---

## ⚡ Core Features

### 1. Player Portal (`player/`)
- **Tournament Discovery:** Filter by Cricket, Football, Knockout, League, and Entry Fee.
- **Event Details:** View venue specs, tournament rules, prize pools, and confirmed squads.
- **Squad Registration:** Register teams with captains, phone contact, and full player rosters.
- **My Arena:** Personal athlete hub showing registered tournaments, status badges, and upcoming match dates.
- **Live Match Centre:** In-play cricket overs, runs, wickets, and football scores updating in real time.
- **Tournament Leaderboard:** Standings table with points, wins, losses, and match performance.

### 2. Organizer Portal (`organizer/`)
- **Tournament Command:** Host new tournaments with custom formats, team limits, and rules.
- **Registration Management:** Review team applications, verify rosters, and approve squads.
- **Smart Fixture Engine:** Rules-based deterministic generator for Knockout (with odd-team byes) and Round-Robin League schedules with ground conflict detection.
- **Live Score Console:** Update match scores ball-by-ball or goal-by-goal; automatically dispatches telemetry to player views.
- **Venue & Announcements:** Manage grounds and broadcast alerts to participating teams.

### 3. Admin Portal (`admin/`)
- **Executive Governance:** Real-time platform KPI statistics from the database.
- **Organizer Verification:** Review organization applications and grant organizer status.
- **Event Approval Gate:** Review submitted tournaments; only approved events are published.
- **Player Oversight:** Inspect player accounts, team associations, and security flags.
- **Sports & Rules Config:** Add sports, set squad minimums/maximums, and define sport rules.
- **Audit Logs:** Immutable audit trail of administrative approvals, rejections, and edits.

---

## 🚀 Quick Run (No Setup Needed)

All three applications can be opened immediately in any browser:
- **Player Portal:** Open `player/index.html`
- **Organizer Portal:** Open `organizer/index.html`
- **Admin Portal:** Open `admin/index.html`

For full details on local Vite servers, database migrations, and Vercel deployment, check the [docs/](docs/) directory.
