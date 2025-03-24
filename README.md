# NFLOW - Apoyo Psicológico con IA

Una aplicación web progresiva (PWA) avanzada que proporciona apoyo emocional y bienestar mental a través de experiencias personalizadas e interactivas.

## Características Principales

- Asistente de IA empático y profesional
- Soporte multilingüe completo
- Diario emocional interactivo
- Sistema de créditos de mensajes
- Instalación como PWA en dispositivos móviles
- Diseño responsivo y accesible

## Tecnologías

- Frontend: Next.js con i18n
- Backend: Express
- Base de datos: PostgreSQL
- IA: OpenAI API
- PWA: Service Workers y Web App Manifest

## Configuración del Entorno

1. Clona el repositorio:
```bash
git clone https://github.com/psicoing/nflow-ayuda-psicologica.git
cd nflow-ayuda-psicologica
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Completa todas las variables con tus propias claves y configuraciones

### Obtención de Claves API

#### OpenAI API
1. Ve a [OpenAI API Keys](https://platform.openai.com/account/api-keys)
2. Crea una nueva clave API
3. Copia la clave en `OPENAI_API_KEY` en tu archivo `.env`

#### PayPal
1. Accede a [PayPal Developer](https://developer.paypal.com/)
2. Crea una aplicación en el Sandbox
3. Copia el Client ID y Secret en `PAYPAL_CLIENT_ID` y `PAYPAL_SECRET`

#### Stripe
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copia las claves pública y secreta en `VITE_STRIPE_PUBLIC_KEY` y `STRIPE_SECRET_KEY`
3. Configura un Webhook y copia su secreto en `STRIPE_WEBHOOK_SECRET`

### Configuración de la Base de Datos

La aplicación utiliza PostgreSQL. Asegúrate de tener PostgreSQL instalado y configura las siguientes variables en tu archivo `.env`:

```env
DATABASE_URL=postgres://usuario:contraseña@host:puerto/nombre_db
PGUSER=usuario_postgres
PGHOST=host_postgres
PGPASSWORD=contraseña_postgres
PGDATABASE=nombre_base_datos
PGPORT=5432
```

## Instalación como PWA

La aplicación puede instalarse como una PWA en dispositivos móviles:

### iOS (Safari)
1. Abre NFLOW en Safari
2. Pulsa el botón de compartir
3. Selecciona "Añadir a pantalla de inicio"
4. Pon el nombre que quieras y pulsa "Añadir"

### Android (Chrome)
1. Abre NFLOW en Chrome
2. Toca los tres puntos del menú
3. Selecciona "Añadir a pantalla de inicio"
4. Escribe el nombre y confirma

## Desarrollo

```bash
# Iniciar en modo desarrollo
npm run dev
```

## Seguridad

- Nunca cometas archivos `.env` o cualquier archivo que contenga secretos
- Usa siempre variables de entorno para las claves API
- Revisa regularmente las dependencias en busca de vulnerabilidades con `npm audit`
- Realiza copias de seguridad regulares de la base de datos
- Mantén todas las dependencias actualizadas

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Todos los derechos reservados © 2024 NFLOW