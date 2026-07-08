package app;

import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class CounterState {

    private final AtomicInteger count = new AtomicInteger(0);
    private final AtomicInteger best = new AtomicInteger(0);
    private final AtomicInteger totalClicks = new AtomicInteger(0);

    public synchronized Snapshot increment() {
        totalClicks.incrementAndGet();
        return snapshot(count.incrementAndGet());
    }

    public synchronized Snapshot decrement() {
        totalClicks.incrementAndGet();
        return snapshot(count.decrementAndGet());
    }

    public synchronized Snapshot reset() {
        return snapshot(count.updateAndGet(v -> 0));
    }

    public synchronized Snapshot get() {
        return snapshot(count.get());
    }

    private Snapshot snapshot(int value) {
        best.updateAndGet(current -> Math.max(current, value));
        boolean milestone = value != 0 && value % 10 == 0;
        return new Snapshot(value, best.get(), totalClicks.get(), milestone);
    }

    public record Snapshot(int count, int best, int totalClicks, boolean milestone) {
    }
}
