# fluxrate

Fiat/crypto rate tracker. Django REST API + React dashboard, with scheduled
quote syncing via Celery.

## Stack

- **Backend:** Django, Django REST Framework, JWT auth (`simplejwt`), Postgres, Celery + Redis
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Recharts

## Architecture

- `Asset`: catalog of tracked fiat/crypto assets
- `Quote`: historical price of an asset in a reference currency (BRL/USD)
- `Watchlist`: per-user favorite assets
- Quotes are fetched from [AwesomeAPI](https://docs.awesomeapi.com.br/) (fiat)
  and [CoinGecko](https://www.coingecko.com/en/api) (crypto), synced every 5
  minutes by a Celery Beat schedule (`tracker.tasks.sync_quotes_task`)

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DJANGO_SECRET_KEY, POSTGRES_PASSWORD

docker compose -f ../docker-compose.yml up -d   # Postgres + Redis
python manage.py migrate
python manage.py createsuperuser

python manage.py runserver
```

Run these in separate terminals to enable scheduled quote syncing:

```bash
celery -A config worker --loglevel=info
celery -A config beat --loglevel=info
```

Or trigger a one-off sync manually:

```bash
python manage.py fetch_quotes
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:8000/api

npm run dev
```

Open `http://localhost:5173`.

## API

| Endpoint | Method | Auth | Notes |
|---|---|---|---|
| `/api/accounts/register/` | POST | none | create a user |
| `/api/token/` | POST | none | obtain JWT access/refresh pair |
| `/api/token/refresh/` | POST | none | refresh access token |
| `/api/assets/` | GET/POST | required | asset catalog |
| `/api/watchlist/` | GET/POST/DELETE | required | current user's watchlist |
| `/api/quotes/` | GET | required | supports `?asset=`, `?currency=`, `?latest=true` |

## Tests

```bash
cd backend
python manage.py test
```
