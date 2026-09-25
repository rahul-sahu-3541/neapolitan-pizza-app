package com.neapolitan.pizza.service;

import com.neapolitan.pizza.dto.OrderResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastNewOrder(OrderResponse order) {
        log.info("Broadcasting new order {} to kitchen", order.getOrderNumber());
        messagingTemplate.convertAndSend("/topic/kitchen-orders", order);
    }

    public void broadcastOrderStatusUpdate(OrderResponse order) {
        log.info("Broadcasting status update for order {} ({})", order.getOrderNumber(), order.getStatus());
        // Broadcast to specific order channel for the customer's tracker
        messagingTemplate.convertAndSend("/topic/orders/" + order.getOrderNumber(), order);
        // Also keep kitchen display system updated
        messagingTemplate.convertAndSend("/topic/kitchen-orders", order);
    }
}
