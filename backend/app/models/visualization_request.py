from typing import List, Optional
from pydantic import BaseModel


class VisualizationRequest(BaseModel):
    file_path: str
    file_name: str
    visualization_type: str
    column: Optional[str]
    columns: Optional[List[str]]
