package com.neapolitan.pizza.dto;

import com.neapolitan.pizza.model.OrderStatus;
import com.neapolitan.pizza.model.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {

    @NotNull(message = "Status cannot be null")
    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private Integer estimatedPrepMinutes;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Integer getEstimatedPrepMinutes() {
        return estimatedPrepMinutes;
    }

    public void setEstimatedPrepMinutes(Integer estimatedPrepMinutes) {
        this.estimatedPrepMinutes = estimatedPrepMinutes;
    }
}
