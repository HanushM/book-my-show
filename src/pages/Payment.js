import React from "react";
import "./Payment.css";

const Payment = () => {
  return (
    <div className="payment-container">
      {/* Contact Details */}
      <div className="section contact-details">
        <h2>Share your Contact Details</h2>
        <div className="contact-inputs">
          <input type="email" placeholder="Email Address" />
          <div className="phone-group">
            <span>+91</span>
            <input type="tel" placeholder="Enter mobile number" />
          </div>
          <button>Continue</button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="section">
        <h2>Payment Options</h2>
        <div className="payment-methods">
          <div className="method-list">
            <ul>
              <li className="active">Pay by any UPI App</li>
              <li>Debit/Credit Card</li>
              <li>Net Banking</li>
              <li>Mobile Wallets</li>
              <li>Gift Voucher</li>
              <li>Redeem Points</li>
            </ul>
          </div>
          <div className="upi-options">
            <label><input type="radio" name="upi" /> Google Pay</label>
            <label><input type="radio" name="upi" /> Amazon Pay UPI</label>
            <label><input type="radio" name="upi" /> BHIM</label>
            <label><input type="radio" name="upi" /> Paytm</label>
            <label><input type="radio" name="upi" /> PhonePe</label>
            <label><input type="radio" name="upi" /> Other UPI</label>
            <label><input type="radio" name="upi" /> Scan QR Code</label>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p><strong>Dragon (UA16+)</strong></p>
        <p>Tamil, 2D</p>
        <p>PVR: Grand Mall, Velachery (AUDI 02)</p>
        <p>M-Ticket</p>
        <p>Seats: PE-C9, C10</p>
        <p>Date: Wed, 9 Apr, 2025 | 10:30 PM</p>
        <hr />
        <div className="price-breakup">
          <div><span>Sub Total</span><span>Rs. 253.74</span></div>
          <div><span>+ Convenience fees</span><span>Rs. 49.56</span></div>
          <div className="donation">
            <span>Donate to BookAChange</span>
            <span>Rs. 0 <button>Add Rs. 2</button></span>
          </div>
        </div>
        <hr />
        <div className="total-payable">
          <strong>Amount Payable</strong>
          <strong>Rs. 303.30</strong>
        </div>
        <p className="ip-note">Your IP Address : 14.194.60.186</p>
      </div>
    </div>
  );
};

export default Payment;
