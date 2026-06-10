import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app, lifespan

@pytest.mark.asyncio
async def test_read_main():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to Interpao API",
        "docs": "/api/v1/docs",
    }

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health-check")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_lifespan_initializes_db_before_scheduler(monkeypatch):
    events: list[str] = []

    async def fake_init_db():
        events.append("init_db")

    def fake_start_scheduler():
        events.append("start_scheduler")

    def fake_shutdown_scheduler():
        events.append("shutdown_scheduler")

    monkeypatch.setattr("app.main.init_db", fake_init_db)
    monkeypatch.setattr("app.main.start_scheduler", fake_start_scheduler)
    monkeypatch.setattr("app.main.shutdown_scheduler", fake_shutdown_scheduler)

    async with lifespan(app):
        assert events == ["init_db", "start_scheduler"]

    assert events == ["init_db", "start_scheduler", "shutdown_scheduler"]
