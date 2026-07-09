# Bookshop App

A small book inventory app: add, edit, search, and delete books. Built with Spring Boot,
Spring Data JPA, and Flyway-managed schema migrations, backed by MySQL in production
(RDS) and an in-memory H2 database (in MySQL-compatibility mode, so the same migrations
and dialect apply) for local development.

## Endpoints

- `GET /` — the catalog UI
- `GET /api/books` — list books (optional `?q=` search by title/author)
- `GET /api/books/{id}` — get one book
- `POST /api/books` — create a book (JSON body: `title`, `author`, `isbn`, `price`, `stock`, `category`)
- `PUT /api/books/{id}` — update a book
- `DELETE /api/books/{id}` — delete a book
- `GET /actuator/health` — health check
- `GET /swagger-ui.html` — interactive API docs (OpenAPI)

## Local development

Requires JDK 17 and Maven. No database setup needed — the `dev` profile (active by
default) uses an in-memory H2 database.

```bash
mvn spring-boot:run
```

Open [http://localhost:5000](http://localhost:5000). The app listens on port 5000 by
default (override with the `PORT` env var) — this matches what Elastic Beanstalk's
Corretto platform expects in production, so there's no port mismatch between local dev
and the deployed environment.

## Production configuration

The `prod` profile (activate via `SPRING_PROFILES_ACTIVE=prod`) expects these
environment variables — none of which are ever committed to source:

| Variable | Example |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<rds-endpoint>:3306/bookshop` |
| `SPRING_DATASOURCE_USERNAME` | from RDS master credentials (Secrets Manager) |
| `SPRING_DATASOURCE_PASSWORD` | from RDS master credentials (Secrets Manager) |

Flyway runs automatically on startup and manages the schema — no manual `CREATE TABLE`
step required against RDS. See `src/main/resources/db/migration/`.

## Build a runnable jar

```bash
mvn clean package
java -jar target/bookshop-app-1.0.0.jar
```

## CI/CD

`buildspec.yml` runs the Maven build and test suite, then an OWASP Dependency-Check
scan (fails the build on any dependency with a known CVE at CVSS ≥ 9), then packages
`app.jar` + `Procfile` for deployment to Elastic Beanstalk. See the pipeline for the
full source → build/scan → manual approval → deploy flow.
