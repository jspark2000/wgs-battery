from pydantic import BaseModel
from enum import Enum


class CSVEncoding(str, Enum):
    CP949 = "CP949"
    EUCKR = "EUCKR"
    UTF16 = "UTF16"
    UTF8 = "UTF8"
    ASCII = "ASCII"


class NullMethod(str, Enum):
    DROPNA = "dropna"
    INTERPOLATION = "interpolation"


class PreprocessingRequest(BaseModel):
    file_path: str
    file_name: str
    encoding: CSVEncoding
    null_method: NullMethod
    skip_rows: int
