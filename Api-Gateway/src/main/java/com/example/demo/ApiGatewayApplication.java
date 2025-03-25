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
		return builder.routes().route(r->r.path("/user/**").uri("http://localhost:8182"))
							   .route(r->r.path("/theater/**").uri("http://localhost:8181"))
							   .build();
	}
}
