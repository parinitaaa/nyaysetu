import asyncio
import sys

# Fix for Windows Python 3.10+
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from database import init_db


async def main():
    await init_db()
    print("✅ Database initialized successfully!")
    print("Go check PostgreSQL — you should see the 'analyses' table.")


asyncio.run(main())
