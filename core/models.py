from django.db import models


class Lead(models.Model):
    """Mensaje de contacto enviado desde la landing de FR.Sistemas."""

    nombre = models.CharField(max_length=120)
    email = models.EmailField()
    asunto = models.CharField(max_length=200, blank=True)
    mensaje = models.TextField()
    creado = models.DateTimeField(auto_now_add=True)
    atendido = models.BooleanField(default=False)

    class Meta:
        ordering = ["-creado"]
        verbose_name = "Lead"
        verbose_name_plural = "Leads"

    def __str__(self):
        return f"{self.nombre} ({self.email}) - {self.creado:%d/%m/%Y}"
