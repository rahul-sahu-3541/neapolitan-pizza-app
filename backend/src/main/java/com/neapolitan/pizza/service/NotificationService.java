package com.neapolitan.pizza.service;

import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final RestTemplate restTemplate;

    @Value("${WHATSAPP_ACCESS_TOKEN:}")
    private String whatsappAccessToken;

    @Value("${WHATSAPP_PHONE_ID:}")
    private String whatsappPhoneId;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.restTemplate = new RestTemplate();
    }

    public void broadcastNewOrder(OrderResponse order) {
        log.info("Broadcasting new order {} to kitchen", order.getOrderNumber());
        messagingTemplate.convertAndSend("/topic/kitchen-orders", order);
        notifyCustomerViaWhatsAppIfNeeded(order);
    }

    public void broadcastOrderStatusUpdate(OrderResponse order) {
        log.info("Broadcasting status update for order {} ({})", order.getOrderNumber(), order.getStatus());
        // Broadcast to specific order channel for the customer's tracker
        messagingTemplate.convertAndSend("/topic/orders/" + order.getOrderNumber(), order);
        // Also keep kitchen display system updated
        messagingTemplate.convertAndSend("/topic/kitchen-orders", order);

        notifyCustomerViaWhatsAppIfNeeded(order);
    }

    private void notifyCustomerViaWhatsAppIfNeeded(OrderResponse order) {
        // Send WhatsApp notification asynchronously if configured
        if (whatsappAccessToken != null && !whatsappAccessToken.trim().isEmpty() && 
            whatsappPhoneId != null && !whatsappPhoneId.trim().isEmpty() &&
            order.getCustomerPhone() != null && !order.getCustomerPhone().trim().isEmpty()) {
            
            // Only send for Order Confirmation (RECEIVED) and Ready to Collect (READY)
            if (OrderStatus.RECEIVED == order.getStatus() || OrderStatus.READY == order.getStatus()) {
                String message = buildWhatsAppMessage(order);
                sendWhatsAppMessage(order.getCustomerPhone(), message);
            }
        }
    }

    private String buildWhatsAppMessage(OrderResponse order) {
        switch (order.getStatus()) {
            case RECEIVED:
                return "Hi " + order.getCustomerName() + "! We have received your order (" + order.getOrderNumber() + ") at Al Forno Pizzeria. \uD83C\uDF55";
            case PREPARING:
                return "Good news! We've started preparing your pizza. \uD83D\uDC69\u200D\uD83C\uDF73";
            case IN_OVEN:
                return "Your pizza just went into our wood-fired oven! It'll be ready very soon. \uD83D\uDD25";
            case READY:
                return "Yum! Your order (" + order.getOrderNumber() + ") is hot and READY for pickup! \uD83C\uDFC3\u200D\u2642\uFE0F";
            case CASH_COLLECTED:
                return "Payment received for order " + order.getOrderNumber() + ". \uD83D\uDCB5";
            case COMPLETED:
                return "Thanks for choosing Al Forno Pizzeria! We hope you enjoyed your meal. \uD83D\uDE0B";
            case CANCELLED:
                return "Your order (" + order.getOrderNumber() + ") has been cancelled.";
            default:
                return "Your order status is now: " + order.getStatus();
        }
    }

    private void sendWhatsAppMessage(String phoneNumber, String text) {
        CompletableFuture.runAsync(() -> {
            try {
                // WhatsApp Cloud API expects numbers without the '+' sign
                String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
                
                String url = "https://graph.facebook.com/v19.0/" + whatsappPhoneId + "/messages";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(whatsappAccessToken);

                Map<String, Object> textObj = new HashMap<>();
                textObj.put("body", text);

                Map<String, Object> body = new HashMap<>();
                body.put("messaging_product", "whatsapp");
                body.put("recipient_type", "individual");
                body.put("to", cleanPhone);
                body.put("type", "text");
                body.put("text", textObj);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                restTemplate.postForObject(url, request, String.class);
                log.info("WhatsApp notification sent to {}", cleanPhone);
                
            } catch (Exception e) {
                log.error("Failed to send WhatsApp message to {}: {}", phoneNumber, e.getMessage());
            }
        });
    }
}
