package com.example.demo.services;

import com.example.demo.entity.Movie;
import com.example.demo.repo.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieServices {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieServices(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public Movie updateMovie(String id, Movie movieDetails) {
        Optional<Movie> existingMovieOptional = movieRepository.findById(id);

        if (existingMovieOptional.isPresent()) {
            Movie existingMovie = existingMovieOptional.get();

            existingMovie.setName(movieDetails.getName());
            existingMovie.setReleaseDate(movieDetails.getReleaseDate());
            existingMovie.setLinkToTrailer(movieDetails.getLinkToTrailer());
            existingMovie.setCast(movieDetails.getCast());
            existingMovie.setRating(movieDetails.getRating());
            existingMovie.setGenre(movieDetails.getGenre());
            existingMovie.setComments(movieDetails.getComments());
            existingMovie.setImage(movieDetails.getImage());

            return movieRepository.save(existingMovie);
        }
        return null;
    }

    public boolean deleteMovie(String id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> getMoviesByName(String name) {
        String normalizedSearchTerm = name.trim();  
        return movieRepository.findByNameContainingIgnoreCase(normalizedSearchTerm);
    }
}
