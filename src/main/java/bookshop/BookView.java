package bookshop;

import java.math.BigDecimal;

public record BookView(Long id, String title, String author, String isbn, BigDecimal price, int stock, String category) {

    static BookView of(Book book) {
        return new BookView(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getPrice(),
                book.getStock(),
                book.getCategory()
        );
    }
}
