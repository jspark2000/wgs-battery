from fastapi import HTTPException
import pandas as pd
import os

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


def load_data(file_path: str) -> pd.DataFrame:
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading file: {str(e)}")


def preprocess_data(df: pd.DataFrame, method: str) -> pd.DataFrame:
    if method == "dropna":
        df.dropna(inplace=True)
    elif method == "interpolate":
        df.interpolate(inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df
