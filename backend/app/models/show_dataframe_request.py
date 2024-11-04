from pydantic import BaseModel


class ShowDataframeRequest(BaseModel):
    file_path: str
    file_name: str
