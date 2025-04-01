package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Users;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	
	public Users addUser(Users user) {
		return userRepository.save(user);
	}
	
	public Users getUser(String emailId) {
		return userRepository.findById(emailId).orElse(null);
	}
	
	public Users updateUser(String emailId, Users updatedUser) {
	    Optional<Users> existingUser = userRepository.findById(emailId);
	    if (existingUser.isPresent()) {
	        Users user = existingUser.get();

	        if (updatedUser.getMobileNo() != null) {
	            user.setMobileNo(updatedUser.getMobileNo());
	        }
	        if (updatedUser.getName() != null) {
	            user.setName(updatedUser.getName());
	        }
	        if (updatedUser.getPassword() != null) {
	            user.setPassword(updatedUser.getPassword());
	        }
	        
	        return userRepository.save(user);
	    }
	    return null;
	}

	public Boolean deleteUser(String emailId) {
		if(userRepository.existsById(emailId)) {
			userRepository.deleteById(emailId);
			return true;
		}
		return false;
	}
    public boolean validateUser(String email, String password) {
        Users user = getUser(email);
        return user != null && user.getPassword().equals(password);
    }

}
