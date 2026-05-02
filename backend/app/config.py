from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    anthropic_api_key: str = ""
    resend_api_key: str = ""
    internal_api_key: str
    frontend_url: str = "https://smim.app"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_pro: str = ""
    stripe_price_annual: str = ""
    openai_api_key: str = ""
    youtube_proxy: str = ""

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()
