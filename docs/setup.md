# Setup

Steps that need your accounts. Do them in this order.

## 1. Supabase project (task 1.3)

1. Create a project at https://supabase.com/dashboard.
2. Authentication > Providers: make sure Email is on. While developing you can turn off "Confirm email" so sign-up works instantly.
3. Project settings > API: copy the project URL and the anon key.
4. Put them in `test-app/.env`:

   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```

Never put the service role key in the app or commit any keys. `.env` is gitignored.

## 2. Database schema (task 1.6)

1. SQL editor > new query, paste `supabase/schema.sql`, run. It is safe to run again.
2. It creates `reports`, `report_markers`, `chat_sessions`, `chat_messages`, turns on row level security, and creates the private `reports` bucket. Files must be stored under `<user id>/...`.
3. Check isolation. Create two users (Authentication > Users), add a row to `reports` as user a, then run this with user b's id:

   ```sql
   begin;
   set local role authenticated;
   select set_config('request.jwt.claim.sub', '<user b id>', true);
   -- expect 0
   select count(*) from public.reports;
   rollback;
   ```

## 3. Deploy the backend to Render (task 1.4)

1. Push this repo to GitHub.
2. Render dashboard > New > Blueprint, pick the repo. It reads `render.yaml`.
3. When asked, set `API_KEY` to your Cohere key.
4. After the deploy, check it:

   ```bash
   curl https://<your-service>.onrender.com/health
   ```

   Expect `{"cohere":true,"status":"ok"}`. If `cohere` is false, `API_KEY` is not set.

The free plan sleeps when idle, so the first request after a break can take about a minute.

## 4. Point the app at it (task 1.5)

Set `EXPO_PUBLIC_API_URL` in `test-app/.env` to the Render url (no trailing path), restart Expo, and scan a lab from a phone on mobile data to confirm it works off your wifi.
