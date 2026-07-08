package app;

import java.time.Instant;

public record ActivityEntry(String counterName, String action, int resultingCount, Instant timestamp) {
}
