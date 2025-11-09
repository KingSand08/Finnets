FROM nginx:stable-alpine

# envsubst provided by gettext
RUN apk add --no-cache gettext

# copy the template and substitute at build time
COPY nginx.prod.conf /tmp/nginx.prod.conf

# build-time arg for secret (set by docker-compose build)
ARG INTERNAL_SECRET=""
RUN \
  esc_secret=$(printf '%s' "$INTERNAL_SECRET" | sed -e 's/[\/&]/\\&/g') && \
  sed "s|__INTERNAL_SECRET__|${esc_secret}|g" /tmp/nginx.prod.conf > /etc/nginx/nginx.conf

# copy other optional confs if you need them
# COPY conf.d /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
