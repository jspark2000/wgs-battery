from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    file_path: str
    file_name: str
    use_z_score: bool = False
    use_pca: bool = False
    use_autoencoder: bool = False
