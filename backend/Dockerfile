FROM alpine:3.19 AS builder
WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY package*.json ./
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig*.json ./
COPY ./types ./types

RUN npm ci
RUN npm run build


FROM alpine:3.19 AS final
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ./package*.json ./
COPY ./prisma ./prisma

RUN apk add --no-cache nodejs npm
RUN npm ci --omit=dev

ARG DATABASE_URL
ARG BACKEND_PORT
ARG BACKEND_SESSION_SECRET
ARG REDIS_URL
ARG REDIS_PASSWORD

ENV DATABASE_URL=${DATABASE_URL}
ENV BACKEND_PORT=${BACKEND_PORT}
ENV BACKEND_SESSION_SECRET=${BACKEND_SESSION_SECRET}
ENV REDIS_URL=${REDIS_URL}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

EXPOSE ${BACKEND_PORT}
CMD ["npm", "start"]
