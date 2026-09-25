package com.neapolitan.pizza.service;

import com.neapolitan.pizza.dto.CreateOrderRequest;
import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.dto.UpdateOrderStatusRequest;
import com.neapolitan.pizza.model.*;
import com.neapolitan.pizza.repository.MenuItemRepository;
import com.neapolitan.pizza.repository.OrderRepository;
import com.neapolitan.pizza.repository.ToppingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final ToppingRepository toppingRepository;
    private final NotificationService notificationService;

    @Value("${restaurant.gst-percentage:0.0}")
    private double gstPercentage;

    @Value("${restaurant.default-prep-minutes:15}")
    private int defaultPrepMinutes;

    private static final AtomicLong ORDER_COUNTER = new AtomicLong(1001);

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        ToppingRepository toppingRepository,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.toppingRepository = toppingRepository;
        this.notificationService = notificationService;
    }

    public OrderResponse createOrder(CreateOrderRequest req) {
        Order order = new Order();
        String orderNum = "NP-" + ORDER_COUNTER.getAndIncrement();
        order.setOrderNumber(orderNum);
        order.setOrderToken(UUID.randomUUID().toString());
        order.setCustomerName(req.getCustomerName().trim());
        order.setCustomerPhone(req.getCustomerPhone().trim());
        order.setOrderType(req.getOrderType());
        order.setTableNumber(req.getTableNumber());
        order.setDeliveryAddress(req.getDeliveryAddress());
        order.setNotes(req.getCookingNotes());
        order.setEstimatedPrepMinutes(defaultPrepMinutes);

        // Payment logic for Hybrid option
        order.setPaymentMethod(req.getPaymentMethod());
        if (req.getPaymentMethod() == PaymentMethod.PAY_AT_COUNTER) {
            order.setStatus(OrderStatus.RECEIVED);
            order.setPaymentStatus(PaymentStatus.PENDING_COUNTER);
        } else {
            // Online UPI/Card
            order.setStatus(OrderStatus.RECEIVED);
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq : req.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Menu item not found: " + itemReq.getMenuItemId()));

            if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Item is currently out of stock: " + menuItem.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setItemName(menuItem.getName());
            orderItem.setUnitPrice(menuItem.getBasePrice());
            orderItem.setQuantity(itemReq.getQuantity());

            BigDecimal lineItemPrice = menuItem.getBasePrice();

            if (itemReq.getToppingIds() != null && !itemReq.getToppingIds().isEmpty()) {
                for (Long toppingId : itemReq.getToppingIds()) {
                    Topping topping = toppingRepository.findById(toppingId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Topping not found: " + toppingId));

                    OrderItemTopping itemTopping = new OrderItemTopping(
                            orderItem,
                            topping,
                            topping.getName(),
                            topping.getPrice()
                    );
                    orderItem.addTopping(itemTopping);
                    lineItemPrice = lineItemPrice.add(topping.getPrice());
                }
            }

            BigDecimal itemTotal = lineItemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            orderItem.setSubtotal(itemTotal);
            order.addItem(orderItem);

            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);

        // Calculate 5% Restaurant GST
        BigDecimal gstRate = BigDecimal.valueOf(gstPercentage).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal gstAmount = subtotal.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);
        order.setGstAmount(gstAmount);

        BigDecimal grandTotal = subtotal.add(gstAmount).setScale(2, RoundingMode.HALF_UP);
        order.setTotalAmount(grandTotal);

        Order saved = orderRepository.save(order);
        OrderResponse response = OrderResponse.fromEntity(saved);

        // Push real-time notification to Kitchen Display
        notificationService.broadcastNewOrder(response);

        return response;
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumberAndToken(String orderNumber, String token) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderNumber));

        if (token != null && !token.isBlank() && !token.equals(order.getOrderToken())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid order tracking token");
        }

        return OrderResponse.fromEntity(order);
    }

    public OrderResponse updateOrderStatus(String orderNumber, UpdateOrderStatusRequest req) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderNumber));

        if (req.getStatus() != null) {
            order.setStatus(req.getStatus());
        }
        if (req.getPaymentStatus() != null) {
            order.setPaymentStatus(req.getPaymentStatus());
        }
        if (req.getEstimatedPrepMinutes() != null) {
            order.setEstimatedPrepMinutes(req.getEstimatedPrepMinutes());
        }
        order.setUpdatedAt(LocalDateTime.now());

        Order updated = orderRepository.save(order);
        OrderResponse response = OrderResponse.fromEntity(updated);

        // Notify customer tracker and kitchen screens
        notificationService.broadcastOrderStatusUpdate(response);

        return response;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveKitchenOrders() {
        List<OrderStatus> inactiveStatuses = List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED);
        return orderRepository.findByStatusNotInOrderByCreatedAtDesc(inactiveStatuses)
                .stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public com.neapolitan.pizza.dto.AnalyticsResponse getAnalytics() {
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();
        
        long activeOrders = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.COMPLETED && o.getStatus() != OrderStatus.CANCELLED)
                .count();
                
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        return new com.neapolitan.pizza.dto.AnalyticsResponse(totalOrders, activeOrders, totalRevenue);
    }
}
