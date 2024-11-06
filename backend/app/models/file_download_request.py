from pydantic import BaseModel


class FileDownloadRequest(BaseModel):
    file_path: str
    new_file_name: str
