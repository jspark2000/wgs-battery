from fastapi import FastAPI
from app.utils.functions import *
from app.utils.config import *


app = FastAPI(title="WGS Data Mining API")

add_cors_middleware(app)
add_routers(app)
