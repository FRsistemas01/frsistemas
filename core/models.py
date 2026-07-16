from django.db import models


class Lead(models.Model):
    """Mensaje de contacto enviado desde la landing de FR.Sistemas."""

    SERVICIOS = [
        ("pagina_web", "Página web"),
        ("sistema_web", "Sistema web"),
        ("api", "API / Integración"),
        ("automatizacion", "Automatización"),
        ("agente_ia", "Agente de IA"),
        ("otro", "Otro / No estoy seguro"),
    ]

    nombre = models.CharField(max_length=120)
    empresa = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=40, blank=True)
    servicio = models.CharField(max_length=30, choices=SERVICIOS, blank=True)
    presupuesto = models.CharField(max_length=60, blank=True)
    asunto = models.CharField(max_length=200, blank=True)
    mensaje = models.TextField()
    ip = models.GenericIPAddressField(null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    atendido = models.BooleanField(default=False)

    class Meta:
        ordering = ["-creado"]
        verbose_name = "Lead"
        verbose_name_plural = "Leads"

    def __str__(self):
        return f"{self.nombre} ({self.email}) - {self.creado:%d/%m/%Y}"
