FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build Next.js
COPY . ./
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only install production deps
COPY package*.json ./
RUN npm install --production

# Copy built app and public
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
