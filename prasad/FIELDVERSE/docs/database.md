# FIELDVERSE – Database Architecture & Schema Specification

## 1. Relational Entities Overview

The database uses PostgreSQL with relational foreign keys, unique constraints, and check constraints to guarantee tournament integrity.

### Tables & Relationships

```
profiles (Users, Organizers, Admins)
   │
   ├─► events (organizer_id references profiles)
   │     │
   │     ├─► event_registrations (team_id references teams)
   │     │
   │     └─► matches (venue_id references venues)
   │           │
   │           ├─► match_results
   │           ├─► cricket_innings (live score telemetry)
   │           └─► football_match_events (goals, cards)
   │
   ├─► teams (captain_id references profiles)
   │     └─► team_members
   │
   ├─► venues (created_by references profiles)
   ├─► announcements (created_by references profiles)
   ├─► notifications (user_id references profiles)
   └─► audit_logs (user_id references profiles)
```

## 2. Table Definitions

1. **`profiles`**: Extends `auth.users`. Contains `role` (`player`, `organizer`, `admin`), `organizer_status` (`pending`, `approved`, `rejected`, `suspended`), name, phone, organization details, and avatar.
2. **`sports`**: Catalog of supported disciplines (`Cricket`, `Football`), minimum/maximum team sizes, and JSON rules.
3. **`venues`**: Verified grounds, pitch details, seating capacity, surface types (`Natural Turf`, `Artificial Turf`, `Hybrid`), and lighting amenities.
4. **`events`**: Sporting tournaments. Stores start/end dates, registration deadlines, format (`knockout`, `league`), entry fees, prize pools, and status (`draft`, `pending_approval`, `approved`, `rejected`, `completed`).
5. **`teams`**: Participating squads created by player captains.
6. **`team_members`**: Individual squad rosters with jersey numbers, roles, and captain indicators.
7. **`event_registrations`**: Connects teams to tournaments. Enforces `UNIQUE(event_id, team_id)` to prevent duplicate team entries.
8. **`matches`**: Scheduled tournament fixtures with rounds, dates, allocated grounds, and winners.
9. **`cricket_innings`**: Live cricket telemetry including runs, wickets, overs, current striker, bowler, and over-by-over ball sequences.
10. **`football_match_events`**: Match timeline events including goals, cards, and substitutions.
11. **`announcements`**: Tournament broadcasts from organizers and admins.
12. **`notifications`**: User-specific operational alerts.
13. **`audit_logs`**: Immutable security log of administrative decisions.
