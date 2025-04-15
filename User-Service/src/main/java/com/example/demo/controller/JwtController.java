package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.JwtService;

@RestController
@RequestMapping("/jwt")
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token, @RequestParam String emailId) {
        boolean isValid = jwtService.validateToken(token, emailId);
        return isValid ? ResponseEntity.ok("Token is valid")
                       : ResponseEntity.status(401).body("Invalid or expired token");
    }

    @PostMapping("/decode")
    public ResponseEntity<String> decodeToken(@RequestParam String token) {
        try {
            String emailId = jwtService.extractUsername(token);
            return ResponseEntity.ok(emailId);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return ResponseEntity.status(401).body("Token is expired");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid token");
        }
    }
}
