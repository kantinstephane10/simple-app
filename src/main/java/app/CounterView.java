package app;

public record CounterView(String id, String name, int count, int best, int totalClicks, boolean milestone) {

    static CounterView of(Counter counter) {
        boolean milestone = counter.getCount() != 0 && counter.getCount() % 10 == 0;
        return new CounterView(
                counter.getId(),
                counter.getName(),
                counter.getCount(),
                counter.getBest(),
                counter.getTotalClicks(),
                milestone
        );
    }
}
