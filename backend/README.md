# Verdant AI — Backend

FastAPI backend rebuilt to match the frontend's `AnalysisReport` contract
(`src/types.ts`) exactly, on **MySQL** (AWS RDS-ready) + EasyOCR + LangGraph/Groq.

## What changed from your original backend

Your original backend was built for a different app (eco/greenwashing scoring).
This version keeps your architecture (OCR pipeline, LangGraph agent, file
upload handling) but retargets every field to **ingredient safety analysis**,
and fixes these bugs found along the way:

1. **`GET /api/history` required a `username` query param** — your frontend
   calls it with no params, so every request would have 422'd. Fixed: now
   returns full history, newest first, no params required.
2. **Uploaded images were deleted right after analysis** — but the frontend's
   History detail panel renders `<img src={report.image_path} />`. Fixed:
   images are now kept and served via a `/uploads` static mount.
3. **`AnalysisReport` was defined twice** (`app/database.py` and
   `app/models.py`) — real risk of "table already defined" errors. Fixed:
   single definition, in `app/models.py` only.
4. **Unsafe upload filenames** (`f"{username}_{image.filename}"` — collisions
   possible). Fixed: now uses the existing (but previously unused)
   `utils.save_uploaded_file`, which generates UUID-based filenames.
5. **Response/DB shape mismatch** — old fields (`eco_score`,
   `greenwashing_verdict`, etc.) didn't exist in the frontend's types at all.
   Fixed: full field-for-field match to `types.ts`.

## Endpoints (match `src/lib/api.ts` calls exactly)

| Method | Path | Frontend caller |
|---|---|---|
| POST | `/api/analyze` (multipart: `username`, `product_name`, `company_name`, `image`) | `AnalysisWorkspace.tsx` |
| GET | `/api/history` | `App.tsx` → `fetchHistory()` |
| DELETE | `/api/history/{id}` | `HistoryLibrary.tsx` |
| POST | `/api/auth/signup` (`username`, `email`, `password`) | `AuthPage.tsx` |
| POST | `/api/auth/login` (`identifier`, `password`) | `AuthPage.tsx` |
| POST | `/api/auth/logout` | (not currently called by frontend — logout is local-only) |

Response shape for `/api/analyze` and each item in `/api/history` is the exact
`AnalysisReport` interface from `src/types.ts` — no wrapper object.

Auth responses match `AuthResponse` (`{ user: { username, email, token }, token }`)
exactly. Authentication itself uses an httpOnly session cookie set on
signup/login — the `token` field is included in the response purely to match
the frontend's type contract; you don't need to manually attach it to
requests for the current flow to work.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env   # then fill in DATABASE_URL (or DB_HOST/USER/PASSWORD) and GROQ_API_KEY
python create_tables.py
uvicorn main:app --reload --port 8000
```

## Connecting to AWS RDS (MySQL)

1. Create an RDS instance, engine = **MySQL**.
2. Enable "Public accessibility" if your backend isn't in the same VPC, and
   open the security group's inbound rules on port 3306 for your backend's
   IP/security group.
3. In `.env`:
   ```
   DATABASE_URL=mysql+pymysql://<user>:<password>@<your-endpoint>.rds.amazonaws.com:3306/verdant_ai
   DB_SSL=true
   ```
4. Run `python create_tables.py` once to create the tables.

## Connecting to Aiven MySQL

Your `.env` is already pre-filled with your Aiven service's host/port/user/db —
you just need to drop in your actual password (from the Aiven console's
"Password" field, click to reveal) in place of `REPLACE_WITH_YOUR_PASSWORD`.

```
DATABASE_URL=mysql+pymysql://avnadmin:<your-password>@mysql-27f7d8ba-abepadmanaban-edc.a.aivencloud.com:24591/defaultdb
DB_SSL=true
```

Aiven enforces SSL (`ssl-mode=REQUIRED`), which `DB_SSL=true` handles. For full
certificate verification (recommended), download the CA certificate from the
Aiven console ("CA certificate" → Show → download), save it as e.g.
`backend/certs/aiven-ca.pem`, and set:
```
DB_SSL_CA_PATH=./certs/aiven-ca.pem
```
Without this, the connection is still encrypted — it just won't verify the
server's certificate chain, which is fine for development but worth doing
properly before production.

Then run `python create_tables.py` once to create the `users` and
`analysis_reports` tables in your `defaultdb` database.

## Connecting the frontend (dev)

Since the frontend calls relative paths (`/api/...`), add a proxy to your
Vite config so dev requests reach this backend at `localhost:8000`:

```ts
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
    },
  },
};
```

In production, serve both from the same origin (or configure CORS +
absolute API URLs) — no frontend code changes needed either way.
