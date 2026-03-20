FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends icecast2 curl && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/icecast2 && \
    chown -R icecast2:icecast /var/log/icecast2

COPY icecast.xml /etc/icecast2/icecast.xml
RUN chown icecast2:icecast /etc/icecast2/icecast.xml

USER icecast2

EXPOSE 8000

CMD ["icecast2", "-c", "/etc/icecast2/icecast.xml"]
