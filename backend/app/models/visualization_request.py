from typing import List, Optional
from pydantic import BaseModel
from app.models.preprocessing_request import CSVEncoding


class VisualizationRequest(BaseModel):
    file_path: str
    visualization_type: str
    column: Optional[str]
    columns: Optional[List[str]]
    encoding: CSVEncoding
