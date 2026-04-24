# Interpao Backend

Python 3.12 + FastAPI + SQLAlchemy 2.0 + Celery + Redis + Supabase

## Features
- **FastAPI**: Modern, fast API framework.
- **SQLAlchemy 2.0**: Async/Sync ORM support.
- **Celery**: Background tasks with Redis.
- **APScheduler**: Periodic tasks with SQLAlchemy job store.
- **Supabase**: Client integration for DB/Storage.
- **Security**: JWT tokens and bcrypt hashing.
- **Tooling**: `uv` for management, `ruff` for linting, `pyright` for typing.

## Getting Started

### Prerequisites
- [uv](https://github.com/astral-sh/uv)
- Docker (for Redis and Postgres)

### Installation
```bash
uv sync
```

### Running Locally
```bash
# Start FastAPI
uv run uvicorn app.main:app --reload

# Start Celery Worker
uv run celery -A app.core.celery_app worker --loglevel=info

# Start Celery Beat (if periodic tasks needed)
uv run celery -A app.core.celery_app beat --loglevel=info
```

### Linting and Typing
```bash
uv run ruff check .
uv run pyright
```

### Testing
```bash
uv run pytest
```
