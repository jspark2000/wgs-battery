# Use Node 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

COPY ../pnpm-workspace.yaml ../pnpm-lock.yaml ../package.json ./
COPY frontend frontend

# Install pnpm globally
RUN npm install -g pnpm

# Install workspace dependencies
RUN pnpm install

WORKDIR /app/frontend

# Expose the port that Vite uses by default
EXPOSE 5173

# Start the Vite development server
CMD ["pnpm", "run", "dev"]
