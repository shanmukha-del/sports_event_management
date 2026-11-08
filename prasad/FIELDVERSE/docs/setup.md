# FIELDVERSE – Beginner-Friendly Setup Guide

Welcome to **FIELDVERSE**! Follow these simple steps to run all three websites locally on your machine and connect your Supabase database.

---

## 1. Quick Local Execution (Zero-Install Browser Mode)

Every portal in FIELDVERSE is built with standard web technologies. You can open any portal directly in your browser:

* **Player Portal:** Open [d:\prasad\FIELDVERSE\player\index.html](file:///d:/prasad/FIELDVERSE/player/index.html)
* **Organizer Portal:** Open [d:\prasad\FIELDVERSE\organizer\index.html](file:///d:/prasad/FIELDVERSE/organizer/index.html)
* **Admin Portal:** Open [d:\prasad\FIELDVERSE\admin\index.html](file:///d:/prasad/FIELDVERSE/admin/index.html)

All three portals share the same reactive database in your browser (`localStorage`). An event created in the Organizer portal will immediately be available in the Admin portal for approval, and once approved, will instantly appear in the Player portal!

---

## 2. Running Locally with Vite Development Servers

If you prefer running local development servers with hot module reloading:

### Terminal 1: Player Portal (Port 3000)
```bash
cd d:\prasad\FIELDVERSE\player
npm install
npm run dev
```
Open: `http://localhost:3000`

### Terminal 2: Organizer Portal (Port 3001)
```bash
cd d:\prasad\FIELDVERSE\organizer
npm install
npm run dev
```
Open: `http://localhost:3001`

### Terminal 3: Admin Portal (Port 3002)
```bash
cd d:\prasad\FIELDVERSE\admin
npm install
npm run dev
```
Open: `http://localhost:3002`

---

## 3. Connecting Your Supabase Project

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project named **FIELDVERSE**.
3. Open the **SQL Editor** on the left menu.
4. Open the file `FIELDVERSE/database/schema.sql`, copy its entire content, paste it into the Supabase SQL editor, and click **RUN**.
5. Open `FIELDVERSE/database/rls_policies.sql`, paste it, and click **RUN**.
6. Open `FIELDVERSE/database/seed.sql`, paste it, and click **RUN**.
7. Go to **Project Settings** > **API**:
   - Copy **Project URL**
   - Copy **anon / public** key
8. In the **Admin Portal** (`http://localhost:3002`), navigate to **Platform Settings** and paste your URL and Anon Key, then click **Save Credentials**.
