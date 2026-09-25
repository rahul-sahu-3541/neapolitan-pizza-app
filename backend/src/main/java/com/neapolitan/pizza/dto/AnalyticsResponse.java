package com.neapolitan.pizza.dto;

import java.math.BigDecimal;

public class AnalyticsResponse {
    private long totalOrders;
    private long activeOrders;
    private BigDecimal totalRevenue;
    
    public AnalyticsResponse(long totalOrders, long activeOrders, BigDecimal totalRevenue) {
        this.totalOrders = totalOrders;
        this.activeOrders = activeOrders;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
