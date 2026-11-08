# FIELDVERSE – Three Independent Vercel Deployments Guide

FIELDVERSE is architected to deploy as **three separate Vercel projects** connecting to one shared Supabase backend.

---

## Deployment Architecture Table

| Vercel Project Name | Root Directory | Output Directory | Environment Variables |
| :--- | :--- | :--- | :--- |
| `fieldverse-player` | `player` | `dist` (or `.`) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `fieldverse-organizer` | `organizer` | `dist` (or `.`) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `fieldverse-admin` | `admin` | `dist` (or `.`) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

---

## Step-by-Step Vercel Setup

### 1. Push Code to GitHub
Push your `FIELDVERSE` folder to your GitHub account:
```bash
cd d:\prasad\FIELDVERSE
git init
git add .
git commit -m "feat: FIELDVERSE production architecture"
git branch -M main
git remote add origin https://github.com/<your-username>/fieldverse.git
git push -u origin main
```

### 2. Deploy Project 1: Player Portal
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Select your `fieldverse` GitHub repository.
3. In **Root Directory**, click **Edit** and choose:
   ```text
   player
   ```
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `<your-supabase-url>`
   - `VITE_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`
5. Click **Deploy**. Vercel will assign a production URL (e.g. `https://fieldverse-player.vercel.app`).

### 3. Deploy Project 2: Organizer Portal
1. In Vercel, click **Add New...** > **Project** again.
2. Select the same `fieldverse` repository.
3. In **Root Directory**, select:
   ```text
   organizer
   ```
4. Add the same environment variables.
5. Click **Deploy**. (Assigned URL: `https://fieldverse-organizer.vercel.app`).

### 4. Deploy Project 3: Admin Portal
1. In Vercel, click **Add New...** > **Project** again.
2. Select the same repository.
3. In **Root Directory**, select:
   ```text
   admin
   ```
4. Add the same environment variables.
5. Click **Deploy**. (Assigned URL: `https://fieldverse-admin.vercel.app`).
