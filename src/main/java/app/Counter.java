package app;

public class Counter {

    private final String id;
    private String name;
    private int count;
    private int best;
    private int totalClicks;

    public Counter(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public void rename(String newName) {
        this.name = newName;
    }

    public void increment() {
        count++;
        totalClicks++;
        best = Math.max(best, count);
    }

    public void decrement() {
        count--;
        totalClicks++;
        best = Math.max(best, count);
    }

    public void reset() {
        count = 0;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCount() {
        return count;
    }

    public int getBest() {
        return best;
    }

    public int getTotalClicks() {
        return totalClicks;
    }
}
