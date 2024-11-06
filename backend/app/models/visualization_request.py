from typing import List, Optional
from app.models.preprocessing_request import CSVEncoding
from app.models.request import RequestWithTempFile


class VisualizationRequest(RequestWithTempFile):
    visualization_type: str
    column: Optional[str]
    columns: Optional[List[str]]
    encoding: CSVEncoding
