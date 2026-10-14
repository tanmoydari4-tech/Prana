# Prāna Wellness & Living Community

> **"Feel Better. Live Healthier. Grow Together."**  
> *Small daily habits. Better lifestyle. A healthier future.*

A premium, international fitness and wellness community web application focused exclusively on healthy lifestyle coaching, balanced natural nutrition, mindful daily habits, online live circles, and supportive community camaraderie.

---

## 🚫 Crucial Brand Identity (Strict Non-Gym Ethos)
This is **NOT** a gym website. It strictly contains:
- **Zero** gym equipment, dumbbells, barbells, or weightlifting machines.
- **Zero** aggressive bodybuilding culture or punishing workout routines.
- **Zero** gym membership plans based on iron machines.
- **100% focus on:** Gentle daily movement (mindful walks, bed-to-mat stretching), circadian sleep habits, hydration rituals, whole-food colorful nutrition, morning sunrise breathing circles, and personal wellness coaching.

---

## ⚡ Supabase Setup & SQL Schema

### Connection Credentials
- **Project ID:** `atmnwxgvnfsrinqrzvij`
- **Project URL:** `https://atmnwxgvnfsrinqrzvij.supabase.co`
- **Anon Public API Key:** `sb_publishable_15I7OtmTepRBdcB8mEUG8A_t_65x7Ls`

### How to Apply the Database Tables:
1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/atmnwxgvnfsrinqrzvij](https://supabase.com/dashboard/project/atmnwxgvnfsrinqrzvij)
2. Go to the **SQL Editor** tab on the left sidebar.
3. Click **New Query**.
4. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the query box.
5. Click **Run**.
6. All 12 tables, Row-Level Security (RLS) policies, and default website settings will be initialized instantly.

---

## 🔐 Admin Authentication (Password Protected)
- **Admin Login URL:** Click "Admin Console" in the footer, or go to `/admin/login`
- **Admin Email:** `tanmoydari4@gmail.com`
- **Admin Password:** You must **manually type** your password:
  - Default master password: `Admin@Prana2026!`
  - For maximum security, the password is **hidden** and **never pre-filled**.
  - You can change this password at any time inside the **Admin Dashboard > Settings** tab.

---

## 🐙 GitHub Settings & Deployment via GitHub Actions

### 1. Enable GitHub Actions for GitHub Pages
1. Go to your GitHub repository: `https://github.com/<your-username>/<your-repo-name>`
2. Click **Settings** (top navigation bar of the repository).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment > Source**, select:
   👉 **GitHub Actions** (Do NOT choose "Deploy from a branch").

### 2. Configure Workflow Permissions
1. In repository **Settings**, go to **Actions** > **General** in the left sidebar.
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Check the box **Allow GitHub Actions to create and approve pull requests**.
5. Click **Save**.

### 3. Deploy via GitHub Action
The repository already includes the pre-configured workflow at `.github/workflows/deploy.yml`:
- It triggers automatically whenever you push code to `main` or `master`.
- You can also run it manually from the **Actions** tab by selecting **"Build and Deploy to GitHub Pages"** and clicking **"Run workflow"**.
