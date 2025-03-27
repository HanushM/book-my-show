package com.example.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Tier {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int tierId;
	private String tierName;
	private int seatCount;
	@ManyToOne(optional = false)
	@JoinColumn(name="screen_id",referencedColumnName = "screenId")
	private Screen screen;
	private int amount;
	
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
	public int getAmount(){
		return this.amount;
	}
	public void setAmount(int amount){
		this.amount = amount;
	}
	public Screen getScreen() {
		return screen;
	}
	public void setScreen(Screen screen) {
		this.screen = screen;
	}
	
}
