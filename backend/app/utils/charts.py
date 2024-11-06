import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.signal import stft, butter, filtfilt


# Basic
def plot_data(df, title):
    fig, ax = plt.subplots(figsize=(10, 5))
    if df.shape[1] <= 2:
        ax.scatter(
            df.iloc[:, 0],
            df.iloc[:, 1] if df.shape[1] > 1 else df.iloc[:, 0],
            alpha=0.7,
        )
        ax.set_title(f"{title} - Scatter Plot")
        ax.set_xlabel("Component 1")
        ax.set_ylabel("Component 2" if df.shape[1] > 1 else "Value")
    else:
        for col in df.columns:
            ax.plot(df[col], label=col)
        ax.set_title(f"{title} - Line Plot")
        ax.legend()

    return fig


# Line chart
def create_plots2(df, column):
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(df.index, df[column], label=f"{column}")
    ax.set_title(f"Line Plot of {column}")
    ax.set_xlabel("Index")
    ax.set_ylabel(column)
    ax.legend()
    plt.tight_layout()
    return fig


# Control chart
def create_control_chart(df, column):
    fig, ax = plt.subplots(figsize=(10, 5))
    cl = df[column].mean()
    ucl = cl + 3 * df[column].std()
    lcl = cl - 3 * df[column].std()
    ax.plot(df[column], marker="o", linestyle="-")
    ax.axhline(y=cl, color="green", label="CL")
    ax.axhline(y=ucl, color="red", linestyle="--", label="UCL")
    ax.axhline(y=lcl, color="blue", linestyle="--", label="LCL")
    ax.set_title(f"Control Chart for {column}")
    ax.set_xlabel("Index")
    ax.set_ylabel(column)
    ax.legend()
    return fig


# Pareto chart
def create_pareto_chart(df, column):
    data = df[column].value_counts().sort_values(ascending=False)
    fig, ax = plt.subplots()
    data.plot(kind="bar", ax=ax)
    ax.set_xticklabels([])
    ax.set_ylabel("Frequency")
    ax2 = ax.twinx()
    ax2.plot(data.cumsum() / data.sum() * 100, marker="D", color="green")
    ax2.set_ylim(0, 110)
    return fig


# scatter
def create_scatter_plot(df, columns):
    fig, ax = plt.subplots()
    ax.scatter(df[columns[0]], df[columns[1]], alpha=0.5)
    ax.set_title(f"Scatter Plot of {columns[0]} vs {columns[1]}")
    ax.set_xlabel(columns[0])
    ax.set_ylabel(columns[1])
    return fig


# Spectrogram
def spectrogram(df, column):
    signal = df[column]
    fs = 5000  # 샘플링 주파수
    nperseg = 256  # 각 세그먼트의 길이
    noverlap = 128  # 세그먼트 중첩
    nfft = 512  # FFT 점의 수
    f, t, Zxx = stft(signal, fs=fs, nperseg=nperseg, noverlap=noverlap, nfft=nfft)
    plt.figure()
    plt.pcolormesh(t, f, np.abs(Zxx), shading="auto")
    plt.title("STFT Spectrogram")
    plt.ylabel("Frequency [Hz]")
    plt.xlabel("Time [sec]")
    return plt.gcf()


# Histogram
def create_histogram(df, column):
    fig, ax = plt.subplots()
    ax.hist(df[column], bins=30, alpha=0.7)
    ax.set_title(f"Histogram of {column}")
    ax.set_xlabel(column)
    ax.set_ylabel("Frequency")
    return fig


# FFT
def create_fft(df, column):
    signal = df[column]
    fft_vals = np.fft.fft(signal)
    fft_freq = np.fft.fftfreq(len(signal))
    fig, ax = plt.subplots()
    ax.plot(fft_freq, np.abs(fft_vals))
    ax.set_title(f"FFT of {column}")
    ax.set_xlabel("Frequency")
    ax.set_ylabel("Amplitude")
    return fig


# Low-High Filter
def create_low_high_filter(df: pd.DataFrame, column: str):
    fs = 1e6  # 샘플링 레이트 1 MHz
    fc = 10000  # 컷오프 주파수 10 kHz

    # 필터 계수 생성
    b_high, a_high = butter(N=5, Wn=fc / (fs / 2), btype="high")
    b_low, a_low = butter(N=5, Wn=fc / (fs / 2), btype="low")

    # 필터 적용
    high_filtered_data = filtfilt(b_high, a_high, df[column])
    low_high_filtered_data = filtfilt(b_low, a_low, high_filtered_data)

    fig, ax = plt.subplots()
    ax.plot(low_high_filtered_data, linewidth=0.5, alpha=1, label=column)
    ax.set_title("Row-High Filtered")
    ax.set_xlabel("Time Series")
    ax.set_ylabel("Value")
    ax.legend(loc="upper right", framealpha=0.7)
    ax.grid(linestyle="--")

    return fig


def create_differential_filter(df: pd.DataFrame, column: str):
    filter = np.concatenate((np.full(50, -1), np.full(50, 1)))
    filtered_data = np.convolve(df[column], filter, mode="valid")
    filtered_data = abs(filtered_data)

    fig, ax = plt.subplots()
    ax.plot(filtered_data, linewidth=0.5, alpha=1, label=column)
    ax.set_title("Differential Filtered")
    ax.set_xlabel("Time Series")
    ax.set_ylabel("Value")
    ax.legend(loc="upper right", framealpha=0.7)
    ax.grid(linestyle="--")

    return fig


def create_moving_min_max(df: pd.DataFrame, column: str):
    window_size = 10_000

    data = df.copy(deep=True)
    data["moving_max"] = data[column].rolling(window=window_size, center=True).max()
    data["moving_max"] = data["moving_max"].ffill().bfill()
    data["moving_min"] = data[column].rolling(window=window_size, center=True).min()
    data["moving_min"] = data["moving_min"].ffill().bfill()

    moving_max_min = data["moving_max"] - data["moving_min"]

    fig, ax = plt.subplots()
    ax.plot(moving_max_min, linewidth=0.5, alpha=1, label=column)
    ax.set_title("Moving Min-Max")
    ax.set_xlabel("Time Series")
    ax.set_ylabel("Value")
    ax.legend(loc="upper right", framealpha=0.7)
    ax.grid(linestyle="--")

    return fig


def create_exponential_composite(df: pd.DataFrame, column: str):
    avg = df[column].mean()
    normalized = (df[column] - avg) / avg
    exp_ed = np.exp(normalized)

    fig, ax = plt.subplots()
    ax.plot(exp_ed, linewidth=0.5, alpha=1, label=column)
    ax.set_title("Exponential Composite")
    ax.set_xlabel("Time Series")
    ax.set_ylabel("Value")
    ax.legend(loc="upper right", framealpha=0.7)
    ax.grid(linestyle="--")

    return fig
