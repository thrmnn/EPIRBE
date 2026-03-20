FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends icecast2 curl gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/icecast2 && \
    chown -R icecast2:icecast /var/log/icecast2

COPY icecast.xml.template /etc/icecast2/icecast.xml.template

USER icecast2

EXPOSE 8000

CMD bash -c "envsubst < /etc/icecast2/icecast.xml.template > /tmp/icecast.xml && exec icecast2 -c /tmp/icecast.xml"
