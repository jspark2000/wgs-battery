from enum import Enum
from app.models.visualization_request import VisualizationRequest
from app.utils.functions import *
from app.utils.charts import *
import io
import matplotlib.pyplot as plt


class VisualizationType(str, Enum):
    LINE = "Line Plot"
    CONTROL = "Control Chart"
    PARETO = "Pareto Chart"
    # SCATTER = "Scatter Plot"
    SPECTOGRAM = "Spectogram"
    HISTOGRAM = "Histogram"
    FFT = "FFT"
    MIN_MAX = "Moving Min Max"
    DIFFERENTIAL = "Differential Filter"
    LOW_HIGH = "Low High Path FILTER"
    EXPONENTIAL = "Exponential Composite"


async def generate_visualize_buf(request: VisualizationRequest) -> io.BytesIO:
    try:
        df = load_data(
            get_full_path(request.file_path),
            encoding=parse_csv_encoding(request.encoding),
        )

        if request.visualization_type == VisualizationType.LINE:
            fig = create_plots2(df, request.column)

        elif request.visualization_type == VisualizationType.CONTROL:
            fig = create_control_chart(df, request.column)

        elif request.visualization_type == VisualizationType.PARETO:
            fig = create_pareto_chart(df, request.column)

        elif request.visualization_type == VisualizationType.SPECTOGRAM:
            fig = spectrogram(df, request.column)

        elif request.visualization_type == VisualizationType.HISTOGRAM:
            fig = create_histogram(df, request.column)

        elif request.visualization_type == VisualizationType.FFT:
            fig = create_fft(df, request.column)

        elif request.visualization_type == VisualizationType.LOW_HIGH:
            fig = create_low_high_filter(df, request.column)

        elif request.visualization_type == VisualizationType.DIFFERENTIAL:
            fig = create_differential_filter(df, request.column)

        elif request.visualization_type == VisualizationType.MIN_MAX:
            fig = create_moving_min_max(df, request.column)

        elif request.visualization_type == VisualizationType.EXPONENTIAL:
            fig = create_exponential_composite(df, request.column)

        else:
            raise ValueError(
                f"Unsupported visualization type: {request.visualization_type}"
            )

        buf = io.BytesIO()
        fig.savefig(buf, format="png")
        buf.seek(0)
        plt.close(fig)

        return buf

    except Exception as e:
        print(f"Error generating visualization: {str(e)}")
        raise
