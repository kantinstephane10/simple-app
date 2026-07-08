# Simple App

A tiny Java web app built with Spring Boot: a counter page with increment, decrement, and reset buttons.
The counter is scoped per browser session (each visitor gets their own count) and updates happen via
`fetch()` calls to a small JSON API, without reloading the page.

Extras:
- Arrow keys (↑/→ to add, ↓/← to subtract) and `R` to reset, in addition to the buttons
- Session stats: best count reached and total clicks
- A confetti burst and toast every time the count hits a multiple of 10
- The card's glow shifts hue/intensity with the count (green as it climbs, warm as it drops below zero)
- All motion respects `prefers-reduced-motion`

## Endpoints

- `GET /` — the counter page
- `GET /api/counter` — current session's counter state as JSON (`count`, `best`, `totalClicks`, `milestone`)
- `POST /api/counter/increment` / `/decrement` / `/reset` — update the session's counter
- `GET /actuator/health` — health check for load balancers / deployment validation
- `GET /actuator/info` — basic app metadata

## Requirements

- JDK 17 or later
- Maven

## Build & Run

```bash
mvn spring-boot:run
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## Build a runnable jar

```bash
mvn clean package
java -jar target/simple-app-1.0.0.jar
```
