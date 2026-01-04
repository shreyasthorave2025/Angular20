# Copilot / AI agent instructions — DatingApp (root)

Quick orientation
- Fullstack repo: frontend in `client/` (Angular v20, standalone components, signals) and backend in `API/` (.NET 9, controllers + EF Core). The client talks to the API at `https://localhost:5001/api/` by default (see `client/src/environments/*`).

How to run locally
- Backend (API):
  - From repository root: `cd API` then `dotnet run` (Program auto-applies EF migrations & seeds on startup).
  - Manual EF work: `dotnet ef migrations add <Name> --project API --startup-project API` and `dotnet ef database update --project API --startup-project API`.
- Frontend (client):
  - `cd client` then `npm install` and `ng serve` (dev server at `http://localhost:4200/`).
  - Build: `ng build`.
- Tests: `ng test` (Karma) for client. No dedicated backend test project exists in this repo.

Key integration points & patterns (be concrete)
- Auth flow:
  - Endpoints: `POST api/account/register`, `POST api/account/login` (see `API/Controllers/AccountController.cs`).
  - Login/registration return a `UserDto` (see `API/DTOs/UserDto.cs`) containing a JWT token. The token must be attached as `Authorization: Bearer <token>` — client interceptor at `client/src/core/interceptors/jwt-interceptor.ts` does this.
  - Token generation is in `API/Services/TokenService.cs`. **TokenKey** is read from `API/appsettings.Development.json` and must be at least 64 characters (service throws otherwise).
- Data layer:
  - EF Core DbContext: `API/Data/AppDbContext.cs`. Entities live in `API/Entities/` and DTOs in `API/DTOs/`.
  - Repository pattern used for members: `IMemberRepository` + `MemberRepository` (see `API/Data/MemberRepository.cs`). Controllers call repositories via dependency injection.
  - Seeding: `API/Data/Seed.cs` reads `API/Data/UserSeedData.json` and creates users/members.
- Error handling:
  - Global exception middleware: `API/Middleware/ExceptionMiddleware.cs`. It returns a camelCased `ApiException` (stack trace only in Development).
  - Client error parsing is in `client/src/core/interceptors/error-interceptor.ts`. It expects model-state errors under `error.error.errors` for 400, routes 500 to `/server-error` with navigation state.

Client-side conventions & examples
- Angular patterns used throughout:
  - Standalone components and `inject()`-based DI (avoid constructor injection in new code).
  - Use `signal()` for component state and `computed()` for derived state.
  - Use Reactive forms over template-driven forms where applicable.
  - Use `ChangeDetectionStrategy.OnPush` for components (existing code follows this pattern).
  - Use `NgOptimizedImage` for static images.
- HTTP & services:
  - Base API URL is in `client/src/environments/*` and typically points to `https://localhost:5001/api/`.
  - Interceptors are used for JWT and error handling (see `client/src/core/interceptors/*`).
- Example TODO present: `client/src/core/services/member-service.ts` has an unimplemented `getMemberPhotos()` — use `GET api/members/{memberId}/photos`.

Common developer tasks & pitfalls
- If you see `401 Unauthorized`:
  - Confirm the client sends `Authorization` header (check `jwt-interceptor.ts`), ensure `TokenKey` is configured and long enough, and CORS includes `http://localhost:4200` (see `API/Program.cs`).
- For DB schema changes: add EF migration (`dotnet ef migrations add ...`) and update DB or just run `dotnet run` to allow automatic migrations during startup (be mindful of environment).
- When adding controllers: inherit `BaseApiController` for consistent routing (`[Route("api/[controller]")]`).

Files to inspect for concrete examples
- API: `API/Program.cs`, `API/Services/TokenService.cs`, `API/Data/Seed.cs`, `API/Controllers/*`, `API/DTOs/*`, `API/Entities/*`.
- Client: `client/src/environments/*`, `client/src/core/interceptors/*`, `client/src/core/services/*`, `client/src/features/*` (members, account, errors).

Style guidance for AI edits (be specific to repo)
- Follow existing patterns — when adding endpoints prefer DTOs and repository calls rather than exposing EF entities directly.
- Use `inject()` and signals for new Angular code; follow current file conventions (single responsibility, small components, reactive forms).
- Prefer small, focused PRs: include a simple behavioral test (manual repro steps) and a note about any DB migrations.

If anything here is unclear or you want extra examples (e.g., a sample controller PR, or a small client feature implemented), tell me which area to expand and I'll iterate. ✅