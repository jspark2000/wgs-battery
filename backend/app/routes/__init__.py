from fastapi import APIRouter
from app.routes import data, file

router = APIRouter()


@router.get("/")
def root():
    return "API server is running now"


router.include_router(data.router)
router.include_router(file.router)
