from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("nombre", "email", "asunto", "creado", "atendido")
    list_filter = ("atendido", "creado")
    search_fields = ("nombre", "email", "mensaje")
    readonly_fields = ("creado",)
