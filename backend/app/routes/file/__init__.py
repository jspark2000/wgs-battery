import os
import shutil
from glob import glob
from pathlib import Path
from fastapi import APIRouter, Body, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from app.utils.functions import DEFAULT_DATA_DIR, change_current_file_dir, get_full_path
from app.models.file_request import FileDownloadRequest

router = APIRouter(
    prefix="/files",
    tags=["files"],
)


@router.post("/preprocessed/download")
async def download_file(request: FileDownloadRequest):
    file_path = Path(request.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File {request.file_path} not found in temporary directory",
        )

    return FileResponse(
        path=str(file_path),
        filename=request.new_file_name,
        media_type="application/octet-stream",
    )


@router.get("/list")
async def list_csv_files(data_path: str = Query(default=DEFAULT_DATA_DIR)):
    try:
        files = glob(os.path.join(get_full_path(data_path), "*.csv"))
        return {"files": [os.path.basename(f) for f in files]}
    except Exception as e:
        print(e)


@router.post("/change-dir")
async def change_data_path(data_path: str = Query()):
    files = glob(os.path.join(get_full_path(data_path), "*.csv"))

    return {"files": [os.path.basename(f) for f in files]}


@router.post("/upload")
async def upload_file(
    file_path: str = Query(), file_name: str = Query(), file: UploadFile = File(...)
):
    try:
        new_dir = Path(os.path.join(change_current_file_dir(file_path), file_name))

        with new_dir.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        files = glob(os.path.join(get_full_path(), "*.csv"))

        return {"files": [os.path.basename(f) for f in files]}

    except Exception as e:
        return JSONResponse(
            content={"status": "error", "message": f"Failed to upload file: {str(e)}"},
            status_code=500,
        )

    finally:
        file.file.close()
