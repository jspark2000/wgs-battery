from pydantic import BaseModel


class PreprocessingRequest(BaseModel):
    method: str
    file_path: str
    file_name: str
