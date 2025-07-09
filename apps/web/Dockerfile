# apps/web/Dockerfile

# 1. ---- The Pruner Stage ----
# This stage isolates the 'web' app's code and dependencies from the monorepo.
FROM node:18-alpine AS pruner
WORKDIR /app

# First, copy only the files needed to install dependencies
COPY . .

# Use Turborepo's prune command to create a pruned Turborepo with only the 'web' app.
# --docker is a special flag that creates a pruned package.json structure for Docker builds.
RUN npx turbo prune --scope=@open-agent-platform/web --docker

# 2. ---- The Builder Stage ----
# This stage builds the Next.js application from the pruned files.
FROM node:18-alpine AS builder
WORKDIR /app

# Copy the pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock .

# Install production-only dependencies for the pruned workspace

# Enable Corepack to use the Yarn version defined in package.json
RUN corepack enable

RUN yarn install --frozen-lockfile

# Copy the pruned source code
COPY --from=pruner /app/out/full/ .

# Copy the root tsconfig.json, required by the Next.js build
COPY --from=pruner /app/tsconfig.json .

# ===> Set BUILD-TIME public variables here <===
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_USE_LANGSMITH_AUTH
ARG NEXT_PUBLIC_DEPLOYMENTS
ARG NEXT_PUBLIC_MCP_SERVER_URL
ARG NEXT_PUBLIC_MCP_AUTH_REQUIRED
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_GOOGLE_AUTH_DISABLED
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_USE_LANGSMITH_AUTH=$NEXT_PUBLIC_USE_LANGSMITH_AUTH
ENV NEXT_PUBLIC_DEPLOYMENTS=$NEXT_PUBLIC_DEPLOYMENTS
ENV NEXT_PUBLIC_MCP_SERVER_URL=$NEXT_PUBLIC_MCP_SERVER_URL
ENV NEXT_PUBLIC_MCP_AUTH_REQUIRED=$NEXT_PUBLIC_MCP_AUTH_REQUIRED
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_GOOGLE_AUTH_DISABLED=$NEXT_PUBLIC_GOOGLE_AUTH_DISABLED

# Build the Next.js app
# The --filter=web... flag tells Turborepo to run the build script defined in apps/web/package.json
RUN yarn turbo run build --filter=@open-agent-platform/web...

# 3. ---- The Runner Stage ----
# This is the final, minimal image that will run in production.
FROM node:18-alpine AS runner
WORKDIR /app

ARG LANGSMITH_API_KEY
ENV LANGSMITH_API_KEY=$LANGSMITH_API_KEY

# Public variables needed for Server Components at runtime
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_USE_LANGSMITH_AUTH
ARG NEXT_PUBLIC_DEPLOYMENTS
ARG NEXT_PUBLIC_MCP_SERVER_URL
ARG NEXT_PUBLIC_MCP_AUTH_REQUIRED
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_GOOGLE_AUTH_DISABLED
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_USE_LANGSMITH_AUTH=$NEXT_PUBLIC_USE_LANGSMITH_AUTH
ENV NEXT_PUBLIC_DEPLOYMENTS=$NEXT_PUBLIC_DEPLOYMENTS
ENV NEXT_PUBLIC_MCP_SERVER_URL=$NEXT_PUBLIC_MCP_SERVER_URL
ENV NEXT_PUBLIC_MCP_AUTH_REQUIRED=$NEXT_PUBLIC_MCP_AUTH_REQUIRED
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_GOOGLE_AUTH_DISABLED=$NEXT_PUBLIC_GOOGLE_AUTH_DISABLED

# Set production environment
ENV NODE_ENV=production
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the minimal necessary files from the builder stage
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Set ownership for the new user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 8080

# This is the command that will start the application
CMD ["node", "apps/web/server.js","--port","8080"]