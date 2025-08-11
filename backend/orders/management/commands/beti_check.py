from django.core.management.base import BaseCommand
from django.conf import settings
from django.urls import get_resolver
from importlib import import_module

class Command(BaseCommand):
    help = "Cek konfigurasi penting Beti (Django + DRF + CORS + Keranjang)"

    def handle(self, *args, **opts):
        self.stdout.write(self.style.MIGRATE_HEADING("== BETI CHECK =="))

        # --- SETTINGS ---
        self.stdout.write(self.style.HTTP_INFO("\n[settings.py]"))
        cors_all = getattr(settings, "CORS_ALLOW_ALL_ORIGINS", None)
        cors_cred = getattr(settings, "CORS_ALLOW_CREDENTIALS", None)
        cors_headers = getattr(settings, "CORS_ALLOW_HEADERS", [])
        allowed_hosts = getattr(settings, "ALLOWED_HOSTS", [])
        tz = getattr(settings, "TIME_ZONE", None)
        try:
            sjwt = import_module("rest_framework_simplejwt.settings").api_settings
            access = sjwt.ACCESS_TOKEN_LIFETIME
            refresh = sjwt.REFRESH_TOKEN_LIFETIME
        except Exception:
            access = refresh = "SIMPLE_JWT not found"

        self.stdout.write(f"ALLOWED_HOSTS: {allowed_hosts}")
        self.stdout.write(f"CORS_ALLOW_ALL_ORIGINS: {cors_all}")
        self.stdout.write(f"CORS_ALLOW_CREDENTIALS: {cors_cred}")
        self.stdout.write(f"CORS_ALLOW_HEADERS has 'authorization': {'authorization' in [h.lower() for h in cors_headers]}")
        self.stdout.write(f"TIME_ZONE: {tz}")
        self.stdout.write(f"SIMPLE_JWT ACCESS: {access}, REFRESH: {refresh}")

        # --- URLS ---
        self.stdout.write(self.style.HTTP_INFO("\n[urls] Terdaftar:"))
        resolver = get_resolver()
        names = set()
        for url in resolver.reverse_dict.keys():
            if isinstance(url, str):
                names.add(url)
        # tampilkan beberapa pola penting
        for pattern in resolver.url_patterns:
            try:
                route = getattr(pattern, 'pattern', None)
                if route and 'api/orders' in str(route):
                    self.stdout.write(f" - {route}")
            except Exception:
                continue

        # cek nama endpoint ideal
        expected = ["cart", "cart-items", "cart-item-detail"]
        found = {name for name in names if name in expected}
        self.stdout.write(f"Ditemukan endpoints: {sorted(found)}")

        # --- VIEWS ---
        self.stdout.write(self.style.HTTP_INFO("\n[views] Cek class keranjang:"))
        try:
            v = import_module("orders.views")
            ok = all(hasattr(v, cls) for cls in ["CartView", "CartItemsView", "CartItemDetailView"])
            self.stdout.write(f"CartView / CartItemsView / CartItemDetailView ada? {ok}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Gagal import orders.views: {e}"))

        self.stdout.write(self.style.SUCCESS("\nSelesai. Jalankan server & test API manual:\n  curl -i http://localhost:8000/api/orders/cart/ -H \"Authorization: Bearer <ACCESS_TOKEN>\""))
