export function getMyBooks() {

  return JSON.parse(localStorage.getItem('mybooks')) || [];

}

export function saveMyBooks(list) {

  localStorage.setItem('mybooks', JSON.stringify(list));

}

// render paged list
export function renderMyBooksPaged(list, page = 1, perPage = 9) {

  const row = document.getElementById('myBooksRow');
  const emptyMsg = document.getElementById('myBooksEmptyMsg');

  if (!row || !emptyMsg) return;

  row.innerHTML = '';

  const allBooks = getMyBooks();

  if (allBooks.length === 0) {

    emptyMsg.classList.remove('d-none');

    return;
  }

  emptyMsg.classList.add('d-none');

  if (!list || list.length === 0) {

    row.innerHTML = `

      <div class="col-12 text-center mt-4">

        <p class="text-muted fs-5">No books match your search.</p>

      </div>

    `;

    return;
    
  }

  // pagination
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = list.slice(start, end);

  pageItems.forEach(book => {

    row.insertAdjacentHTML(

      'beforeend', `
      
        <div class="col-12 col-md-4 mb-4">

          <div class="card h-100 shadow-sm">

            <img src="${book.thumbnail}" class="card-img-top" style="height:250px; object-fit:cover;">

            <div class="card-body d-flex flex-column">

              <h5 class="card-title">${book.title}</h5>

              <p class="card-text text-clamp-2">${book.description}</p>

              <button class="btn btn-danger mt-auto removeBookBtn" data-id="${book.id}">

                Remove

              </button>

            </div>

          </div>

        </div>
      `
    );

  });

  setupRemoveButtons();
}

// remove book
function setupRemoveButtons() {

  document.querySelectorAll('.removeBookBtn').forEach(btn => {

    btn.addEventListener('click', () => {

      const id = btn.dataset.id;
      const updated = getMyBooks().filter(b => b.id !== id);

      saveMyBooks(updated);

      const emptyMsg = document.getElementById('myBooksEmptyMsg');
      const row = document.getElementById('myBooksRow');

      if (updated.length === 0) {

        emptyMsg.classList.remove('d-none');

        row.innerHTML = '';

      } else {

        emptyMsg.classList.add('d-none');

        renderMyBooksPaged(updated, 1);

      }

    });

  });

}