package com.neapolitan.pizza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @GetMapping("/verify")
    public ResponseEntity<String> verify() {
        return ResponseEntity.ok("OK");
    }
}
