package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Seat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seatId;
	private int seatNo;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

	@ManyToOne(optional = false)
	@JoinColumn(name="tier_id",referencedColumnName = "tierId",nullable = false)
	private Tier tier;
	private String lockedBy;
	private LocalDateTime lockedUntil;
	
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

    public SeatStatus getStatus() {
        return status;
    }
    public void setStatus(SeatStatus status) {
        this.status = status;
    }

    public String getLockedBy() {
        return lockedBy;
    }

    public void setLockedBy(String lockedBy) {
        this.lockedBy = lockedBy;
    }

    public LocalDateTime getLockedUntil() {
        return lockedUntil;
    }

    public void setLockedUntil(LocalDateTime lockedUntil) {
        this.lockedUntil = lockedUntil;
    }	

	public Tier getTier() {
    	return tier;
	}
	public void setTier(Tier tier) {
		this.tier = tier;
	}

}
