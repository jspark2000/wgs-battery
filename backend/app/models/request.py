from pydantic import BaseModel
from app.models.preprocessing_request import CSVEncoding


class RequestWithTempFile(BaseModel):
    file_path: str
    encoding: CSVEncoding
