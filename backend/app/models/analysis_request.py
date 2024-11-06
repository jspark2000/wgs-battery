from app.models.request import RequestWithTempFile


class AnalysisRequest(RequestWithTempFile):
    use_z_score: bool = False
    use_pca: bool = False
    use_autoencoder: bool = False
