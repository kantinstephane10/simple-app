# Simple App

A tiny Java web app built with Spring Boot: a counter page with increment, decrement, and reset buttons.
The counter is scoped per browser session (each visitor gets their own count) and updates happen via
`fetch()` calls to a small JSON API, without reloading the page.

## Endpoints

- `GET /` — the counter page
- `GET /api/counter` — current session's count as JSON
- `POST /api/counter/increment` / `/decrement` / `/reset` — update the session's count
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
