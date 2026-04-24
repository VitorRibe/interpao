from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.REDIS_DSN,
    backend=settings.REDIS_DSN,
)

celery_app.conf.task_routes = {
    "app.tasks.*": "main-queue",
}

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
