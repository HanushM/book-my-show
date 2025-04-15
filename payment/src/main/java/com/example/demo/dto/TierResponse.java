package com.example.demo.dto;

public class TierResponse {
	  private int tierId;
	    private String tierName;
	    private int seatCount;
	    private double amount;
	    private ScreenResponse screen;
		public int getTierId() {
			return tierId;
		}
		public void setTierId(int tierId) {
			this.tierId = tierId;
		}
		public String getTierName() {
			return tierName;
		}
		public void setTierName(String tierName) {
			this.tierName = tierName;
		}
		public int getSeatCount() {
			return seatCount;
		}
		public void setSeatCount(int seatCount) {
			this.seatCount = seatCount;
		}
		public double getAmount() {
			return amount;
		}
		public void setAmount(double amount) {
			this.amount = amount;
		}
		public ScreenResponse getScreen() {
			return screen;
		}
		public void setScreen(ScreenResponse screen) {
			this.screen = screen;
		}
	    
	    
}
