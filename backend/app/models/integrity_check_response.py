from typing import Dict, Optional
from pydantic import BaseModel


class IntegrityCheckResponse(BaseModel):
    no_missing: bool
    no_duplicates: bool
    valid_types: bool
    range_issues: Dict[str, bool]
    type_issues: Optional[Dict[str, str]]
