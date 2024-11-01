# /apps/backend/Dockerfile

# Base image
FROM python:3.11.8

# Set the working directory
WORKDIR /app

# Copy the rest of the application
COPY pyproject.toml poetry.lock /app/
COPY backend /app

# Install Poetry
RUN pip install poetry

# Install dependencies
RUN poetry config virtualenvs.create false
RUN poetry install --no-root --no-interaction --no-ansi

# Expose port
EXPOSE 4000

# Command to run FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
