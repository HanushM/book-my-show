package com.example.demo.services;

import com.example.demo.dto.BookingResponse;
import com.example.demo.dto.PaymentSummary;
import com.example.demo.dto.SeatResponse;
import com.example.demo.dto.ShowResponse;
import com.example.demo.entities.Payment;
import com.example.demo.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private RestTemplate restTemplate;
    private final String SEAT_SERVICE_URL = "http://THEATER-SERVICE/seat";
    private final String STATUS_SERVICE_URL = "http://THEATER-SERVICE/status";
    private final String BOOKING_SERVICE_URL = "http://BOOKING/bookings";
    private final String SHOW_SERVICE_URL = "http://SHOWS/shows";
    
    
    public  Long createPayment(long showId,String emailId, String method) {
        List<Integer> lockedSeats = restTemplate.getForObject(STATUS_SERVICE_URL + "/locked?userEmail=" + emailId+"&showId=" + showId, List.class);
        if (lockedSeats == null || lockedSeats.isEmpty()) {
            throw new RuntimeException("No locked seats found for user: " + emailId);
        }
        String seatIdsParam = lockedSeats.stream()
        	    .map(String::valueOf)
        	    .collect(Collectors.joining(","));

        	Map<Integer, Integer> seatPrices = restTemplate.getForObject(
        	    SEAT_SERVICE_URL + "/prices?seatIds=" + seatIdsParam, Map.class);
        if (seatPrices == null) {
            throw new RuntimeException("Failed to fetch seat prices");
        }

        double totalAmount = seatPrices.values().stream().mapToDouble(Integer::doubleValue).sum();
        Payment payment = new Payment();
        payment.setEmailId(emailId);
        payment.setMethod(method);
        payment.setAmount(totalAmount);
        payment.setTimestamp(LocalDateTime.now());
        payment.setStatus("ACTIVE");
        payment.setShowId(showId);
        paymentRepository.save(payment);
        return payment.getPaymentId();
    }

    public Payment generatePaymentStatus(Long paymentId) {
        Random random = new Random();
        boolean isSuccess = random.nextBoolean();
        
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        System.out.println("Generating payment status for: " + paymentId);
        System.out.println("Email: " + payment.getEmailId());
        System.out.println("Show ID: " + payment.getShowId());

        List<Integer> lockedSeats = null;
        String seatIds = null;

        try {
            lockedSeats = restTemplate.getForObject(
                    STATUS_SERVICE_URL + "/locked?userEmail=" + payment.getEmailId() + "&showId=" + payment.getShowId(),
                    List.class
            );
            seatIds = lockedSeats.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
            System.out.println("Locked seats: " + lockedSeats);
        } catch (Exception e) {
            System.out.println("Error fetching locked seats: " + e.getMessage());
        }
        if (isSuccess) {
            payment.setStatus("SUCCESS");

            if (lockedSeats != null && !lockedSeats.isEmpty()) {
                try {
                	restTemplate.postForObject(
                		    BOOKING_SERVICE_URL + "/create?paymentId=" + paymentId + "&emailId=" + payment.getEmailId() + "&seatIds=" + seatIds,
                		    null, 
                		    Void.class
                		);
                	System.out.println("-------------------------------");
                    restTemplate.put(STATUS_SERVICE_URL + "/confirm?showId=" + payment.getShowId() + "&seatIds=" + seatIds, null);
                    System.out.println("-------------------------------");
                } catch (Exception e) {
                    System.out.println("Error confirming payment: " + e.getMessage());
                    throw new RuntimeException("Error confirming payment");
                }
            }
        } else {
            payment.setStatus("FAILURE");

            if (lockedSeats != null && !lockedSeats.isEmpty()) {
                try {
                    String releaseUrl = STATUS_SERVICE_URL + "/release?showId=" + payment.getShowId()
                            + "&seatIds=" + seatIds
                            + "&userEmail=" + payment.getEmailId();
                    restTemplate.put(releaseUrl, null);
                } catch (Exception e) {
                    System.out.println("Error releasing seats: " + e.getMessage());
                    throw new RuntimeException("Error releasing seats");
                }
            }
        }

        try {
            return paymentRepository.save(payment);
        } catch (Exception e) {
            System.out.println("Error saving payment: " + e.getMessage());
            throw new RuntimeException("Error saving payment");
        }
    }

    
    public PaymentSummary getPaymentSummary(Long paymentId) {
    	   Payment payment = paymentRepository.findById(paymentId)
    	            						  .orElseThrow(() -> new RuntimeException("Payment not found"));
    	   if(payment.getStatus().equals("FAILURE")){
    		   PaymentSummary summary = new PaymentSummary();
    		   summary.setStatus("FAILURE");
    		   return summary;
    	   }
    	   BookingResponse bookingResponse = restTemplate.getForObject(
    			    BOOKING_SERVICE_URL + "/byPayment?paymentId=" + paymentId,
    			    BookingResponse.class
    			);
    	   
    	   ShowResponse showResponse = restTemplate.getForObject(SHOW_SERVICE_URL+"/byTimeId?id="+payment.getShowId(), ShowResponse.class);
    	   
    	   String seatIdsParam = bookingResponse.getSeatIds()
    	            .stream().map(String::valueOf)
    	            .collect(Collectors.joining(","));
    	    
    	   ResponseEntity<SeatResponse[]> seatResponse = restTemplate.getForEntity(SEAT_SERVICE_URL+"/listOfSeats?seatIds="+seatIdsParam,SeatResponse[].class);
    	   
    	   SeatResponse[] seatArray = seatResponse.getBody();
    	   List<SeatResponse> seatList = Arrays.asList(seatArray);  // Correct usage

    	   
    	   Map<String, List<Integer>> tierSeatsMap = new HashMap<>();

    	   for (SeatResponse seat : seatList) {
    	       String tierName = seat.getTier().getTierName();
    	       int seatNo = seat.getSeatNo();

    	       tierSeatsMap.computeIfAbsent(tierName, k -> new ArrayList<>()).add(seatNo);
    	   }
    	    
    	    SeatResponse firstSeat = seatList.get(0);
    	    String theaterName = firstSeat.getTier().getScreen().getTheater().getTheaterName();
    	    String placeName = firstSeat.getTier().getScreen().getTheater().getPlace().getCity(); // or use full address if needed
    	    int pinCode = firstSeat.getTier().getScreen().getTheater().getPlace().getPinCode();
    	    
    	    
    	    System.out.println("Booking Response: " + bookingResponse);
    	    System.out.println("Show Response: " + showResponse);
    	    System.out.println("Seat Response: " + seatResponse);

    	    
    	    PaymentSummary summary = new PaymentSummary();
    	    summary.setTotalAmount(payment.getAmount());
    	    
    	    summary.setMovieName(showResponse.getMovieName());
    	    summary.setStartTime(showResponse.getStartTime().toString());
    	    summary.setEndTime(showResponse.getEndTime().toString());
    	    summary.setDate(showResponse.getDate().toString());
    	    summary.setScreenNumber(showResponse.getScreenId());
    	    summary.setTierSeats(tierSeatsMap);
    	    summary.setTheaterName(theaterName);
    	    summary.setPlaceName(placeName);
    	    summary.setPinCode(pinCode);
    	    summary.setStatus(payment.getStatus());
    	    return summary;
    }
    
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

}