import os
import shutil
from glob import glob
from pathlib import Path
from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from app.utils.functions import DEFAULT_DATA_DIR, change_current_file_dir, get_full_path

router = APIRouter(
    prefix="/files",
    tags=["files"],
)


@router.get("/{data_path:path}/download")
async def download_file(data_path: str):
    file_path = Path(data_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404, detail=f"File {data_path} not found in temporary directory"
        )

    return FileResponse(
        path=str(file_path), filename="data.csv", media_type="application/octet-stream"
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
    data_path: str = Query(default=DEFAULT_DATA_DIR), file: UploadFile = File(...)
):
    try:
        new_dir = Path(change_current_file_dir(data_path))

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
