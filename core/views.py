import requests
from django.conf import settings
from django.contrib import messages
from django.shortcuts import redirect, render

from .models import Lead


def _obtener_ip(request):
    """Intenta obtener la IP real del visitante, incluso detrás de un proxy."""
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def home(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre", "").strip()
        empresa = request.POST.get("empresa", "").strip()
        email = request.POST.get("email", "").strip()
        whatsapp = request.POST.get("whatsapp", "").strip()
        servicio = request.POST.get("servicio", "").strip()
        presupuesto = request.POST.get("presupuesto", "").strip()
        mensaje = request.POST.get("mensaje", "").strip()

        if nombre and email and mensaje:
            lead = Lead.objects.create(
                nombre=nombre,
                empresa=empresa,
                email=email,
                whatsapp=whatsapp,
                servicio=servicio,
                presupuesto=presupuesto,
                mensaje=mensaje,
                ip=_obtener_ip(request),
            )

            # A partir de acá, n8n se encarga de: guardar en Google Sheets,
            # guardar en el CRM, avisarte por WhatsApp y por email, mandarle
            # la confirmación al cliente, y clasificar el lead (caliente/normal).
            if settings.N8N_WEBHOOK_URL:
                try:
                    requests.post(
                        settings.N8N_WEBHOOK_URL,
                        json={
                            "nombre": lead.nombre,
                            "empresa": lead.empresa,
                            "email": lead.email,
                            "whatsapp": lead.whatsapp,
                            "servicio": lead.get_servicio_display(),
                            "presupuesto": lead.presupuesto,
                            "mensaje": lead.mensaje,
                            "ip": lead.ip,
                            "fecha": lead.creado.isoformat() if lead.creado else None,
                        },
                        timeout=8,
                    )
                except Exception:
                    # Si n8n está caído o tarda demasiado, el lead ya quedó
                    # guardado localmente en la base de Django y no se pierde.
                    pass

            messages.success(
                request,
                "¡Gracias! Recibimos tu mensaje y te vamos a contactar a la brevedad.",
            )
        else:
            messages.error(
                request,
                "Faltan completar campos obligatorios (nombre, email y mensaje).",
            )

        return redirect("/#contacto")

    return render(request, "core/home.html")