package bookshop;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
public class BookApiController {

    private final BookService service;

    public BookApiController(BookService service) {
        this.service = service;
    }

    @GetMapping
    public List<BookView> list(@RequestParam(required = false) String q) {
        return service.findAll(q).stream().map(BookView::of).toList();
    }

    @GetMapping("/{id}")
    public BookView get(@PathVariable Long id) {
        return BookView.of(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookView create(@Valid @RequestBody BookRequest request) {
        return BookView.of(service.create(request));
    }

    @PutMapping("/{id}")
    public BookView update(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return BookView.of(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
