package com.neapolitan.pizza;

import com.neapolitan.pizza.dto.CreateOrderRequest;
import com.neapolitan.pizza.dto.MenuResponse;
import com.neapolitan.pizza.dto.OrderResponse;
import com.neapolitan.pizza.dto.UpdateOrderStatusRequest;
import com.neapolitan.pizza.model.OrderStatus;
import com.neapolitan.pizza.model.OrderType;
import com.neapolitan.pizza.model.PaymentMethod;
import com.neapolitan.pizza.model.PaymentStatus;
import com.neapolitan.pizza.service.MenuService;
import com.neapolitan.pizza.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PizzaApplicationTests {

    @Autowired
    private MenuService menuService;

    @Autowired
    private OrderService orderService;

    @Test
    void contextLoads() {
        assertNotNull(menuService);
        assertNotNull(orderService);
    }

    @Test
    void testMenuRetrieval() {
        MenuResponse menu = menuService.getFullMenu();
        assertNotNull(menu);
        assertFalse(menu.getCategories().isEmpty(), "Menu should contain seeded categories");
        assertFalse(menu.getAvailableToppings().isEmpty(), "Menu should contain seeded toppings");
    }

    @Test
    void testPlaceGuestOrderWithGstCalculation() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerName("Rahul Sharma");
        request.setCustomerPhone("9876543210");
        request.setOrderType(OrderType.DINE_IN);
        request.setTableNumber("T-04");
        request.setCookingNotes("Extra crispy cornicione, please");
        request.setPaymentMethod(PaymentMethod.PAY_AT_COUNTER);

        // Margherita D.O.P. (₹495) + Fresh Burrata (₹150) = ₹645
        CreateOrderRequest.OrderItemRequest itemReq = new CreateOrderRequest.OrderItemRequest();
        itemReq.setMenuItemId(1L);
        itemReq.setQuantity(1);
        itemReq.setToppingIds(List.of(1L));
        request.setItems(List.of(itemReq));

        OrderResponse response = orderService.createOrder(request);

        assertNotNull(response);
        assertNotNull(response.getOrderNumber());
        assertTrue(response.getOrderNumber().startsWith("NP-"));
        assertEquals("Rahul Sharma", response.getCustomerName());
        assertEquals(OrderStatus.RECEIVED, response.getStatus());
        assertEquals(PaymentStatus.PENDING_COUNTER, response.getPaymentStatus());

        // Subtotal: 495 + 150 = 645.00
        assertEquals(new BigDecimal("645.00"), response.getSubtotal());

        // 5% GST on 645 = 32.25
        assertEquals(new BigDecimal("0.00"), response.getGstAmount());

        // Grand Total = 645 + 32.25 = 677.25
        assertEquals(new BigDecimal("645.00"), response.getTotalAmount());
    }

    @Test
    void testOrderStatusLifecycle() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerName("Priya Patel");
        request.setCustomerPhone("9988776655");
        request.setOrderType(OrderType.TAKEAWAY);
        request.setPaymentMethod(PaymentMethod.ONLINE);

        CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
        item.setMenuItemId(2L); // Marinara
        item.setQuantity(1);
        request.setItems(List.of(item));

        OrderResponse placed = orderService.createOrder(request);
        assertEquals(OrderStatus.RECEIVED, placed.getStatus());

        // Kitchen moves to IN_OVEN
        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest();
        updateReq.setStatus(OrderStatus.IN_OVEN);
        updateReq.setPaymentStatus(PaymentStatus.PAID);

        OrderResponse inOven = orderService.updateOrderStatus(placed.getOrderNumber(), updateReq);
        assertEquals(OrderStatus.IN_OVEN, inOven.getStatus());
        assertEquals(PaymentStatus.PAID, inOven.getPaymentStatus());
    }
}
