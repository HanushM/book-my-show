package com.example.demo.service;


import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private static final String SECRET_KEY = "yourSuperSecretKeyThatIsAtLeast32CharactersLong123";
  

	public String generateToken(String emailId, String role) {
	    return Jwts.builder()
	            .setSubject(emailId)
	            .claim("role", role)  // <-- include role as a claim
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))  // 10 hours
	            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
	            .compact();
	}


    public boolean validateToken(String token, String emailId) {
        String username = extractUsername(token);
        return (username.equals(emailId) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

}

