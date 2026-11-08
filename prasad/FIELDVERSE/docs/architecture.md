# FIELDVERSE – System Architecture Specification

## 1. Executive Summary

**FIELDVERSE – The Ultimate Sports Event Universe** is a unified sports event management ecosystem designed around three distinct, independent frontend applications powered by a single shared PostgreSQL backend through Supabase:

1. **Player Website (`FIELDVERSE/player/`)** – Clean, welcoming, athletic discovery portal for sports participants.
2. **Organizer Website (`FIELDVERSE/organizer/`)** – Dark, tactical tournament management command center.
3. **Admin Website (`FIELDVERSE/admin/`)** – Sophisticated executive governance control panel.

---

## 2. Structural Principles

### Absolute Frontend Decoupling
- Each application has its own entry point (`index.html`), stylesheet (`css/`), scripts (`js/`), and deployment configuration (`vercel.json`).
- There are **no cross-frontend file dependencies**.
- Portals are independently buildable, testable, and deployable to Vercel as three isolated projects.

### Shared Relational Backend
- All three portals communicate with the **same Supabase project**.
- Security is strictly enforced via PostgreSQL Row Level Security (RLS) policies and Auth triggers.
- Multi-client synchronization allows real-time operational workflows:
  1. An Organizer creates and submits a tournament.
  2. The Admin reviews, approves, or rejects the tournament.
  3. The approved tournament instantly becomes discoverable on the Player Portal.
  4. Players register their squads with captains and member rosters.
  5. The Organizer reviews registrations, approves teams, and generates tournament brackets with the rules-based **Smart Fixture Engine**.
  6. The Organizer inputs match scores via the **Live Score Console**.
  7. The Player Portal receives telemetry updates in real-time, updating match scores and tournament leaderboards without requiring page reloads.

---

## 3. Technology Stack Breakdown

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Runtime** | Pure HTML5, CSS3, Vanilla JavaScript (ES Modules) | Zero framework bloat, maximum performance, clean standards. |
| **Build & Dev Tool** | Vite (Optional) | Fast ES module serving and production bundling. |
| **Backend & DB** | Supabase (PostgreSQL 15) | Relational integrity, built-in Auth, Realtime engine, and Storage. |
| **Security Layer** | PostgreSQL RLS + Role Checks | Database-level access control preventing role escalation. |
| **Deployments** | 3 x Independent Vercel Projects | Dedicated roots: `admin`, `organizer`, `player`. |
