FROM python:3.12-slim

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:0.4.0 /uv /uvx /bin/

# Set working directory
WORKDIR /app

# Enable bytecode compilation and optimize for production
ENV UV_COMPILE_BYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy only dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
# We use --frozen to ensure the lockfile is respected
RUN uv sync --frozen --no-cache

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 8000

# Default command to run the FastAPI application
# Host 0.0.0.0 is required to be accessible from outside the container
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
