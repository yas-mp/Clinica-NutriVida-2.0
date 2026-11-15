# AGENTS.md

## Layout

- `frontend/nutrivida/` — Vite + React 19 + TypeScript SPA. This is the only frontend.
- `backend/usuarios/`, `backend/servicios/`, `backend/reservas/` — three independent Spring Boot Maven projects. There is no parent/aggregator pom, so run Maven inside each module.
- No root build or `package.json`; the root `README.md` is only an image. Ignore root-level `nutrivida/`: it contains no app source, only a gitignored `node_modules`.
- No CI workflows or pre-commit hooks; verification is manual. `.github/modernize/` is unrelated tooling.

## Frontend

Run from `frontend/nutrivida`:

- `npm run dev` — Vite dev server (default port 5173).
- `npm run build` — `tsc -b && vite build`.
- `npm run lint` — ESLint.
- `npm test -- --run` — one-shot Vitest. Plain `npm test` starts Vitest in watch mode.
- Single test: `npm test -- --run src/test/Navbar.test.tsx`.
- On this Windows setup PowerShell blocks `npm.ps1`; use `npm.cmd ...` if `npm` fails with an execution-policy error.

Known pre-existing failures (verified Nov 2026) — do not assume your change caused them:

- `npm run build` fails at `src/components/organismos/FormularioContacto.tsx:60`: `maxLength` is not part of `CorreoProps`.
- `npm run lint` reports 23 existing errors, mostly `@typescript-eslint/no-explicit-any` and `react-hooks/set-state-in-effect`.
- `npm test -- --run` has 1 failing test in `Pago.test.tsx` (duplicate `Ej: Diego Rivas` input). This is caused by missing RTL cleanup, not by the payment logic.

Testing quirks:

- There is no Vitest config or global setup file. Every test opts into jsdom with `//@vitest-environment jsdom` on line 1; keep that comment when adding tests.
- Tests import `test`, `expect`, and `vi` from `vitest` explicitly. `@testing-library/jest-dom` is installed but not wired up, so use `toBeTruthy()` / `checkValidity()`, not `toBeInTheDocument()`.
- React Testing Library auto-cleanup is not registered. Multiple `render()` calls in the same file share the DOM; call `cleanup()` or split tests to avoid the `Pago.test.tsx` failure.

Architecture:

- The frontend is not connected to the backend: no API client, `fetch`, Vite proxy, or `VITE_*` variables. Catalog/professional data is hardcoded in `src/components/data/ListadoServicios.tsx` and `LISTA_PROFESIONALES` in `src/pages/Profesionales.tsx`; app state persists in `localStorage` under `nutrivida_*` keys.
- Components follow atomic design: `src/components/atomos`, `moleculas`, `organismos`; pages live in `src/pages`; routes are in `src/App.tsx`. Naming is Spanish.
- Global styles are in `src/assets/style.css`; Bootstrap CSS/JS is imported in `src/main.tsx`. `src/App.css` is unused.

## Backend

Java 21. Run from each service directory:

- `.\mvnw.cmd spring-boot:run` (PowerShell) or `./mvnw spring-boot:run`
- `.\mvnw.cmd -DskipTests package`
- `.\mvnw.cmd test`

| Module     | Port | Database (MySQL)     | Schema management                                        |
| ---------- | ---- | -------------------- | -------------------------------------------------------- |
| `usuarios` | 8081 | `nutrivida_usuarios` | Flyway, `src/main/resources/data/migration`              |
| `servicios`| 8082 | `nutrivida_servicios`| `spring.jpa.hibernate.ddl-auto=update` (no Flyway)       |
| `reservas` | 8083 | `nutrivida_reservas` | Flyway, `src/main/resources/data/migration`              |

- Local MySQL is assumed at `localhost:3306` with user `root` and an empty password. JDBC URLs use `createDatabaseIfNotExist=true`, so only a running server is required.
- `mvnw test` runs `@SpringBootTest` against that real MySQL datasource. Tests fail when MySQL is not running. The only tests are `contextLoads`.
- `usuarios` and `servicios` compile. `reservas` currently does **not** compile: its `pom.xml` omits `springdoc-openapi-starter-webmvc-ui` and `spring-boot-starter-validation` even though the code imports Swagger annotations and `jakarta.validation`.
- For `usuarios`/`reservas` schema changes, add a new Flyway migration (`V2__*.sql`). `ddl-auto=validate` will fail on entity/schema drift.
- `usuarios` security is permissive: CSRF is disabled and every request is allowed. `POST /api/usuarios/login` only validates credentials and returns the user; there is no token or session.
- DTO packages are `com.clinica.*.Dtos` in `usuarios`/`servicios` but `com.clinica.reservas.dto` in `reservas`.
