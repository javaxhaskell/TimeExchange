# Supabase Setup

The repo now includes a committed root `.env` file with the shared public Supabase values your team needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lphmuftpzwbjdhnjqmrq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_5HCm1-pTGJMKTxdRiMUFOQ_y44zx3FU
```

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

If you need machine-specific overrides, create a `.env.local` file in the project root with the same keys.

Do not commit `.env.local`.

The committed `.env.example` file still contains placeholders and can be used as a template for other environments.
