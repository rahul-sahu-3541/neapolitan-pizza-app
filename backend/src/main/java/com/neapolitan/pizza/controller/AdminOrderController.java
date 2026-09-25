package com.neapolitan.pizza.controller;

import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.dto.UpdateOrderStatusRequest;
import com.neapolitan.pizza.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false, defaultValue = "true") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(orderService.getActiveKitchenOrders());
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse updated = orderService.updateOrderStatus(orderNumber, request);
        return ResponseEntity.ok(updated);
    }
}
