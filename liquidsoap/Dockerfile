FROM savonet/liquidsoap:v2.2.5

USER root
RUN mkdir -p /data/playlists && chmod 777 /data/playlists

COPY radio.liq /etc/liquidsoap/radio.liq

EXPOSE 1234 8005

ENTRYPOINT ["liquidsoap", "/etc/liquidsoap/radio.liq"]
