ARG IMAGE_VERSION=22.6.0-alpine3.20
FROM node:${IMAGE_VERSION} AS base

FROM base AS deps
WORKDIR /usr/src/app
RUN corepack enable

COPY --chown=node:node ../src/package.json ../src/.yarnrc.yml ./

RUN yarn install && \
    apk add --no-cache dumb-init

FROM base AS runner
WORKDIR /usr/src/app

# RUN corepack enable

COPY --chown=node:node --from=deps /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=deps /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node ../src .

RUN rm -rf /usr/src/app/.next && \
    mkdir /usr/src/app/.next && \
    chown node:node /usr/src/app/.next

# RUN apk add --no-cache curl

EXPOSE 4200

USER node

# Définition de la commande de démarrage de l'application
CMD ["dumb-init", "/usr/src/app/node_modules/nodemon/bin/nodemon.js", "--legacy-watch", "--polling-interval", "5000", \
    "--exec", "next", "dev", "-p", "4200"]