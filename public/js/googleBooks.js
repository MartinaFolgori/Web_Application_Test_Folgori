export let lastGoogleResults = [];

let googleMaxResults = 15;

export function getGoogleMaxResults() {

  return googleMaxResults;

}

export function setGoogleMaxResults(value) {

  googleMaxResults = value;

}

// skeleton loader
export function renderSkeletonResults() {

  const row = document.getElementById('ajaxRow');
  const myBooksRow = document.getElementById('myBooksRow');

  if (!row || !myBooksRow) return;

  row.classList.remove('d-none');
  myBooksRow.classList.add('d-none');

  const skeleton = [];

  for (let i = 0; i < 6; i++) {
  skeleton.push(`

    <div class="col-12 col-md-4 mb-4">

      <div class="skeleton-card">

        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>

      </div>
      
    </div>

  `);

  }

  row.innerHTML = skeleton.join('');

  const prev = document.getElementById('paginationPrevious');
  const nums = document.getElementById('paginationNumbers');
  const next = document.getElementById('paginationNext');

  if (prev && nums && next) {

    prev.innerHTML = '';
    nums.innerHTML = '';
    next.innerHTML = '';

  }

}

// render card
export function renderGoogleBookCard(book) {

  const thumbnail = book.volumeInfo.imageLinks?.thumbnail?.replace('zoom=1', 'zoom=2') || 'https://picsum.photos/200/300';

  const description = book.volumeInfo.description || 'No description available';

  return `

    <div class="col-12 col-md-4 mb-4">

      <div class="card h-100 shadow-sm">

        <img src="${thumbnail}" class="card-img-top" style="height: 250px; object-fit: cover;">

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${book.volumeInfo.title}</h5>

          <p class="card-text text-clamp-2">${description}</p>
          
          <button class="btn btn-outline-primary w-100 mt-auto" data-bs-toggle="modal" data-bs-target="#bookModal" data-book-id="${book.id}">
          
            Details

          </button>

        </div>

      </div>

    </div>

  `;

}

// update results
export function updateResults(books, totalItems, page, maxResults, query) {

  const row = document.getElementById('ajaxRow');
  const myBooksRow = document.getElementById('myBooksRow');
  const resultsInfo = document.getElementById('resultsInfo');

  if (!row || !myBooksRow) return;

  if (!books || books.length === 0) {

    row.classList.remove('d-none');
    myBooksRow.classList.add('d-none');

    row.innerHTML = `

      <div class="col-12 text-center mt-4">

        <p class="text-muted fs-5">No results found for this search.</p>
        
      </div>

    `;

    if (resultsInfo) resultsInfo.textContent = '';

    return;

  }

  if (resultsInfo) {
    
    const count = books.length;

    resultsInfo.textContent = `Showing ${count} results (page ${page})`;

  }

  row.classList.remove('d-none');

  myBooksRow.classList.add('d-none');

  row.innerHTML = '';

  books.forEach(book => {

    row.insertAdjacentHTML('beforeend', renderGoogleBookCard(book));
    
  });

  updateSortButtonsForGoogle();
  buildPagination(totalItems, maxResults, page, query);

}

// pagination
export function buildPagination(totalItems, maxResults, page, query) {

  const totalPages = Math.ceil(totalItems / maxResults);
  const prevContainer = document.getElementById('paginationPrevious');
  const numbersContainer = document.getElementById('paginationNumbers');
  const nextContainer = document.getElementById('paginationNext');

  if (!prevContainer || !numbersContainer || !nextContainer) return;

  prevContainer.innerHTML = '';
  numbersContainer.innerHTML = '';
  nextContainer.innerHTML = '';

  if (page > 1) {

    prevContainer.innerHTML = `

      <button class="btn btn-outline-dark" data-page="${page - 1}">

        <i class="bi bi-arrow-left-circle"></i> Previous

      </button>

    `;

  }

  numbersContainer.insertAdjacentHTML('beforeend', `

    <button class="btn btn-outline-secondary ${page === 1 ? 'active' : ''}" data-page="1">

      1

    </button>

  `);

  const windowSize = 5;
  const startPage = Math.max(2, page - Math.floor(windowSize / 2));
  const endPage = Math.min(totalPages - 1, page + Math.floor(windowSize / 2));

  if (startPage > 2) {

    numbersContainer.insertAdjacentHTML('beforeend', `<span class="px-2">...</span>`);

  }

  for (let i = startPage; i <= endPage; i++) {

    numbersContainer.insertAdjacentHTML('beforeend', `

      <button class="btn btn-outline-secondary ${i === page ? 'active' : ''}" data-page="${i}">

        ${i}

      </button>

    `);

  }

  if (endPage < totalPages - 1) {

    numbersContainer.insertAdjacentHTML('beforeend', `<span class="px-2">...</span>`);

  }

  if (totalPages > 1) {

    numbersContainer.insertAdjacentHTML('beforeend', `

      <button class="btn btn-outline-secondary ${page === totalPages ? 'active' : ''}" data-page="${totalPages}">

        ${totalPages}

      </button>

    `);

  }

  if (page < totalPages) {

    nextContainer.innerHTML = `

      <button class="btn btn-outline-dark" data-page="${page + 1}">

        Next <i class="bi bi-arrow-right-circle"></i>

      </button>

    `;

  }

  document.querySelectorAll('#ajaxPagination button').forEach(btn => {

    btn.addEventListener('click', () => {

      const newPage = parseInt(btn.dataset.page, 10);

      loadPage(query, newPage, maxResults);

      window.scrollTo({ top: 0, behavior: 'smooth' });

    });

  });

}

// load page
export async function loadPage(query, page, maxResults) {

  const url = `/api/search?q=${encodeURIComponent(query)}&page=${page}&maxResults=${maxResults}`;

  renderSkeletonResults();

  try {

    const response = await fetch(url);
    const data = await response.json();
    const items = data.items || [];
    const totalItems = data.totalItems || items.length;

    updateResults(

      items,
      totalItems,
      page,
      maxResults,
      query

    );

  } catch (error) {

    console.error('Pagination AJAX error:', error);

  }

}

// perform search
export function performSearch(sortOrder = '') {

  const query = document.getElementById('searchInput').value.trim();

  if (!query) return;

  const url = `/api/search?q=${encodeURIComponent(query)}&page=1&maxResults=${googleMaxResults}` + (sortOrder ? `&sort=${sortOrder}` : '');

  renderSkeletonResults();

  fetch(url)
    .then(res => res.json())
    .then(data => {

      const items = data.items || [];
      const totalItems = data.totalItems || items.length;

      lastGoogleResults = items;

      updateResults(

        items,
        totalItems,
        1,
        googleMaxResults,
        query

      );

    })
    .catch(err => console.error('Search error:', err));
}

function updateSortButtonsForGoogle() {

  const sortAZ = document.getElementById('sortAZ');
  const sortZA = document.getElementById('sortZA');
  const row = document.getElementById('ajaxRow');

  if (!sortAZ || !sortZA || !row) return;

  const cards = row.querySelectorAll('.card');

  if (cards.length > 1) {

    sortAZ.classList.remove('d-none');
    sortZA.classList.remove('d-none');

  } else {

    sortAZ.classList.add('d-none');
    sortZA.classList.add('d-none');

  }

}