from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    icecast_host: str = "icecast"
    icecast_port: int = 8000
    icecast_source_password: str
    icecast_admin_password: str

    liquidsoap_telnet_host: str = "liquidsoap"
    liquidsoap_telnet_port: int = 1234

    music_dir: str = "/media/music"
    playlist_dir: str = "/data/playlists"
    database_path: str = "/data/epirbe.db"

    admin_password: str = "admin"
    admin_token: str = "epirbe-admin-token"

    model_config = {"env_prefix": "", "case_sensitive": False}


settings = Settings()
