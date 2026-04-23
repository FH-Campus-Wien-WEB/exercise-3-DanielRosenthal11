const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint */
app.get('/genres', function (req, res) {
  const genres = new Set();
  Object.values(movieModel).forEach(movie => {
    if (movie.Genres) {
      movie.Genres.forEach(g => genres.add(g));
    }
  });
  res.send(Array.from(genres).sort());
});

/* Task 2.2: Extend the GET /movies endpoint with query parameters */
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);
  if (req.query.genre) {
    movies = movies.filter(movie => movie.Genres && movie.Genres.includes(req.query.genre));
  }
  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;
 
  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);    
  }
});

app.put('/movies/:imdbID', function(req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");