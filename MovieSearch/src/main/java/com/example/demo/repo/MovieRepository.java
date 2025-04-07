package com.example.demo.repo;

import com.example.demo.entity.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    List<Movie> findByGenre(String genre);

    List<Movie> findByNameContainingIgnoreCase(String name);

    List<Movie> findByCastContainingIgnoreCase(String cast);

    List<Movie> findByLanguagesContainingIgnoreCase(String language);
}
