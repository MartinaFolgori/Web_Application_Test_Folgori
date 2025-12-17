const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// statics
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

// home
app.get('/', (req, res) => {res.render('index', {

    books: [],
    totalItems: 0,
    maxResults: 12,
    page: 1,
    query: ''

  });

});


// detail (se non lo usi più puoi anche toglierlo, ma non dà fastidio)
app.get('/detail/:id', (req, res) => {
  res.render('detail', { id: req.params.id });
});

// book detail API
app.get('/api/book/:id', async (req, res) => {

  const bookId = req.params.id;

  try {

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Error loading book" });

  }

});

// search API
app.get('/api/search', async (req, res) => {

  const query = req.query.q || '';
  const page = parseInt(req.query.page) || 1;

  if (!query) {

    return res.json({

      items: [],
      totalItems: 0

    });

  }

  // dynamic results
  let maxResults = parseInt(req.query.maxResults) || 10;

  if (![5, 10, 15, 20].includes(maxResults)) {

    maxResults = 10;

  }

  const startIndex = (page - 1) * maxResults;
  const url =
    `https://www.googleapis.com/books/v1/volumes` +
    `?q=${encodeURIComponent(query)}` +
    `&startIndex=${startIndex}` +
    `&maxResults=${maxResults}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    // no results available
    if (!data.items) {

      return res.json({

        items: [],
        totalItems: 0

      });

    }

    // sorting az
    if (req.query.sort === 'az') {

      data.items.sort((a, b) =>

        a.volumeInfo.title.localeCompare(b.volumeInfo.title)

      );
    }

    // sorting za
    if (req.query.sort === 'za') {

      data.items.sort((a, b) =>

        b.volumeInfo.title.localeCompare(a.volumeInfo.title)

      );
    }

    // final response
    res.json({

      items: data.items,
      totalItems: data.totalItems

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Search error" });

  }
});

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);

});