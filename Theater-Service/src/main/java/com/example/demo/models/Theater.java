package com.example.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Theater {
	@Id
	private int theaterId;
	private String theaterName;
	private int pinCode;
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
	public int getPinCode() {
		return pinCode;
	}
	public void setPinCode(int pinCode) {
		this.pinCode = pinCode;
	}
		
}
