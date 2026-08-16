# FR.Sistemas

Landing + backend de leads para FR.Sistemas, el estudio de desarrollo de Franco (diseño y desarrollo web, APIs, automatizaciones, sistemas a medida, agentes de IA). Franco es el fundador — está arrancando la empresa desde cero (sin clientes ni figura legal todavía) y usa este repo como su primer producto real. Claude Code actúa acá como socio técnico y de negocio de forma continua, no solo como ejecutor de tareas puntuales.

## Stack

- Django 6 (`config/`, app única `core/`) + SQLite local.
- Templates server-side (`templates/`), sin frontend framework — CSS custom + GSAP/ScrollTrigger/Lenis por CDN, cursor y preloader custom.
- Sistema de diseño vigente: `static/css/portfolio/{style,site-extra}.css` + `static/css/site/theme.css` + `static/js/portfolio/{script,fallback}.js`. El sistema anterior (`css/base`, `css/layout`, `css/sections`) se eliminó — si ves referencias a esas rutas en algún commit viejo, son legacy.
- `static/portfolio/` es un sitio estático aparte (portfolio conceptual: VOID, ORLA, FORJA, OMBRA, ALTO, NOOR + demos de sistemas a medida), servido tal cual desde `config/urls.py` en `/portfolio/`, sin pasar por templates de Django.
- Variables de entorno en `.env` (no versionado) cargadas con `python-dotenv` en `config/settings.py`: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `EMAIL_HOST_USER/PASSWORD`, `NOTIFY_EMAIL`, `WHATSAPP_PHONE/APIKEY`, `N8N_WEBHOOK_URL`.
- Flujo de leads: el form de contacto (`core/views.py::home`) guarda un `Lead` en la base y además dispara (best-effort, no bloqueante) un webhook a n8n, que se encarga de Sheets, CRM, WhatsApp/email y clasificación del lead.
- Entorno local: `.venv/` (no versionado). Levantar con `.venv/bin/python manage.py runserver`, o con la config de preview en `.claude/launch.json` (`django-dev`).

## Cómo trabajar en este repo

- Franco recién está arrancando como empresa — priorizar una base técnica sólida y confiable antes que features vistosas. Cuando algo es reversible y de bajo riesgo, avanzar directo; cuando toca credenciales, historial de git, o borrar código, confirmar primero.
- El repo (`FRsistemas01/frsistemas` en GitHub) es privado — igual, nunca commitear `.env` ni secretos reales.
- Antes de dar por buena una migración de modelo, correr `python manage.py migrate` de verdad (no alcanza con que `makemigrations --check` no pida nada — eso solo compara modelos contra migraciones, no contra la base real).

## Roadmap / próximos pasos

- [x] Restaurar la configuración de producción (settings, n8n, email/WhatsApp, WhiteNoise) que se había revertido por accidente en el commit `9e721cf`.
- [x] Sacar `.env` del tracking de git y completar el formulario de contacto con `empresa`/`whatsapp`.
- [ ] Decidir si se reescribe el historial de git para borrar el `.env` viejo commiteado, y rotar la contraseña de app de Gmail / API key de WhatsApp que quedaron expuestas en el historial.
- [ ] Definir estrategia de negocio: posicionamiento, oferta de servicios, precios, figura legal (monotributo). Pendiente de charlar con Franco.
- [ ] Deploy real a producción (hoy `DEBUG=True` por defecto y no hay hosting configurado).
