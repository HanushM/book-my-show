package com.example.demo;

import java.sql.Date;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.repo.MovieRepository;

@SpringBootApplication
public class MovieSearchApplication {

	public static void main(String[] args) {
		SpringApplication.run(MovieSearchApplication.class, args);
	}

}
