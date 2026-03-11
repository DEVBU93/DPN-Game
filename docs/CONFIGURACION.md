## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend copiando `.env.example`:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (Prisma) | `postgresql://user:pass@localhost:5432/devbudb` |
| `JWT_SECRET` | Secreto para firma de tokens JWT (mín. 32 chars) | `mi-secreto-super-seguro-en-produccion` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `PORT` | Puerto del servidor backend | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:5173` |

### Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar base de datos
docker-compose up -d postgres

# 3. Aplicar migraciones y seed
npx prisma migrate dev
npx prisma db seed

# 4. Iniciar en desarrollo
npm run dev

# 5. Verificar API
curl http://localhost:3001/health
```

### Docker Compose

```bash
# Levantar todo (backend + frontend + DB)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar todo
docker-compose down
```

### Usuarios Demo

| Rol | Email | Password |
|---|---|---|
| Admin | `admin@devbuplaytime.com` | `Admin123!` |
| Usuario | `demo@devbuplaytime.com` | `User123!` |

### Puertos

| Servicio | Puerto |
|---|---|
| Frontend (Vite) | `:5173` |
| Backend (API) | `:3001` |
| Swagger / Docs | `:3001/api-docs` |
| PostgreSQL | `:5432` |
