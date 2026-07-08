package app;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    private final CounterState counterState;

    public PageController(CounterState counterState) {
        this.counterState = counterState;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("count", counterState.get());
        return "index";
    }
}
