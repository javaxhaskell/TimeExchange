# Supabase Setup

The repo now includes a committed root `.env` file with the shared public Supabase values your team needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lphmuftpzwbjdhnjqmrq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_5HCm1-pTGJMKTxdRiMUFOQ_y44zx3FU
```

If you need machine-specific overrides, create a `.env.local` file in the project root with the same keys.

Do not commit `.env.local`.

The committed `.env.example` file still contains placeholders and can be used as a template for other environments.
