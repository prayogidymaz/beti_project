import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# !!! Dev only. Ganti di production.
SECRET_KEY = "django-insecure-o^#-!gc--x(9&ikez+9$@9w(3b6!^2ade^+s$5yoz@dqss0ycp"
DEBUG = True

# Untuk dev lokal & Next.js
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
# Kalau akses via IP LAN, tambahkan: "192.168.x.x"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Apps kamu
    "users",
    "products",
    "jastip",
    "orders",
    "payments",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    # Optional, buat respons JSON aja di prod
    # "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

# ⏱️ SIMPLE_JWT — biar gak sering ke-logout
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),   # sebelumnya default 5 menit
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,                   # opsional, biar refresh muter
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
}

AUTH_USER_MODEL = "users.User"

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # harus di paling atas sebelum CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ✅ CORS untuk Next.js (dev)
# Pilih salah satu: allow all (dev cepat) ATAU whitelist origins
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-language",
    "content-type",
    "authorization",
    "origin",
]
# Paling cepat (DEV): buka semua origin
CORS_ALLOW_ALL_ORIGINS = True
# ATAU (lebih ketat) whitelist origin FE:
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]

ROOT_URLCONF = "beti_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "beti_project.wsgi.application"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "beti",
        "USER": "postgres",
        "PASSWORD": "admin123",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# 🌏 Timezone (biar sesuai lokal)
LANGUAGE_CODE = "id"
TIME_ZONE = "Asia/Pontianak"   # kamu GMT+7
USE_I18N = True
USE_TZ = True                  # simpan UTC di DB, tampil sesuai TIME_ZONE

# Static & Media
STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
