# Simple App

A small multi-counter dashboard built with Spring Boot. Add as many named counters as you like,
each tracked independently; every action shows up in an activity feed underneath. The counters
live in your browser session (each visitor gets their own board) and all updates happen via
`fetch()` calls to a JSON API — no page reloads.

Extras:
- Add/remove named counters from the dashboard (at least one always stays)
- Double-click a counter's name to rename it
- Activity feed of recent actions across all counters, with relative timestamps
- Arrow keys (↑/→ to add, ↓/← to subtract) and `R` to reset the last counter you touched
- Session stats per counter: best value reached and total clicks
- A confetti burst and toast whenever a counter hits a multiple of 10
- Each card's glow shifts hue/intensity with its count (green as it climbs, warm as it drops below zero)
- Manual light/dark theme toggle (persisted in `localStorage`), on top of following the OS by default
- An [/about](src/main/resources/templates/about.html) page with shortcuts and tech stack info
- Interactive API docs via Swagger UI
- All motion respects `prefers-reduced-motion`

## Endpoints

- `GET /` — the dashboard
- `GET /about` — about page
- `GET /api/counters` — all counters in the session as JSON
- `POST /api/counters` — create a counter (JSON body `{"name": "..."}`, name optional)
- `PUT /api/counters/{id}` — rename a counter (JSON body `{"name": "..."}`, required, ≤ 40 chars)
- `DELETE /api/counters/{id}` — remove a counter (fails with 409 if it's the last one)
- `POST /api/counters/{id}/increment` / `/decrement` / `/reset` — update a counter
- `GET /api/counters/activity` — recent activity log
- `GET /actuator/health` — health check for load balancers / deployment validation
- `GET /actuator/info` — basic app metadata
- `GET /swagger-ui.html` — interactive API docs (OpenAPI)

## Requirements

- JDK 17 or later
- Maven

## Build & Run

```bash
mvn spring-boot:run
```

Then open [http://localhost:5000](http://localhost:5000) in your browser (the app listens on 5000 by
default; set the `PORT` environment variable to override).

## Build a runnable jar

```bash
mvn clean package
java -jar target/simple-app-1.0.0.jar
```
