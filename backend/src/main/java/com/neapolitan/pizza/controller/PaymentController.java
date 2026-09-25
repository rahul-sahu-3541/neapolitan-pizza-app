package com.neapolitan.pizza.controller;

import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.dto.UpdateOrderStatusRequest;
import com.neapolitan.pizza.model.PaymentStatus;
import com.neapolitan.pizza.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final OrderService orderService;

    public PaymentController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> payload) {
        String orderNumber = (String) payload.get("orderNumber");
        Number amount = (Number) payload.get("amount");

        Map<String, Object> response = new HashMap<>();
        response.put("paymentGatewayOrderId", "pay_order_" + UUID.randomUUID().toString().substring(0, 10));
        response.put("orderNumber", orderNumber);
        response.put("amount", amount);
        response.put("currency", "INR");
        response.put("supportedMethods", new String[]{"UPI_INTENT", "GPAY", "PHONEPE", "PAYTM", "CARD"});
        response.put("upiVpa", "fornodoro.pizzeria@icici");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderResponse> verifyPayment(@RequestBody Map<String, String> payload) {
        String orderNumber = payload.get("orderNumber");
        String paymentId = payload.getOrDefault("paymentId", "pay_" + UUID.randomUUID().toString().substring(0, 8));

        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest();
        updateReq.setPaymentStatus(PaymentStatus.PAID);

        OrderResponse updated = orderService.updateOrderStatus(orderNumber, updateReq);
        return ResponseEntity.ok(updated);
    }
}
