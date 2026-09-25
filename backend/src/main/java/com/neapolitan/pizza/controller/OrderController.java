package com.neapolitan.pizza.controller;

import com.neapolitan.pizza.dto.CreateOrderRequest;
import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> trackOrder(
            @PathVariable String orderNumber,
            @RequestParam(required = false) String token) {
        OrderResponse order = orderService.getOrderByNumberAndToken(orderNumber, token);
        return ResponseEntity.ok(order);
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<java.util.Map<String, String>> handleResponseStatusException(org.springframework.web.server.ResponseStatusException ex) {
        java.util.Map<String, String> body = new java.util.HashMap<>();
        body.put("error", ex.getStatusCode().toString());
        body.put("message", ex.getReason());
        return new ResponseEntity<>(body, ex.getStatusCode());
    }
}
