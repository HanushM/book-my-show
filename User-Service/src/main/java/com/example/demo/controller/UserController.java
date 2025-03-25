package com.example.demo.controller;

import java.util.List;

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

import com.example.demo.model.Users;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.annotation.JsonTypeInfo.None;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;
	
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
