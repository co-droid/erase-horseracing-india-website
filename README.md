# 🐴 Save Horses Admin Dashboard - Local Setup Guide

Welcome! Follow these steps to set up and run the admin dashboard locally on your machine.

---

## 1. Clone the Repository

```
git clone https://github.com/watchlikepro45-ui/erase-horseracing-india-website.git
cd erase-horseracing-india-website
```

## 2. Install Dependencies

```
npm install
# or
pnpm install
```

## 3. Set Up Environment Variables

Create a `.env.local` file in the project root with these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_JWT_SECRET=your_admin_jwt_secret
```

- Ask the project owner for these values if you don't have your own Supabase project.
- You can use the `setup-env.sh` script to help generate this file.

## 4. Set Up the Database

- Go to your Supabase dashboard.
- Open the SQL editor.
- Copy and run the contents of `scripts/003_admin_setup.sql` to create the admin tables and default admin user.

## 5. Start the Development Server

```
npm run dev
# or
pnpm dev
```

## 6. Log In to the Admin Dashboard

- Visit: http://localhost:3000/admin/login
- Use the default admin credentials (unless changed):
  - **Email:** admin@savehorses.org
  - **Password:** demo12345

## 7. You're In!

You can now manage the site content from the dashboard. If you need a new admin account, ask the project owner to add your email to the `admin_users` table in Supabase.

---

**Security Note:**
- Change the default admin password after your first login.
- Never commit `.env.local` or any secrets to git.

---

For help, contact the project owner or check the documentation files in the repo.
