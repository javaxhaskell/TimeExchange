# Supabase Setup

This project expects Supabase configuration to be provided through local or deployment environment variables instead of committed env files.

For production deployments, set this optional env var in Vercel so auth emails and redirects always prefer the canonical production site URL:

```bash
NEXT_PUBLIC_SITE_URL=https://YOUR-PRODUCTION-DOMAIN
```

Supabase Auth redirect architecture in this app:

- Email confirmation, OAuth, and password reset all redirect into `/auth/callback`
- `/auth/callback` then routes users internally to `/terminal` or `/update-password`
- `/terminal` is the authenticated landing route

Recommended Supabase Redirect URLs:

```text
http://localhost:3000/**
http://localhost:3001/**
https://YOUR-PRODUCTION-DOMAIN/auth/callback
https://*-<team-or-account-slug>.vercel.app/**
```

Set Supabase Site URL to your production origin:

```text
https://YOUR-PRODUCTION-DOMAIN
```

For local development, create a `.env.local` file in the project root with the required Supabase keys.

Do not commit `.env.local`.
