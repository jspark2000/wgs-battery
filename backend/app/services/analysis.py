from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import StandardScaler
from app.models.analysis_request import AnalysisRequest
from app.utils.functions import *
from keras.layers import Input, Dense  # type: ignore
from keras.models import Model  # type: ignore
import matplotlib.pyplot as plt
import os
import io
import pandas as pd


async def analysis(request: AnalysisRequest):
    df = load_data(os.path.join(get_full_path(request.file_path), request.file_name))
    df_preprocessed = preprocess_data(df, "dropna")

    num_plots = sum([request.use_z_score, request.use_pca, request.use_autoencoder])
    if num_plots == 0:
        raise ValueError("At least one analysis method must be selected")

    fig = plt.figure(figsize=(10, 5 * num_plots))
    results = []

    # Z-Score 분석
    if request.use_z_score:
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(df_preprocessed)
        results.append(
            (
                "Z-Score Normalization",
                pd.DataFrame(scaled_data, columns=df_preprocessed.columns),
            )
        )

    # PCA 분석
    if request.use_pca:
        pca = PCA(n_components=2)
        pca_data = pca.fit_transform(df_preprocessed)
        results.append(("PCA Analysis", pd.DataFrame(pca_data)))

    # Autoencoder 분석
    if request.use_autoencoder:
        input_dim = df_preprocessed.shape[1]
        encoding_dim = 3
        input_layer = Input(shape=(input_dim,))
        encoded = Dense(encoding_dim, activation="relu")(input_layer)
        decoded = Dense(input_dim, activation="sigmoid")(encoded)
        autoencoder = Model(input_layer, decoded)
        autoencoder.compile(optimizer="adam", loss="mean_squared_error")

        data = df_preprocessed.values
        autoencoder.fit(data, data, epochs=50, batch_size=256, shuffle=True, verbose=0)

        encoder = Model(input_layer, encoded)
        encoded_data = encoder.predict(data)
        results.append(("Autoencoder Analysis", pd.DataFrame(encoded_data)))

    for i, (title, data) in enumerate(results, 1):
        ax = fig.add_subplot(num_plots, 1, i)

        if isinstance(data, pd.DataFrame):
            plot_data = data
        else:
            plot_data = pd.DataFrame(data)

        if plot_data.shape[1] <= 2:
            ax.scatter(
                plot_data.iloc[:, 0],
                (
                    plot_data.iloc[:, 1]
                    if plot_data.shape[1] > 1
                    else plot_data.iloc[:, 0]
                ),
                alpha=0.7,
            )
            ax.set_title(f"{title} - Scatter Plot")
            ax.set_xlabel("Component 1")
            ax.set_ylabel("Component 2" if plot_data.shape[1] > 1 else "Value")
        else:
            for j in range(plot_data.shape[1]):
                ax.plot(plot_data.iloc[:, j], label=f"Feature {j+1}")
            ax.set_title(f"{title} - Line Plot")
            ax.legend()

    plt.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=100)
    buf.seek(0)
    plt.close(fig)

    return buf
