from app.models.preprocessing_request import PreprocessingRequest
from app.models.request import RequestWithTempFile
from app.utils.functions import *
import numpy as np
import os


async def check_integration(request: RequestWithTempFile):
    df = load_data(request.file_path, request.encoding)

    results = {
        "no_missing": df.isnull().sum().sum() == 0,
        "no_duplicates": not df.duplicated().any(),
        "valid_types": True,
        "range_issues": {},
        "type_issues": {},
    }

    type_issues = {
        col: str(dtype)
        for col, dtype in df.dtypes.items()
        if dtype not in [np.int64, np.float64, object]
    }

    if type_issues:
        results["valid_types"] = False
        results["type_issues"] = type_issues

    for column in df.select_dtypes(include=[np.number]).columns:
        results["range_issues"][column] = (
            (df[column] < -1000) | (df[column] > 1000)
        ).any()

    return results
