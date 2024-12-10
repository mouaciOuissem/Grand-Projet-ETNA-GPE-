ARG IMAGE_VERSION=22.7.0-alpine3.20

FROM node:${IMAGE_VERSION} AS build

ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY ../src/package.json ./

RUN npm install --silent --loglevel=warn && \
    apk add --no-cache dumb-init

# Stage 2: Final Image with Alpine
FROM node:${IMAGE_VERSION}
ENV NODE_ENV=development

WORKDIR /usr/src/app

# Copy needed files
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node ../src .

# Copy binary files
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

RUN apk add --no-cache curl

EXPOSE 3003

USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD ["sh", "-c", "curl -f http://localhost:3003/api/health || exit 1"]

    # Start the application
    CMD ["dumb-init", "/usr/src/app/node_modules/nodemon/bin/nodemon.js", "--legacy-watch", "--polling-interval", "5000", \
    "--exec", "node", "index.js"]
