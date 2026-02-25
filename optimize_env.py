import os
import re
import shutil

env_file = ".env"
optimized_file = ".env.optimized"

header = """# ─────────────────────────────────────────────────────────────────────────────
# 🌌 AIGESTION NEXUS V2 - GOD LEVEL ENVIRONMENT MASTER CONFIGURATION 🌌
# ─────────────────────────────────────────────────────────────────────────────
# This is the single source of truth for all environment variables across
# Backend, Frontend, and IA Engine.
# Note: Variables marked with # are disabled or waiting for credentials.
# 🔗 Quick links are provided to easily acquire missing API Keys.
# ─────────────────────────────────────────────────────────────────────────────

"""

links = {
    # Finance & Payments
    "STRIPE": "https://dashboard.stripe.com/apikeys",
    "PAYPAL": "https://developer.paypal.com/dashboard/applications",
    "REVOLUT": "https://developer.revolut.com/dashboard",
    
    # AI & ML
    "OPENAI": "https://platform.openai.com/api-keys",
    "ANTHROPIC": "https://console.anthropic.com/settings/keys",
    "GEMINI": "https://aistudio.google.com/app/apikey",
    "GOOGLE_GENAI": "https://aistudio.google.com/app/apikey",
    "MISTRAL": "https://console.mistral.ai/api-keys/",
    "GROQ": "https://console.groq.com/keys",
    "TOGO": "https://together.ai/",
    "DEEPSEEK": "https://platform.deepseek.com/api_keys",
    "PERPLEXITY": "https://www.perplexity.ai/settings/api",
    "COHERE": "https://dashboard.cohere.com/api-keys",
    "STABILITY": "https://platform.stability.ai/account/keys",
    "RUNWAY": "https://app.runwayml.com/account/api-keys",
    "ELEVENLABS": "https://elevenlabs.io/app/settings/api-keys",
    "VAPI": "https://dashboard.vapi.ai/keys",
    "SUNO": "https://app.suno.ai/",
    "PINECONE": "https://app.pinecone.io/",
    "HUGGINGFACE": "https://huggingface.co/settings/tokens",
    "TAVILY": "https://app.tavily.com/home",
    
    # GCP / AWS
    "GOOGLE_CLOUD": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_APPLICATION": "https://console.cloud.google.com/iam-admin/serviceaccounts",
    "AWS": "https://console.aws.amazon.com/iam/",
    
    # Git
    "GITHUB": "https://github.com/settings/tokens",
    "GITLAB": "https://gitlab.com/-/profile/personal_access_tokens",
    
    # Communication & CRM
    "TWILIO": "https://console.twilio.com/",
    "WHATSAPP": "https://developers.facebook.com/apps/",
    "TELEGRAM": "https://core.telegram.org/bots/features#botfather",
    "SLACK": "https://api.slack.com/apps",
    "DISCORD": "https://discord.com/developers/applications",
    "SENDGRID": "https://app.sendgrid.com/settings/api_keys",
    "MAILJET": "https://app.mailjet.com/account/api_keys",
    
    # Social & Meta
    "META_": "https://developers.facebook.com/apps/",
    "FACEBOOK": "https://developers.facebook.com/apps/",
    "INSTAGRAM": "https://developers.facebook.com/apps/",
    "X_API": "https://developer.x.com/en/portal/dashboard",
    "X_ACCESS": "https://developer.x.com/en/portal/dashboard",
    "TIKTOK": "https://developers.tiktok.com/",
    "LINKEDIN": "https://www.linkedin.com/developers/apps",
    
    # APIs & Tools
    "BROWSERLESS": "https://cloud.browserless.io/account",
    "SUPABASE": "https://supabase.com/dashboard/project/_/settings/api",
    "VERCEL": "https://vercel.com/account/tokens",
    "CLOUDFLARE": "https://dash.cloudflare.com/profile/api-tokens",
    "SENTRY": "https://sentry.io/settings/account/api/auth-tokens/",
    "APP_SENTRY": "https://sentry.io/settings/account/api/auth-tokens/",
    "DATADOG": "https://app.datadoghq.com/organization-settings/api-keys",
    "FIGMA": "https://www.figma.com/developers/api",
    "NOTION": "https://www.notion.so/my-integrations",
    "ALPHAVANTAGE": "https://www.alphavantage.co/support/#api-key",
    
    # Others
    "GMAIL": "https://console.cloud.google.com/apis/credentials",
    "YOUTUBE": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_DRIVE": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_CALENDAR": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_SHEETS": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_MAPS": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_VISION": "https://console.cloud.google.com/apis/credentials",
    "GOOGLE_TRANSLATE": "https://console.cloud.google.com/apis/credentials",
    "OPENWEATHER": "https://home.openweathermap.org/api_keys",
}

with open(env_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
used_links = set()
header_injected = False

for i, line in enumerate(lines):
    # Inject header automatically if we hit the first non-comment/non-empty line
    if not header_injected and not line.strip().startswith('#') and '=' in line:
        # Actually it's better to just put the header at the very top. We'll do it later when writing.
        pass

    stripped = line.strip()
    
    if stripped and not stripped.startswith("##") and not stripped.startswith("-----") and "=" in stripped:
        var_name = stripped.split("=")[0]
        # remove # if it's commented
        var_name = var_name.lstrip("#").strip()
        
        for prefix, url in links.items():
            if var_name.startswith(prefix) and prefix not in used_links:
                
                # Check previous few lines to see if we already injected a link recently or if it already exists
                already_has_link = False
                for prev in new_lines[-3:]:
                    if "🔗 Obtener credenciales" in prev or url in prev:
                        already_has_link = True
                        break
                        
                if not already_has_link:
                    new_lines.append(f"# 🔗 Obtener credenciales: {url}\n")
                used_links.add(prefix)
                break

    new_lines.append(line)

with open(optimized_file, "w", encoding="utf-8") as f:
    f.write(header)
    for line in new_lines:
        if "AIGESTION NEXUS V2" not in line and "────────────────────────" not in line:
            # We don't want to duplicate headers if they were already there
            f.write(line)

shutil.move(optimized_file, env_file)
print(f"Optimized .env file in place.")
