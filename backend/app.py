from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import rights
from config.settings import APP_NAME, API_VERSION, DEBUG


def create_app() -> FastAPI:
    app = FastAPI(
        title=APP_NAME,
        version=API_VERSION,
        debug=DEBUG
    )

    # CORS (for frontend like React / Next.js later)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],   # restrict later in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(rights.router)

    @app.get("/")
    def root():
        return {
            "app": APP_NAME,
            "version": API_VERSION,
            "status": "running"
        }

    return app


app = create_app()