# Local Setup

## Backend

```bash
cd "/Users/harshraj/Desktop/Vaidya Ai/backend"
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

Fill `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and either `OPENAI_API_KEY` or `GEMINI_API_KEY` before real chat use. OpenAI is preferred when both keys exist. The backend returns a safe placeholder response when no AI provider is configured.

## Frontend

```bash
cd "/Users/harshraj/Desktop/Vaidya Ai/frontend"
npm install
cp .env.example .env.local
npm run dev -- -H 127.0.0.1 -p 3000
```

Set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8001` when using the local backend above.

## Same Wi-Fi Phone Testing

Current LAN setup for this machine:

```bash
cd "/Users/harshraj/Desktop/Vaidya Ai/backend"
.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8001

cd "/Users/harshraj/Desktop/Vaidya Ai/frontend"
npm run dev -- -H 0.0.0.0 -p 3000
```

Set `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://192.168.29.138:8001
```

Set `backend/.env`:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.29.138:3000
```

Open this on phones connected to the same Wi-Fi:

```text
http://192.168.29.138:3000
```

For true installable PWA behavior on iPhone/Android outside the same Wi-Fi, deploy the frontend and backend behind HTTPS.

## Verification

```bash
cd "/Users/harshraj/Desktop/Vaidya Ai/backend" && .venv/bin/pytest -q
cd "/Users/harshraj/Desktop/Vaidya Ai/frontend" && npm test && npm run lint && npm run build
```
