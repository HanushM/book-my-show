package com.example.demo.controller;

import com.example.demo.entity.Movie;
import com.example.demo.services.MovieServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
public class MovieController {

    private final MovieServices movieService;

    @Autowired
    public MovieController(MovieServices movieService) {
        this.movieService = movieService;
    }

    // Corrected POST method for uploading movie details
    @PostMapping("/upload")  // Use a distinct path for file upload
    public ResponseEntity<Movie> uploadMovie(@RequestParam("name") String name,
                                             @RequestParam("movieid") int movieid,
                                             @RequestParam("releaseDate") String releaseDate,
                                             @RequestParam("linkToTrailer") String linkToTrailer,
                                             @RequestParam("cast") String[] cast,
                                             @RequestParam("languages") String[] languages,
                                             @RequestParam("rating") float rating,
                                             @RequestParam("genre") String genre,
                                             @RequestParam("comments") String comments,
                                             @RequestParam("image") MultipartFile image) throws IOException, ParseException {

        // Convert the uploaded image to Base64 string
        String imageBase64 = encodeImageToBase64(image);

        // Parse the release date from String to Date using SimpleDateFormat
        Date releaseDateParsed = parseReleaseDate(releaseDate);

        // Create a Movie object with the provided data
        Movie movie = new Movie(name, movieid, imageBase64, releaseDateParsed, linkToTrailer, cast, languages, rating, genre, comments);

        // Save the movie object to the database
        Movie createdMovie = movieService.createMovie(movie);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    // Helper method to parse the release date from string to Date
    private Date parseReleaseDate(String releaseDate) throws ParseException {
        // Define the expected date format
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        // Parse the releaseDate string into a Date object
        return dateFormat.parse(releaseDate);
    }

    // Helper method to convert MultipartFile to Base64 string
    private String encodeImageToBase64(MultipartFile image) throws IOException {
        byte[] imageBytes = image.getBytes();
        return java.util.Base64.getEncoder().encodeToString(imageBytes);
    }

    // Other methods for getting, updating, and deleting movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        Optional<Movie> movie = movieService.getMovieById(id);
        if (movie.isPresent()) {
            return new ResponseEntity<>(movie.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String id, @RequestBody Movie movie) {
        Movie updatedMovie = movieService.updateMovie(id, movie);
        if (updatedMovie != null) {
            return new ResponseEntity<>(updatedMovie, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        boolean deleted = movieService.deleteMovie(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    @GetMapping("/search")
    public List<Movie> getMoviesByName(@RequestParam String name) {
        return movieService.getMoviesByName(name);
    }

    @GetMapping("/cast/{cast}")
    public List<Movie> getMoviesByCast(@PathVariable String cast) {
        return movieService.getMoviesByCast(cast);
    }

    @GetMapping("/language/{language}")
    public List<Movie> getMoviesByLanguage(@PathVariable String language) {
        return movieService.getMoviesByLanguage(language);
    }
}
