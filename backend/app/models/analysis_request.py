from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    file_path: str
    use_z_score: bool = False
    use_pca: bool = False
    use_autoencoder: bool = False
