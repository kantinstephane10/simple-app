package app;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class CounterBoard {

    private static final int MAX_ACTIVITY = 20;

    private final Map<String, Counter> counters = new LinkedHashMap<>();
    private final Deque<ActivityEntry> activity = new ArrayDeque<>();

    public CounterBoard() {
        addCounter("Counter 1");
    }

    public synchronized List<Counter> list() {
        return new ArrayList<>(counters.values());
    }

    public synchronized Counter addCounter(String name) {
        Counter counter = new Counter(UUID.randomUUID().toString(), name);
        counters.put(counter.getId(), counter);
        log(counter.getName(), "Created", counter.getCount());
        return counter;
    }

    public synchronized void removeCounter(String id) {
        if (counters.size() <= 1) {
            throw new IllegalStateException("At least one counter is required");
        }
        Counter removed = counters.remove(id);
        if (removed == null) {
            throw new NoSuchElementException("Unknown counter: " + id);
        }
        log(removed.getName(), "Removed", 0);
    }

    public synchronized Counter increment(String id) {
        Counter counter = require(id);
        counter.increment();
        log(counter.getName(), "+1", counter.getCount());
        return counter;
    }

    public synchronized Counter decrement(String id) {
        Counter counter = require(id);
        counter.decrement();
        log(counter.getName(), "-1", counter.getCount());
        return counter;
    }

    public synchronized Counter reset(String id) {
        Counter counter = require(id);
        counter.reset();
        log(counter.getName(), "Reset", counter.getCount());
        return counter;
    }

    public synchronized Counter rename(String id, String newName) {
        Counter counter = require(id);
        String previousName = counter.getName();
        counter.rename(newName);
        log(previousName + " -> " + newName, "Renamed", counter.getCount());
        return counter;
    }

    public synchronized List<ActivityEntry> recentActivity() {
        return new ArrayList<>(activity);
    }

    private Counter require(String id) {
        Counter counter = counters.get(id);
        if (counter == null) {
            throw new NoSuchElementException("Unknown counter: " + id);
        }
        return counter;
    }

    private void log(String name, String action, int result) {
        activity.addFirst(new ActivityEntry(name, action, result, Instant.now()));
        while (activity.size() > MAX_ACTIVITY) {
            activity.removeLast();
        }
    }
}
