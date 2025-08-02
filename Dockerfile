# === Stage 1: Build the app ===
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies and build
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# === Stage 2: Run the app ===
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Install only production deps
# RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

# Optional: if using next start
EXPOSE 3000
CMD ["npm", "start"]
