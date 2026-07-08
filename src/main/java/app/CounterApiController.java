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
    public CounterResponse get() {
        return new CounterResponse(counterState.get());
    }

    @PostMapping("/increment")
    public CounterResponse increment() {
        return new CounterResponse(counterState.increment());
    }

    @PostMapping("/decrement")
    public CounterResponse decrement() {
        return new CounterResponse(counterState.decrement());
    }

    @PostMapping("/reset")
    public CounterResponse reset() {
        return new CounterResponse(counterState.reset());
    }

    public record CounterResponse(int count) {
    }
}
