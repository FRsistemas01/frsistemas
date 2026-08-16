from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("nombre", "empresa", "email", "whatsapp", "servicio", "presupuesto", "creado", "atendido")
    list_filter = ("atendido", "servicio", "creado")
    search_fields = ("nombre", "empresa", "email", "whatsapp", "mensaje")
    readonly_fields = ("creado", "ip")
