# Fire Extinguisher Management System - TZW LTD

National practical exam implementation using NestJS TCP microservices, PostgreSQL, JWT, Swagger, and a React frontend.

## Architecture

- Frontend: React + Vite on `http://127.0.0.1:5173`
- API Gateway: REST API on `http://localhost:3000`
- Auth Service: TCP `3002`
- User Service: TCP `3001`
- Extinguisher Service: TCP `3003`
- Inspection Service: TCP `3004`
- Maintenance Service: TCP `3005`
- Reporting Service: TCP `3006`

The API Gateway exposes REST endpoints under `/api/v1` and forwards requests to services using NestJS TCP microservice clients. Each data-owning service uses its own PostgreSQL database.

## Local Databases

Create these PostgreSQL databases locally:

```sql
CREATE DATABASE fire_mns_user_service_db;
CREATE DATABASE fire_mns_extinguisher_service_db;
CREATE DATABASE fire_mns_inspection_service_db;
CREATE DATABASE fire_mns_maintenance_service_db;
```

Default fallback credentials are:

- host: `localhost`
- port: `5432`
- username: `postgres`
- password: `beni@ish`

You can override them in each service with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=beni@ish
DB_NAME=fire_mns_user_service_db
JWT_SECRET_KEY=fire-exam-secret
MAIL_USER=your-gmail-address@gmail.com
MAIL_APP_PASSWORD=your-gmail-app-password
PASSWORD_RESET_BASE_URL=http://127.0.0.1:5173/create-password
PASSWORD_SETUP_BASE_URL=http://localhost:5173/create-password
```

For forgot-password email, set `MAIL_USER` to the Gmail account that owns the app password and set `MAIL_APP_PASSWORD` to the Gmail app password. If mail credentials are missing, forgot-password still returns `resetToken` in the API response for Swagger/Postman testing.

## Run Order

Use `npm.cmd` on this Windows machine because PowerShell blocks `npm.ps1`.

```powershell
cd backend/user-service; npm.cmd run start:dev
cd backend/auth-service; npm.cmd run start:dev
cd backend/extinguisher-service; npm.cmd run start:dev
cd backend/inspection-service; npm.cmd run start:dev
cd backend/maintenance-service; npm.cmd run start:dev
cd backend/reporting-service; npm.cmd run start:dev
cd backend/api-gateway; npm.cmd run start:dev
cd frontend; npm.cmd run dev -- --host 127.0.0.1
```

Swagger is available at:

```text
http://localhost:3000/api/docs
```

Frontend is available at:

```text
http://127.0.0.1:5173/
```

## Seeded Demo Accounts

Services seed minimal presentation data on first startup.

- Admin: `admin@tzw.test` / `Admin123!`
- Inspector: `inspector@tzw.test` / `Inspector123!`
- User: `user@tzw.test` / `User123!`

Seeded IDs:

- Extinguisher: `44444444-4444-4444-4444-444444444444`
- Inspector: `22222222-2222-2222-2222-222222222222`

## Main Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/setup-password`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/change-password`
- `GET /api/v1/users`
- `POST /api/v1/users/create-inspector`
- `POST /api/v1/extinguishers`
- `GET /api/v1/extinguishers`
- `PUT /api/v1/extinguishers/:id`
- `DELETE /api/v1/extinguishers/:id`
- `POST /api/v1/inspections`
- `GET /api/v1/inspections`
- `POST /api/v1/maintenance`
- `GET /api/v1/maintenance`
- `GET /api/v1/reports/extinguishers`
- `GET /api/v1/reports/inspection-status`
- `GET /api/v1/reports/expired`
- `GET /api/v1/reports/maintenance-history`

## RBAC Onboarding Rules

- Public registration always creates `USER` accounts.
- Public registration does not accept `ADMIN` or `INSPECTOR` roles.
- Seeded admin remains available at `admin@tzw.test` / `Admin123!`.
- Only `ADMIN` users can call `POST /api/v1/users/create-inspector`.
- Created inspectors are `INACTIVE` until they complete `POST /api/v1/auth/setup-password`.
- Inspector invitation tokens are stored hashed, expire, and cannot be reused.

## Verification

Builds passed for:

- `frontend`
- `backend/api-gateway`
- `backend/auth-service`
- `backend/user-service`
- `backend/extinguisher-service`
- `backend/inspection-service`
- `backend/maintenance-service`
- `backend/reporting-service`
