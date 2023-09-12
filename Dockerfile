FROM node:16-alpine3.11 AS build

RUN mkdir -p /app/actuality/

WORKDIR  /app/actuality/

COPY . .

RUN npm install --force &&\
npm run build --force

## Stage 2: Run ###

FROM nginx:1.17.1-alpine AS prod-stage
COPY --from=build /app/actuality/default.config /etc/nginx/conf.d/default.conf
COPY --from=build /app/actuality/dist/actuality /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
