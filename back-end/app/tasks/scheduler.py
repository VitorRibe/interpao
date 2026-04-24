from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from app.core.config import settings

jobstores = {
    'default': SQLAlchemyJobStore(url=settings.SYNC_DATABASE_URL)
}

scheduler = AsyncIOScheduler(jobstores=jobstores)


def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        print("APScheduler started.")


def shutdown_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        print("APScheduler shut down.")
