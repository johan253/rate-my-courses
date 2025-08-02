# === Stage 1: Build the app ===
FROM node:20-slim AS builder
WORKDIR /app

# Install openssl for HTTPS support
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies and build
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# === Stage 2: Run the app ===
FROM node:20-slim AS runner
WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Install only production deps
# RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

# Install openssl for HTTPS support
RUN apt-get update -y && apt-get install -y openssl

# Optional: if using next start
EXPOSE 3000
CMD ["npm", "start"]
