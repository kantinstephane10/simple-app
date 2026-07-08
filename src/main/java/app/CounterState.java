package app;

import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class CounterState {

    private final AtomicInteger count = new AtomicInteger(0);

    public int get() {
        return count.get();
    }

    public int increment() {
        return count.incrementAndGet();
    }

    public int decrement() {
        return count.decrementAndGet();
    }

    public int reset() {
        count.set(0);
        return count.get();
    }
}
