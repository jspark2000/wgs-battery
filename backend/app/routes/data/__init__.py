import tempfile
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.preprocessing_request import PreprocessingRequest
from app.utils.functions import *
from app.models.integrity_check_response import IntegrityCheckResponse
from app.services.check_intergrity import check_integration
from app.models.analysis_request import AnalysisRequest
from app.models.visualization_request import VisualizationRequest
from app.services.visualize import generate_visualize_buf
from app.models.show_dataframe_request import ShowDataframeRequest
from app.models.request import RequestWithTempFile

router = APIRouter(
    prefix="/data",
    tags=["data"],
)


@router.post("/raw/show-datafame")
async def show_raw_dataframe(request: ShowDataframeRequest):
    df = load_data(
        os.path.join(get_full_path(request.file_path), request.file_name), "utf8"
    )
    return get_dataframe_info(df)


@router.post("/preprocess")
async def preprocess_route(request: PreprocessingRequest):
    df = load_data(
        os.path.join(get_full_path(request.file_path), request.file_name),
        request.encoding,
        request.skip_rows,
    )
    processed_df = preprocess_data(df, request.null_method)
    processed_df_info = get_dataframe_info(processed_df)

    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        processed_df.to_csv(tmp.name, index=False)

        return {
            "info": processed_df_info,
            "temp_file_name": tmp.name,
        }


@router.post("/check-integrity")
async def check_integrity(request: RequestWithTempFile) -> IntegrityCheckResponse:
    results = await check_integration(request)
    return IntegrityCheckResponse(**results)


@router.post("/visualize/image")
async def generate_visualization(request: VisualizationRequest) -> StreamingResponse:
    buf = await generate_visualize_buf(request)

    return StreamingResponse(
        buf,
        media_type="application/octet-stream",
        headers={"Content-Disposition": "attachment; filename=result.png"},
    )
