package com.neapolitan.pizza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PizzaApplication {

    public static void main(String[] args) {
        SpringApplication.run(PizzaApplication.class, args);
    }
}
