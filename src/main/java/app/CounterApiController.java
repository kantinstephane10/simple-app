package app;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/counters")
public class CounterApiController {

    private static final int MAX_NAME_LENGTH = 40;

    private final CounterBoard board;

    public CounterApiController(CounterBoard board) {
        this.board = board;
    }

    @GetMapping
    public List<CounterView> list() {
        return board.list().stream().map(CounterView::of).toList();
    }

    @PostMapping
    public CounterView create(@RequestBody(required = false) CreateCounterRequest request) {
        String rawName = request == null ? null : request.name();
        String name = (rawName == null || rawName.isBlank())
                ? "Counter " + (board.list().size() + 1)
                : validateName(rawName);
        return CounterView.of(board.addCounter(name));
    }

    @PutMapping("/{id}")
    public CounterView rename(@PathVariable String id, @RequestBody RenameCounterRequest request) {
        return CounterView.of(board.rename(id, validateName(request.name())));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        board.removeCounter(id);
    }

    @PostMapping("/{id}/increment")
    public CounterView increment(@PathVariable String id) {
        return CounterView.of(board.increment(id));
    }

    @PostMapping("/{id}/decrement")
    public CounterView decrement(@PathVariable String id) {
        return CounterView.of(board.decrement(id));
    }

    @PostMapping("/{id}/reset")
    public CounterView reset(@PathVariable String id) {
        return CounterView.of(board.reset(id));
    }

    @GetMapping("/activity")
    public List<ActivityEntry> activity() {
        return board.recentActivity();
    }

    private static String validateName(String rawName) {
        if (rawName == null || rawName.isBlank()) {
            throw new IllegalArgumentException("Counter name cannot be blank");
        }
        String trimmed = rawName.trim();
        if (trimmed.length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Counter name must be " + MAX_NAME_LENGTH + " characters or fewer");
        }
        return trimmed;
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    public record CreateCounterRequest(String name) {
    }

    public record RenameCounterRequest(String name) {
    }
}
