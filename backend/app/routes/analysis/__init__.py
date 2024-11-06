from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.analysis_request import AnalysisRequest
from app.models.request import RequestWithTempFile
from app.services.analysis import calculate_anomaly_score, calculate_impulse_factor


router = APIRouter(
    prefix="/analysis",
    tags=["analysis"],
)


@router.post("/anomaly_score/calculate")
def analysis_anomaly_score(request: RequestWithTempFile):
    return calculate_anomaly_score(request)


@router.post("/impulse_factor/calculate")
def analysis_impulse_factor(request: RequestWithTempFile):
    return calculate_impulse_factor(request)
