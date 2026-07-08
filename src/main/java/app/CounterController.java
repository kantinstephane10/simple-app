package app;

import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CounterController {

    private final AtomicInteger count = new AtomicInteger(0);

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("count", count.get());
        return "index";
    }

    @PostMapping("/increment")
    public String increment() {
        count.incrementAndGet();
        return "redirect:/";
    }

    @PostMapping("/decrement")
    public String decrement() {
        count.decrementAndGet();
        return "redirect:/";
    }

    @PostMapping("/reset")
    public String reset() {
        count.set(0);
        return "redirect:/";
    }
}
