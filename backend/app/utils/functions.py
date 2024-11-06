from fastapi import HTTPException
from app.models.preprocessing_request import CSVEncoding, NullMethod
import pandas as pd
import os
import json


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DEFAULT_DATA_DIR = "data"


def get_full_path(data_path: str = DEFAULT_DATA_DIR):
    return os.path.join(PROJECT_ROOT, data_path)


def change_current_file_dir(data_path: str):
    global DEFAULT_DATA_DIR
    DEFAULT_DATA_DIR = data_path

    new_dir = os.path.join(PROJECT_ROOT, data_path)
    if not os.path.exists(new_dir):
        os.makedirs(new_dir)

    return new_dir


def load_data(file_path: str, encoding: str, skipRows=0) -> pd.DataFrame:
    try:
        return pd.read_csv(file_path, encoding=encoding, skiprows=skipRows)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading file: {str(e)}")


def preprocess_data(df: pd.DataFrame, method: NullMethod) -> pd.DataFrame:
    if method == NullMethod.DROPNA:
        df.dropna(inplace=True)
    elif method == NullMethod.INTERPOLATION:
        df.interpolate(inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df


def get_dataframe_info(df: pd.DataFrame):
    total_rows = len(df)
    total_cols = len(df.columns)

    column_info = []

    for col in df.columns:
        info = {
            "column_name": col,
            "dtype": str(df[col].dtype),
            "non_null_count": int(df[col].count()),
            "null_count": int(df[col].isnull().sum()),
            "null_percentage": float(round(df[col].isnull().mean() * 100, 2)),
        }
        column_info.append(info)

    return {
        "column_info": column_info,
        "dataframe_info": {"total_rows": total_rows, "total_cols": total_cols},
        "rows": json.loads(df.head(10).to_json(orient="records", date_format="iso")),
    }


def parse_csv_encoding(encoding: CSVEncoding):
    if encoding == CSVEncoding.ASCII:
        return "ascii"
    elif encoding == CSVEncoding.CP949:
        return "cp949"
    elif encoding == CSVEncoding.EUCKR:
        return "euckr"
    elif encoding == CSVEncoding.UTF16:
        return "utf16"
    else:
        return "utf8"  # default
