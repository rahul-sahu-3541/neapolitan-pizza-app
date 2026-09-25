package com.neapolitan.pizza.model;

public enum OrderStatus {
    RECEIVED("Order Received", "We have got your ticket!"),
    PREPARING("Dough Stretched & Topped", "Chef is hand-stretching your 48h sourdough base"),
    IN_OVEN("In the 500°C Wood-Fired Oven", "Flash-baking for 90 seconds under real wood flame"),
    READY("Ready for You!", "Hot & fresh at your table / ready for pickup"),
    COMPLETED("Completed", "Order served or picked up"),
    CANCELLED("Cancelled", "Order was cancelled");

    private final String label;
    private final String description;

    OrderStatus(String label, String description) {
        this.label = label;
        this.description = description;
    }

    public String getLabel() {
        return label;
    }

    public String getDescription() {
        return description;
    }
}
