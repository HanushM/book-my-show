const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Root route (home page)
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API!');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviesdb')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

// Movie Schema and Model
const movieSchema = new mongoose.Schema({
  name: String,
  releaseDate: String,
  linkToTrailer: String,
  cast: [String],
  rating: Number,
  genre: String,
  comments: String,
  image: String,
});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

// Get all movies from the database
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
