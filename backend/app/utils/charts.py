import matplotlib.pyplot as plt
import numpy as np
from scipy.signal import stft


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
