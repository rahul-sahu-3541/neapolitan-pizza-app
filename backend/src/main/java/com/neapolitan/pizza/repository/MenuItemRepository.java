package com.neapolitan.pizza.repository;

import com.neapolitan.pizza.model.DietaryType;
import com.neapolitan.pizza.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrue();
    List<MenuItem> findByCategoryIdAndIsAvailableTrue(Long categoryId);
    List<MenuItem> findByDietaryTypeAndIsAvailableTrue(DietaryType dietaryType);
}
