# College Free Stuff Dashboard

Static UCLA-first dashboard for free student opportunities: food, software, dev tools, swag, events, and research help.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The app uses Next.js static export via `output: "export"` and keeps all offer data in `data/offers.json`.

## Phase 2 Community Vetting

Curated seed offers still live in `data/offers.json`. Approved community submissions and trust signals can be layered on top with Supabase.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Set the same moderation token in Supabase SQL and your local env:

```sql
insert into public.app_settings (key, value)
values ('moderation_token', 'replace-me')
on conflict (key) do update set value = excluded.value;
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MODERATION_TOKEN=replace-me
```

Public users can submit pending offers and add signals. Approved submissions appear in the dashboard. Visit `/moderation?token=replace-me` to approve or reject pending submissions.
