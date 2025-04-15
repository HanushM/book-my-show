package com.example.demo.dto;

public class TheaterResponse {
	private int theaterId;
    private String theaterName;
    private PlaceResponse place;
	public int getTheaterId() {
		return theaterId;
	}
	public void setTheaterId(int theaterId) {
		this.theaterId = theaterId;
	}
	public String getTheaterName() {
		return theaterName;
	}
	public void setTheaterName(String theaterName) {
		this.theaterName = theaterName;
	}
	public PlaceResponse getPlace() {
		return place;
	}
	public void setPlace(PlaceResponse place) {
		this.place = place;
	}
    
}
