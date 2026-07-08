package app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/counter")
public class CounterApiController {

    private final CounterState counterState;

    public CounterApiController(CounterState counterState) {
        this.counterState = counterState;
    }

    @GetMapping
    public CounterState.Snapshot get() {
        return counterState.get();
    }

    @PostMapping("/increment")
    public CounterState.Snapshot increment() {
        return counterState.increment();
    }

    @PostMapping("/decrement")
    public CounterState.Snapshot decrement() {
        return counterState.decrement();
    }

    @PostMapping("/reset")
    public CounterState.Snapshot reset() {
        return counterState.reset();
    }
}
