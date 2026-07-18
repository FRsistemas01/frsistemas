from django.contrib import messages
from django.shortcuts import redirect, render

from .models import Lead


def home(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre", "").strip()
        email = request.POST.get("email", "").strip()
        asunto = request.POST.get("asunto", "").strip()
        mensaje = request.POST.get("mensaje", "").strip()

        if nombre and email and mensaje:
            Lead.objects.create(
                nombre=nombre,
                email=email,
                asunto=asunto,
                mensaje=mensaje,
            )
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