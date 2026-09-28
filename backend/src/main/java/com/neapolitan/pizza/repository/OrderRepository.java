package com.neapolitan.pizza.repository;

import com.neapolitan.pizza.model.Order;
import com.neapolitan.pizza.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.toppings"})
    Optional<Order> findByOrderToken(String orderToken);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.toppings"})
    Optional<Order> findByOrderNumber(String orderNumber);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.toppings"})
    List<Order> findByStatusNotInOrderByCreatedAtDesc(List<OrderStatus> statuses);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.toppings"})
    List<Order> findAllByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.toppings"})
    List<Order> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);
    
    Optional<Order> findTopByOrderByIdDesc();
}
