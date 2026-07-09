const booksBody = document.getElementById('books-body');
const emptyState = document.getElementById('empty-state');
const addForm = document.getElementById('add-book-form');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const toast = document.getElementById('toast');

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

function formatPrice(price) {
    return Number(price).toFixed(2);
}

let toastTimeout;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2200);
}

async function api(path, options) {
    const response = await fetch(path, options);
    if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let message = `Request failed: ${response.status}`;
        if (contentType.includes('application/json')) {
            const body = await response.json();
            message = typeof body === 'object' ? Object.values(body).join(', ') : String(body);
        } else {
            const text = await response.text();
            if (text) message = text;
        }
        throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
}

function rowHtml(book) {
    return `
        <tr data-id="${book.id}">
            <td class="col-title">${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${escapeHtml(book.isbn)}</td>
            <td class="col-num">${formatPrice(book.price)}</td>
            <td class="col-num">${book.stock}</td>
            <td>${escapeHtml(book.category || '')}</td>
            <td class="col-actions">
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn">Delete</button>
            </td>
        </tr>
    `;
}

function renderBooks(books) {
    booksBody.innerHTML = books.map(rowHtml).join('');
    emptyState.hidden = books.length > 0;
}

async function loadBooks(search) {
    const query = search ? `?q=${encodeURIComponent(search)}` : '';
    const books = await api(`/api/books${query}`);
    renderBooks(books);
}

addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(addForm);
    const payload = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        isbn: formData.get('isbn').trim(),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category').trim() || null,
    };
    try {
        await api('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        addForm.reset();
        showToast(`Added "${payload.title}"`);
        loadBooks(searchInput.value.trim());
    } catch (err) {
        showToast(err.message);
    }
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loadBooks(searchInput.value.trim());
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    loadBooks();
});

booksBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    const id = row.dataset.id;

    if (event.target.closest('.delete-btn')) {
        if (!confirm('Delete this book?')) return;
        api(`/api/books/${id}`, { method: 'DELETE' })
            .then(() => {
                showToast('Book deleted');
                loadBooks(searchInput.value.trim());
            })
            .catch((err) => showToast(err.message));
    } else if (event.target.closest('.edit-btn')) {
        startEdit(row);
    }
});

function startEdit(row) {
    const id = row.dataset.id;
    const cells = row.querySelectorAll('td');
    const current = {
        title: cells[0].textContent,
        author: cells[1].textContent,
        isbn: cells[2].textContent,
        price: cells[3].textContent,
        stock: cells[4].textContent,
        category: cells[5].textContent,
    };

    row.innerHTML = `
        <td><input type="text" class="edit-title" value="${escapeHtml(current.title)}" maxlength="255"></td>
        <td><input type="text" class="edit-author" value="${escapeHtml(current.author)}" maxlength="255"></td>
        <td><input type="text" class="edit-isbn" value="${escapeHtml(current.isbn)}" maxlength="32"></td>
        <td><input type="number" class="edit-price" value="${current.price}" step="0.01" min="0"></td>
        <td><input type="number" class="edit-stock" value="${current.stock}" step="1" min="0"></td>
        <td><input type="text" class="edit-category" value="${escapeHtml(current.category)}" maxlength="100"></td>
        <td class="col-actions">
            <button type="button" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
        </td>
    `;

    row.querySelector('.save-btn').addEventListener('click', async () => {
        const payload = {
            title: row.querySelector('.edit-title').value.trim(),
            author: row.querySelector('.edit-author').value.trim(),
            isbn: row.querySelector('.edit-isbn').value.trim(),
            price: Number(row.querySelector('.edit-price').value),
            stock: Number(row.querySelector('.edit-stock').value),
            category: row.querySelector('.edit-category').value.trim() || null,
        };
        try {
            await api(`/api/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            showToast('Book updated');
            loadBooks(searchInput.value.trim());
        } catch (err) {
            showToast(err.message);
        }
    });

    row.querySelector('.cancel-btn').addEventListener('click', () => {
        loadBooks(searchInput.value.trim());
    });
}

loadBooks();
