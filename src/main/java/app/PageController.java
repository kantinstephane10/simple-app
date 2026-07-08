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
        CounterState.Snapshot snapshot = counterState.get();
        model.addAttribute("count", snapshot.count());
        model.addAttribute("best", snapshot.best());
        model.addAttribute("totalClicks", snapshot.totalClicks());
        return "index";
    }
}
