FROM node:14 as builder

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --output-path=./dist/out

FROM nginx:1.17.1

LABEL MAINTAINER="felixmm@hotmail.fr"

ENV TERM=xterm

COPY Dockerfile .
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/out/ /usr/share/nginx/html
EXPOSE 80                                                                                                                                                                                                                                   
EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/health-check || exit 1
