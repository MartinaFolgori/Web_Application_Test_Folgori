document.addEventListener('DOMContentLoaded', () => {

    const modalEl = document.getElementById('bookModal');
    const modal = new bootstrap.Modal(modalEl);
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const addBtn = document.getElementById('addToMyBooksBtn');
    const alreadyMsg = document.getElementById('alreadyInMyBooksMsg');
    const addedSuccessMsg = document.getElementById('addedSuccessMsg');
    const myBooksLink = document.getElementById('myBooksLink');
    const bookCache = {};
    const skeletonHTML = `

        <div class="skeleton skeleton-modal-img mb-3"></div>
        <div class="skeleton skeleton-modal-line"></div>
        <div class="skeleton skeleton-modal-line"></div>
        <div class="skeleton skeleton-modal-line short"></div>
        <div class="skeleton skeleton-modal-line"></div>
        <div class="skeleton skeleton-modal-line"></div>

    `;

    // details btn
    document.addEventListener('click', async e => {

        const btn = e.target.closest('[data-book-id]');

        if (!btn) return;

        const bookId = btn.dataset.bookId;

        modalTitle.textContent = '';
        modalContent.innerHTML = skeletonHTML;

        addBtn.classList.add('d-none');
        alreadyMsg.classList.add('d-none');
        addedSuccessMsg.classList.add('d-none');

        modal.show();

        if (bookCache[bookId]) {

            fillModal(bookId, bookCache[bookId]);

            return;

        }

        const res = await fetch(`/api/book/${bookId}`);
        const data = await res.json();
        const book = data.volumeInfo;

        bookCache[bookId] = book;

        fillModal(bookId, book);

    });

    // modal
    function fillModal(bookId, book) {

        const img =
            book.imageLinks?.large ||
            book.imageLinks?.medium ||
            book.imageLinks?.small ||
            book.imageLinks?.thumbnail?.replace('zoom=1', 'zoom=2') ||
            book.imageLinks?.smallThumbnail?.replace('zoom=1', 'zoom=2') ||
            'https://picsum.photos/300/450';

        const infoLink = book.infoLink || book.canonicalVolumeLink || '#';

        modalContent.style.opacity = 0;

        modalTitle.textContent = book.title;

        modalContent.innerHTML = `
        
            <img src="${img}" class="img-fluid mb-3 rounded shadow-sm" style="max-height: 300px; object-fit: cover;">

            <p><strong>Author:</strong> ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'N/A'}</p>
            <p><strong>Categories:</strong> ${book.categories ? book.categories.join(', ') : 'N/A'}</p>

            <hr>

            <p>${book.description || 'No description available'}</p>

            ${
                infoLink !== '#'
                ? `<a href="${infoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-3">
                        Open in Google Books
                   </a>`
                : ''
            }
        `;

        // data for saving
        addBtn.dataset.book = JSON.stringify({

            id: bookId,
            title: book.title,
            description: book.description || 'No description available',
            thumbnail: img

        });

        // saved
        const myBooks = JSON.parse(localStorage.getItem('mybooks')) || [];
        const exists = myBooks.some(b => b.id === bookId);

        if (exists) {

            addBtn.classList.add('d-none');
            alreadyMsg.innerHTML = `<i class="bi bi-bookmark-check"></i> Saved to MyBooks`;
            alreadyMsg.classList.remove('d-none');

        } else {

            addBtn.classList.remove('d-none');
            alreadyMsg.classList.add('d-none');

        }

        setTimeout(() => {

            modalContent.style.opacity = 1;

        }, 50);

    }

    // mybooks saving
    addBtn.addEventListener('click', () => {

        const raw = addBtn.dataset.book;

        if (!raw) return;

        const bookToAdd = JSON.parse(raw);
        const myBooks = JSON.parse(localStorage.getItem('mybooks')) || [];
        const exists = myBooks.some(b => b.id === bookToAdd.id);

        alreadyMsg.classList.add('d-none');
        addedSuccessMsg.classList.add('d-none');

        if (exists) {

            addBtn.classList.add('d-none');

            alreadyMsg.innerHTML = `<i class="bi bi-bookmark-check"></i> Saved to MyBooks`;
            alreadyMsg.classList.remove('d-none');

            return;

        }

        // book saving
        myBooks.push(bookToAdd);

        localStorage.setItem('mybooks', JSON.stringify(myBooks));

        // success msg
        modalContent.innerHTML = `

            <div class="py-5 text-success fw-bold fs-4">

                <i class="bi bi-check-circle"></i> Book added successfully!

            </div>
        `;

        addBtn.classList.add('d-none');
        alreadyMsg.classList.add('d-none');

        // update mybooks
        if (typeof renderMyBooksPaged === 'function' && typeof getMyBooks === 'function') {

            renderMyBooksPaged(getMyBooks(), 1);

        }

        setTimeout(() => {

            const modal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));

            modal.hide();

        }, 1000);

    });

    // go to MyBooks btn
    document.addEventListener('click', e => {

        const btn = e.target.closest('#goToMyBooksBtn');

        if (!btn) return;

        const modalEl = document.getElementById('bookModal');
        const modal = bootstrap.Modal.getInstance(modalEl);

        modal.hide();

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {

            myBooksLink.click();

        }, 200);

    });

});