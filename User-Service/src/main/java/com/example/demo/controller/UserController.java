package com.example.demo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Users;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;

import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;
	@Autowired
    private JwtService jwtService;
	
	@PostMapping("/add")
	public ResponseEntity<Users> addUser(@RequestBody Users user) {
		Users savedUser=userService.addUser(user);
		return new ResponseEntity<>(savedUser,HttpStatus.CREATED);
	}
	@GetMapping("/{emailId}")
	public ResponseEntity<Users> getUser(@PathVariable String emailId) {
		Users users=userService.getUser(emailId);
		return users!=null ? new ResponseEntity<>(users,HttpStatus.OK)
						   : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	@PostMapping("/verifyUser")
	public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
	    if (userService.validateUser(loginRequest.getEmailId(), loginRequest.getPassword())) {
	    	Users user = userService.getUser(loginRequest.getEmailId());
	    	String token = jwtService.generateToken(user.getEmailId(), user.getRole());
	        return ResponseEntity.ok(new JwtResponse(token, user.getRole()));
	    } else {
	        return ResponseEntity.status(401).body("Invalid credentials");
	    }
	}

	@PutMapping("/{emailId}")
	public ResponseEntity<Users> updateUser(@PathVariable String emailId, @RequestBody Users user) {
        Users updatedUser = userService.updateUser(emailId, user);
        return updatedUser != null ? new ResponseEntity<>(updatedUser, HttpStatus.OK)
                                   : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	@DeleteMapping("/{emailId}")
	public ResponseEntity<String> deleteUser(@PathVariable String emailId) {
		boolean isDeleted=userService.deleteUser(emailId);
		return isDeleted ? new ResponseEntity<>("User deleted successfully",HttpStatus.OK)
						 : new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
	}
}
