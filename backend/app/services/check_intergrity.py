from app.models.preprocessing_request import PreprocessingRequest
from app.utils.functions import *
import numpy as np
import os


async def check_integration(request: PreprocessingRequest):
    df = load_data(os.path.join(get_full_path(request.file_path), request.file_name))
    df_preprocessed = preprocess_data(df, request.method)

    results = {
        "no_missing": df_preprocessed.isnull().sum().sum() == 0,
        "no_duplicates": not df_preprocessed.duplicated().any(),
        "valid_types": True,
        "range_issues": {},
        "type_issues": {},
    }

    type_issues = {
        col: str(dtype)
        for col, dtype in df_preprocessed.dtypes.items()
        if dtype not in [np.int64, np.float64, object]
    }

    if type_issues:
        results["valid_types"] = False
        results["type_issues"] = type_issues

    for column in df_preprocessed.select_dtypes(include=[np.number]).columns:
        results["range_issues"][column] = (
            (df_preprocessed[column] < -1000) | (df_preprocessed[column] > 1000)
        ).any()

    return results
