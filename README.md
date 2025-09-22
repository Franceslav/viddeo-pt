# Viddeo
![image](https://github.com/user-attachments/assets/dfca28d0-de2e-42c8-8242-b53963cda461)

# [Tutorial Youtube](https://youtu.be/jjKzw8WPG1A) 📽️

## Descripción

Viddeo es un proyecto desarrollado como parte de una prueba técnica con el objetivo de construir una aplicación funcional de reproducción de videos. Aunque su enfoque principal es cumplir con los requisitos indicados, se han agregado funcionalidades adicionales para mejorar habilidades y explorar nuevas tecnologías. La mayor parte de la lógica se encuentra en el reproductor de video.

## Características Principales

- Listado de videos con opciones para visualizarlos en detalle.
- Página de detalles del video:
  - Reproductor de video.
  - Información del creador del video.
  - Contador de reproducciones.
  - Botón de "like" (disponible solo para usuarios registrados y logueados).
  - Descripción del video.

## Tecnologías Utilizadas

- **Next.js 15**: Framework para aplicaciones React.
- **TailwindCSS**: Estilizado con clases de utilidad.
- **Shadcn**: Componentes para interfaces de usuario consistentes.
- **tRPC**: API type-safe para comunicación entre frontend y backend.
- **TypeScript**: Tipado estático.
- **MongoDB**: Base de datos.
- **Prisma**: ORM para interactuar con la base de datos.
- **Auth.js**: Manejo de autenticación.

## Configuración y Uso

### Requisitos Previos

- Node.js (v18 o superior).
- Cuenta en MongoDB.

### Instrucciones de Configuración

1. Clona el repositorio y navega a la carpeta del proyecto:
   ```bash
   git clone https://github.com/CarlosPProjects/viddeo-pt.git
   cd viddeo
   ```

2. Instala las dependencias:
   ```bash
   npm install --force
   ```

3. Configura las variables de entorno en un archivo `.env`:
   - Genera un secreto para Auth.js:
     ```bash
     npx auth secret
     ```
   - Agrega la URL de tu base de datos de MongoDB.

4. Configura Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Деплой на VPS (PM2)

1. Переменные окружения (пример см. `.env.example`):
   - `DATABASE_URL` (или `MONGODB_URI`)
   - `AUTH_SECRET` (сгенерировать: `npx auth secret`)
   - опционально: `PORT=3000`, `HOST=0.0.0.0`

2. Установка зависимостей и сборка:
   ```bash
   npm ci --omit=dev || npm i --production
   npm run build
   ```

3. Prisma (если используется):
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Запуск через PM2:
   ```bash
   npm i -g pm2
   pm2 start ecosystem.config.cjs --env production
   pm2 save
   pm2 startup
   ```

5. Обновления релиза:
   ```bash
   git pull
   npm ci --omit=dev || npm i --production
   npm run build
   pm2 reload viddeo
   ```

## Estructura de tRPC

Se han implementado los siguientes procedimientos de tRPC:

- **Auth**:
  - Registro y login.
- **Like**:
  - Obtener y crear likes (en base al ID del usuario y el ID del video).
- **User**:
  - Crear usuario, validar contraseña, obtener usuario por ID o email.
- **Video**:
  - Subir videos, listar videos, obtener detalles de un video, incrementar vistas.

## Captura de Pantalla

![Hero](https://github.com/user-attachments/assets/6547108f-2351-474b-b268-1bb6a19d9ea0)

## Diagrama de flujo principal

![Diagram](https://github.com/user-attachments/assets/a29b427e-8525-4196-8a60-699302873ebf)



