package com.example.demo.dto;

public class ScreenResponse {
	 private int screenId;
	    private int screenNo;
	    private int capacity;
	    private TheaterResponse theater;
		public int getScreenId() {
			return screenId;
		}
		public void setScreenId(int screenId) {
			this.screenId = screenId;
		}
		public int getScreenNo() {
			return screenNo;
		}
		public void setScreenNo(int screenNo) {
			this.screenNo = screenNo;
		}
		public int getCapacity() {
			return capacity;
		}
		public void setCapacity(int capacity) {
			this.capacity = capacity;
		}
		public TheaterResponse getTheater() {
			return theater;
		}
		public void setTheater(TheaterResponse theater) {
			this.theater = theater;
		}
	    
}
