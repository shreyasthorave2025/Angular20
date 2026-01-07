# Copilot / AI agent instructions — DatingApp (root)

## Quick orientation 🚀
- Fullstack repo: **frontend** in `client/` (Angular v20 — standalone components, signals) and **backend** in `API/` (.NET 9 with controllers + EF Core).
- Communication: frontend calls the API under `/api` (base URL configured in `client/src/environments/*`, default `https://localhost:5001/api/`).
- DB: SQLite by default (connection string `DefaultConnection` in `API/appsettings*.json`).

---

## Run & debug (concrete commands) 🔧
- Backend (API):
  - Start: from repo root `cd API && dotnet run` (Program auto-applies EF migrations and seeds on startup).
  - Manual EF: `dotnet ef migrations add <Name> --project API --startup-project API` and `dotnet ef database update --project API --startup-project API`.
  - Note: **TokenKey** must exist and be ≥ 64 chars (set in `appsettings.Development.json` or environment variable `TokenKey`).
  - CORS origins are set in `Program.cs` — ensure `http://localhost:4200` is allowed when running locally.
- Frontend (client):
  - Start dev server: `cd client && npm install && ng serve` (app at `http://localhost:4200/`).
  - Build: `cd client && ng build`.
- Tests: `cd client && ng test` (Karma). There is no dedicated backend test project.

---

## Big-picture architecture & design decisions 🔁
- Backend: small API controllers call repositories (repository pattern) and map to DTOs — avoid returning EF entities directly.
  - DbContext: `API/Data/AppDbContext.cs`.
  - Member repository: `API/Data/MemberRepository.cs` (interface `IMemberRepository`).
  - Seed data lives in `API/Data/Seed.cs` and `API/Data/UserSeedData.json`.
- Frontend: Angular v20 using **signals** for local state (`signal()`), `computed()` for derived state, and `inject()`-based DI (prefer over constructors).
  - Components are standalone and use `ChangeDetectionStrategy.OnPush`.
- Auth & security:
  - Endpoints: `POST api/account/register` and `POST api/account/login` (see `API/Controllers/AccountController.cs`).
  - `TokenService` (`API/Services/TokenService.cs`) generates JWTs; client attaches token via `client/src/core/interceptors/jwt-interceptor.ts`.
- Error handling: global middleware `API/Middleware/ExceptionMiddleware.cs`. Client expects model-state errors under `error.error.errors` and routes 500 errors to `/server-error` (see `client/src/core/interceptors/error-interceptor.ts`).

---

## Project-specific conventions & patterns ✅
- Angular:
  - Use **standalone components** (the project is built this way) and **do not** add `standalone: true` — it's the default for new components.
  - Prefer `signal()` for local component state and `computed()` for derived values.
  - Use the `inject()` function for DI rather than constructor injection in new code.
  - Use `ChangeDetectionStrategy.OnPush` and `NgOptimizedImage` for static images.
  - Prefer Reactive Forms over template-driven forms.
  - Avoid `@HostListener`/`@HostBinding` — use the `host` object in decorators instead.
- Backend/API:
  - New controllers should inherit `BaseApiController` for consistent routing and behaviors.
  - Prefer DTOs and repository calls; add migrations and keep DB seeding idempotent.

---

## Integration & hotspots to inspect 🕵️‍♀️
- Auth: `API/Services/TokenService.cs`, `API/Controllers/AccountController.cs`, `client/src/core/interceptors/jwt-interceptor.ts`.
- Errors: `API/Middleware/ExceptionMiddleware.cs`, `client/src/core/interceptors/error-interceptor.ts`.
- Seed/Migrations: `API/Data/Seed.cs`, `API/Migrations/*`.
- Repositories: `API/Data/MemberRepository.cs`, `API/Interfaces/IMemberRepository.cs`.
- Notable TODO: `client/src/core/services/member-service.ts` — `getMemberPhotos()` is unimplemented (call `GET api/members/{memberId}/photos`).

---

## Common pitfalls & debugging tips ⚠️
- 401 errors: verify client sends `Authorization` header (see `jwt-interceptor.ts`), ensure `TokenKey` is set and ≥ 64 chars, and CORS includes the client origin.
- If migrations are out of sync: run `dotnet ef database update` or restart the API (it runs migrations on startup).
- When returning validation errors from the API, put them under the standard model state structure so the client interceptor can flatten them (`error.error.errors`).

---

## PR & change guidance ✍️
- Keep PRs small and focused. If you add schema changes include an EF migration + note about running `dotnet ef` or that migrations run on startup.
- Add manual test steps (how to exercise the change in the UI and API). Mention any required env vars (e.g., `TokenKey`).

---

If anything here looks off or you'd like me to add short code examples (controller template, DTO, or a small Angular signal-based component), say which area to expand and I'll iterate. ✅
