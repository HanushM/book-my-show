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
    private Image image;  
    private Date releaseDate;
    private String linkToTrailer;
    private String[] cast;
    private Float rating;
    private String genre;
    private String comments;

    
    public Movie(String name, int movieid, Image image, Date releaseDate, String linkToTrailer,
                 String[] cast, Float rating, String genre, String comments) {
        this.name = name;
        this.movieid = movieid;
        this.image = image;
        this.releaseDate = releaseDate;
        this.linkToTrailer = linkToTrailer;
        this.cast = cast;
        this.rating = rating;
        this.genre = genre;
        this.comments = comments;
    }


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


	public Image getImage() {
		return image;
	}


	public void setImage(Image image) {
		this.image = image;
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
