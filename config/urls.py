from django.contrib import admin
from django.urls import include, path
from django.views.static import serve as serve_static_file

from django.conf import settings
from django.conf.urls.static import static

PORTFOLIO_ROOT = settings.BASE_DIR / "static" / "portfolio"

urlpatterns = [
    path("admin/", admin.site.urls),
    # Portfolio conceptual (VOID, ORLA, FORJA, OMBRA, ALTO, NOOR + sistemas demo):
    # sitio estático aparte, servido tal cual desde static/portfolio/, sin pasar
    # por el sistema de templates de la web principal.
    path("portfolio/", serve_static_file, {"document_root": PORTFOLIO_ROOT, "path": "index.html"}),
    path("portfolio/<path:path>", serve_static_file, {"document_root": PORTFOLIO_ROOT}),
    path("", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)