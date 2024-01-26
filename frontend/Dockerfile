FROM alpine:3.19 AS builder
WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
