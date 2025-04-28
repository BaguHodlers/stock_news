FROM node:20.12.2-alpine as builder
WORKDIR /usr/src
RUN apk add --no-cache python3 make g++ gcc libc-dev tzdata
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
COPY . .
ENV DISABLE_WORKERD=true
RUN corepack enable
RUN pnpm install
RUN pnpm run build

FROM node:20.12.2-alpine
WORKDIR /usr/app
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
COPY --from=builder /usr/src/dist/output ./output
ENV HOST=0.0.0.0 PORT=4444 NODE_ENV=production TZ=Asia/Shanghai
EXPOSE $PORT
CMD ["node", "output/server/index.mjs"]
