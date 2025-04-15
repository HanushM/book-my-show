package com.example.demo.dto;


public class SeatResponse {
	  private int seatId;
	    private int seatNo;
	    private TierResponse tier;
	    
		public int getSeatId() {
			return seatId;
		}
		public void setSeatId(int seatId) {
			this.seatId = seatId;
		}
		public int getSeatNo() {
			return seatNo;
		}
		public void setSeatNo(int seatNo) {
			this.seatNo = seatNo;
		}
		public TierResponse getTier() {
			return tier;
		}
		public void setTier(TierResponse tier) {
			this.tier = tier;
		}
	    
}
