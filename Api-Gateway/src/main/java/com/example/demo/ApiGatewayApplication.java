package com.example.demo;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@SpringBootApplication
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}
	@Bean
	public RouteLocator myCustomRouterLocator(RouteLocatorBuilder builder) {
		return builder.routes().route(r->r.path("/user/**").uri("http://localhost:8484"))
							   .route(r->r.path("/jwt/**").uri("http://localhost:8484"))
							   .route(r->r.path("/place/**").uri("http://localhost:8181"))
							   .route(r->r.path("/theater/**").uri("http://localhost:8181"))
							   .route(r->r.path("/screen/**").uri("http://localhost:8181"))
							   .route(r->r.path("/tier/**").uri("http://localhost:8181"))
							   .route(r->r.path("/seat/**").uri("http://localhost:8181"))
							   .route(r->r.path("/status/**").uri("http://localhost:8181"))
							   .route(r->r.path("/bookings/**").uri("http://localhost:8383"))
							   .route(r->r.path("/payments/**").uri("http://localhost:8282"))
							   .route(r->r.path("/shows/**").uri("http://localhost:8585"))
							   .route(r->r.path("/movies/**").uri("http://localhost:8686"))
							   .build();
	}
    @Bean
    @LoadBalanced
    public CorsWebFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); 
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
