from app.utils.functions import *
from app.models.request import RequestWithTempFile
from scipy.signal import find_peaks, peak_widths
import pandas as pd
import numpy as np


# async def analysis(request: AnalysisRequest):
#     df = load_data(request.file_path, request.encoding)

#     num_plots = sum([request.use_z_score, request.use_pca, request.use_autoencoder])
#     if num_plots == 0:
#         raise ValueError("At least one analysis method must be selected")

#     fig = plt.figure(figsize=(10, 5 * num_plots))
#     results = []

#     # Z-Score 분석
#     if request.use_z_score:
#         scaler = StandardScaler()
#         scaled_data = scaler.fit_transform(df)
#         results.append(
#             (
#                 "Z-Score Normalization",
#                 pd.DataFrame(scaled_data, columns=df.columns),
#             )
#         )

#     # PCA 분석
#     if request.use_pca:
#         pca = PCA(n_components=2)
#         pca_data = pca.fit_transform(df)
#         results.append(("PCA Analysis", pd.DataFrame(pca_data)))

#     # Autoencoder 분석
#     if request.use_autoencoder:
#         input_dim = df.shape[1]
#         encoding_dim = 3
#         input_layer = Input(shape=(input_dim,))
#         encoded = Dense(encoding_dim, activation="relu")(input_layer)
#         decoded = Dense(input_dim, activation="sigmoid")(encoded)
#         autoencoder = Model(input_layer, decoded)
#         autoencoder.compile(optimizer="adam", loss="mean_squared_error")

#         data = df.values
#         autoencoder.fit(data, data, epochs=50, batch_size=256, shuffle=True, verbose=0)

#         encoder = Model(input_layer, encoded)
#         encoded_data = encoder.predict(data)
#         results.append(("Autoencoder Analysis", pd.DataFrame(encoded_data)))

#     for i, (title, data) in enumerate(results, 1):
#         ax = fig.add_subplot(num_plots, 1, i)

#         if isinstance(data, pd.DataFrame):
#             plot_data = data
#         else:
#             plot_data = pd.DataFrame(data)

#         if plot_data.shape[1] <= 2:
#             ax.scatter(
#                 plot_data.iloc[:, 0],
#                 (
#                     plot_data.iloc[:, 1]
#                     if plot_data.shape[1] > 1
#                     else plot_data.iloc[:, 0]
#                 ),
#                 alpha=0.7,
#             )
#             ax.set_title(f"{title} - Scatter Plot")
#             ax.set_xlabel("Component 1")
#             ax.set_ylabel("Component 2" if plot_data.shape[1] > 1 else "Value")
#         else:
#             for j in range(plot_data.shape[1]):
#                 ax.plot(plot_data.iloc[:, j], label=f"Feature {j+1}")
#             ax.set_title(f"{title} - Line Plot")
#             ax.legend()

#     plt.tight_layout()

#     buf = io.BytesIO()
#     fig.savefig(buf, format="png", bbox_inches="tight", dpi=100)
#     buf.seek(0)
#     plt.close(fig)

#     return buf


def calculate_impulse_factor(request: RequestWithTempFile):
    df = load_data(request.file_path, request.encoding)

    df = df.rename(columns={df.columns[0]: "value"})
    IF = df["value"].mean() / df["value"].max()

    return {"metric": "Impulse Factor", "value": IF}


def calculate_anomaly_score(request: RequestWithTempFile):
    alpha = 1.0
    beta = 0.5
    gamma = 1.0

    df = load_data(request.file_path, request.encoding)

    x1, x2, x3 = calculate_metrics(df)
    weighted_score = (alpha * x1) + (beta * x2) + (gamma * x3)

    return {"metric": "anomaly score", "value": weighted_score}


def calculate_metrics(data: pd.DataFrame, sigma_multiplier=4):
    mean = data.values.mean()
    sigma = np.std(data.values)

    std_deviation = sigma

    upper_limit = mean + sigma_multiplier * sigma
    lower_limit = mean - sigma_multiplier * sigma
    anomaly_count = ((data.values < lower_limit) | (data.values > upper_limit)).sum()

    flattened_data = data.values.flatten()
    peaks, _ = find_peaks(flattened_data)
    widths = peak_widths(flattened_data, peaks, rel_height=0.5)[0]
    widest_peak_width = max(widths) if widths.size > 0 else 0

    return std_deviation, anomaly_count, widest_peak_width
