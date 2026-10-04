# LabDog (CAC Lab Helper)

Scan a lab report, get plain-language insight on what the results mean, and keep every lab in a library. A separate assistant helps you decide what to do next. Not a diagnosis tool.

- `test-app/`: Expo (SDK 54) React Native app
- `server.py`, `tools.py`: Flask backend (Cohere vision OCR, OpenCV cleanup)
- `supabase/schema.sql`: database tables, row level security, storage policies
- `render.yaml`: Render deploy config for the backend
- `docs/`: project plan, `tasks.csv`, and [setup steps](docs/setup.md)

## Run the backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then put your cohere key in API_KEY
python server.py
```

Check it: `curl http://127.0.0.1:4200/health`

## Run the app

The document scanner is a native module, so Expo Go won't work. Use a dev build.

```bash
cd test-app
npm install
cp .env.example .env
npx expo run:ios      # or: npx expo run:android
```

Set `EXPO_PUBLIC_API_URL` in `test-app/.env`:

| where the app runs | value |
|---|---|
| simulator, backend on same computer | `http://127.0.0.1:4200` |
| real phone, backend on your computer | `http://<your lan ip>:4200` |
| deployed | `https://<your-service>.onrender.com` |

Restart Expo after changing `.env`.

## Deploy and database

See [docs/setup.md](docs/setup.md) for Supabase, Render, and applying the schema.
