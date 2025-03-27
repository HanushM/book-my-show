package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}
	@Bean
	public RouteLocator myCustomRouterLocator(RouteLocatorBuilder builder) {
		return builder.routes().route(r->r.path("/user/**").uri("http://localhost:8484"))
							   .route(r->r.path("/place/**").uri("http://localhost:8181"))
							   .route(r->r.path("/theater/**").uri("http://localhost:8181"))
							   .route(r->r.path("/screen/**").uri("http://localhost:8181"))
							   .route(r->r.path("/tier/**").uri("http://localhost:8181"))
							   .route(r->r.path("/seat/**").uri("http://localhost:8181"))
							   .route(r->r.path("/bookings/**").uri("http://localhost:8383"))
							   .route(r->r.path("/payments/**").uri("http://localhost:8282"))
							   .build();
	}
}
