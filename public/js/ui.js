import {

  performSearch,
  loadPage,
  renderSkeletonResults,
  getGoogleMaxResults,
  setGoogleMaxResults

} from '/js/googleBooks.js';

import {

  getMyBooks,
  renderMyBooksPaged
} from '/js/myBooks.js';

export let mode = 'home';

let timer;

// DOM elements
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const clearMyBooksBtn = document.getElementById('clearMyBooksBtn');
const sortAZ = document.getElementById('sortAZ');
const sortZA = document.getElementById('sortZA');
const homeBtn = document.getElementById('homeBtn');
const myBooksLink = document.getElementById('myBooksLink');
const myBooksSearchBtn = document.getElementById('myBooksSearchBtn');
const maxResultsLabel = document.getElementById('maxResultsLabel');
const maxResultsOptions = document.querySelectorAll('.max-results-option');
const resultsInfo = document.getElementById('resultsInfo');
const myBooksTitle = document.getElementById('myBooksTitle');
const myBooksEmptyMsg = document.getElementById('myBooksEmptyMsg');
const pagination = document.getElementById('ajaxPagination');

export function setMode(newMode) {

  mode = newMode;

  if (mode === 'home') {

    homeBtn.classList.add('d-none');
    myBooksSearchBtn.classList.remove('d-none');

    clearSearchBtn.classList.add('d-none');
    clearMyBooksBtn.classList.add('d-none');
    
    resultsInfo.textContent = '';

    myBooksTitle.classList.add('d-none');
    myBooksEmptyMsg.classList.add('d-none');

    pagination.classList.remove('d-none');

    pagination.innerHTML = '';

    document.getElementById('myBooksRow').classList.add('d-none');
    document.getElementById('ajaxRow').classList.remove('d-none');

  }

  if (mode === 'mybooks') {

    homeBtn.classList.remove('d-none');
    myBooksSearchBtn.classList.add('d-none');

    clearSearchBtn.classList.add('d-none');

    resultsInfo.textContent = '';

    myBooksTitle.classList.remove('d-none');

    if (getMyBooks().length === 0) {

      myBooksEmptyMsg.classList.remove('d-none');

    } else {

      myBooksEmptyMsg.classList.add('d-none');

    }

    pagination.classList.add('d-none');

    document.getElementById('ajaxRow').classList.add('d-none');
    document.getElementById('myBooksRow').classList.remove('d-none');

    renderMyBooksPaged(getMyBooks(), 1);

  }
}

// max results
maxResultsOptions.forEach(option => {

  option.addEventListener('click', () => {

    const value = parseInt(option.dataset.value, 10);

    maxResultsLabel.textContent = value;

    setGoogleMaxResults(value);

    if (mode === 'mybooks') {

      renderMyBooksPaged(getMyBooks(), 1);

      return;

    }

    const query = searchInput.value.trim();

    if (query !== '') performSearch();

  });

});

// search
searchInput.addEventListener('input', () => {

  const query = searchInput.value.trim();

  if (mode === 'mybooks') {

    clearSearchBtn.classList.add('d-none');

    return;

  }

  if (query === '') {

    clearSearchBtn.classList.add('d-none');

    resultsInfo.textContent = '';

    return;
  }

  clearSearchBtn.classList.remove('d-none');

  clearTimeout(timer);

  timer = setTimeout(() => {

    performSearch();

  }, 400);

});

// clear search
clearSearchBtn.addEventListener('click', () => {

  searchInput.value = '';

  clearSearchBtn.classList.add('d-none');

  document.getElementById('ajaxRow').innerHTML = '';
  pagination.innerHTML = '';
  resultsInfo.textContent = '';

});

// sort btn
sortAZ.addEventListener('click', () => {

  if (mode === 'home') performSearch('az');
  if (mode === 'mybooks') {

    const list = getMyBooks().sort((a, b) => a.title.localeCompare(b.title));

    renderMyBooksPaged(list, 1);

  }

});

sortZA.addEventListener('click', () => {

  if (mode === 'home') performSearch('za');
  if (mode === 'mybooks') {

    const list = getMyBooks().sort((a, b) => b.title.localeCompare(a.title));

    renderMyBooksPaged(list, 1);

  }

});

// home btn
homeBtn.addEventListener('click', () => {

  setMode('home');

  searchInput.value = '';

  clearSearchBtn.classList.add('d-none');

  document.getElementById('ajaxRow').innerHTML = '';

  pagination.innerHTML = '';

});

// mybooks navbar btn
myBooksLink.addEventListener('click', () => {

  setMode('mybooks');

});

// mybooks btn
myBooksSearchBtn.addEventListener('click', () => {

  setMode('mybooks');

});

// clear mybooks
clearMyBooksBtn.addEventListener('click', () => {

  localStorage.removeItem('mybooks');

  renderMyBooksPaged([], 1);

  myBooksEmptyMsg.classList.remove('d-none');

});