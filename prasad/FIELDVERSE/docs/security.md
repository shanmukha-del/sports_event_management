# FIELDVERSE – Security & Access Control Guide

## 1. Principles of Security

In FIELDVERSE, frontend role checks are convenience layers for UI rendering; **true security is enforced strictly at the PostgreSQL database level** using Supabase Row Level Security (RLS) policies and security definer functions.

---

## 2. Role-Based Permissions Model

There are exactly three distinct roles in the system:

| Role | Creation Mechanism | Capabilities |
| :--- | :--- | :--- |
| **Player** | Self-signup via Player Portal | Browse events, create teams, register squads, view matches and live scores. |
| **Organizer** | Self-signup with Organization Details; pending Admin approval | Create tournaments (pending approval), review team registrations, generate fixtures, enter live scores. |
| **Admin** | Provisioned securely; no public signup | Approve/reject organizers, approve/reject tournaments, inspect audit logs, manage sports catalog. |

---

## 3. Database Security Defenses

### Prevention of Privilege Escalation
- The `profiles` table update policy checks:
  ```sql
  WITH CHECK (
      auth.uid() = id 
      AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      AND organizer_status = (SELECT organizer_status FROM public.profiles WHERE id = auth.uid())
  );
  ```
  This guarantees that no user can elevate their role to `admin` or change their organizer status through API calls.

### Protection of Sensitive Operations
- Service role keys are **never** bundled or exposed in frontend code.
- Only the public/anon key is distributed to browsers.
- Unapproved events cannot be selected or viewed by unauthorized players.
- Organizers cannot edit or cancel events created by other organizers.
