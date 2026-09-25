package com.neapolitan.pizza.repository;

import com.neapolitan.pizza.model.Order;
import com.neapolitan.pizza.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderToken(String orderToken);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatusNotInOrderByCreatedAtDesc(List<OrderStatus> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
}
