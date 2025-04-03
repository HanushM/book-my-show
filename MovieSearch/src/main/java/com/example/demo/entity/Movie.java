package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "movies")
public class Movie {

    @Id
    private String id;
    private String name;
    private int movieid;
    private String imageBase64;  // Base64 encoded image as String
    private Date releaseDate;
    private String linkToTrailer;
    private String[] cast;
    private String[] languages;
    private Float rating;
    private String genre;
    private String comments;

    // Constructor with parameters
    public Movie(String name, int movieid, String imageBase64, Date releaseDate, String linkToTrailer,
                 String[] cast, String[] languages, Float rating, String genre, String comments) {
        this.name = name;
        this.movieid = movieid;
        this.imageBase64 = imageBase64;
        this.releaseDate = releaseDate;
        this.linkToTrailer = linkToTrailer;
        this.cast = cast;
        this.languages = languages;
        this.rating = rating;
        this.genre = genre;
        this.comments = comments;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMovieid() {
        return movieid;
    }

    public void setMovieid(int movieid) {
        this.movieid = movieid;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getLinkToTrailer() {
        return linkToTrailer;
    }

    public void setLinkToTrailer(String linkToTrailer) {
        this.linkToTrailer = linkToTrailer;
    }

    public String[] getCast() {
        return cast;
    }

    public void setCast(String[] cast) {
        this.cast = cast;
    }

    public String[] getLanguages() {
        return languages;
    }

    public void setLanguages(String[] languages) {
        this.languages = languages;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
