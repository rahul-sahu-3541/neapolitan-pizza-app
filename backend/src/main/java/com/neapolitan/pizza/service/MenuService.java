package com.neapolitan.pizza.service;

import com.neapolitan.pizza.dto.MenuResponse;
import com.neapolitan.pizza.dto.MenuItemRequest;
import com.neapolitan.pizza.model.Category;
import com.neapolitan.pizza.model.MenuItem;
import com.neapolitan.pizza.model.Topping;
import com.neapolitan.pizza.repository.CategoryRepository;
import com.neapolitan.pizza.repository.MenuItemRepository;
import com.neapolitan.pizza.repository.ToppingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuService {

    private final CategoryRepository categoryRepository;
    private final ToppingRepository toppingRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuService(CategoryRepository categoryRepository, 
                       ToppingRepository toppingRepository,
                       MenuItemRepository menuItemRepository) {
        this.categoryRepository = categoryRepository;
        this.toppingRepository = toppingRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public MenuResponse getFullMenu() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        List<Topping> toppings = toppingRepository.findByIsAvailableTrue();
        return new MenuResponse(categories, toppings);
    }

    @Transactional
    public MenuItem createMenuItem(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setBasePrice(request.getBasePrice());
        item.setImageUrl(request.getImageUrl());
        item.setIsAvailable(request.isAvailable());
        item.setDietaryType(request.isVegetarian() ? com.neapolitan.pizza.model.DietaryType.VEG : com.neapolitan.pizza.model.DietaryType.NON_VEG);
        item.setCategory(category);
        
        return menuItemRepository.save(item);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
                
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setBasePrice(request.getBasePrice());
        item.setImageUrl(request.getImageUrl());
        item.setIsAvailable(request.isAvailable());
        item.setDietaryType(request.isVegetarian() ? com.neapolitan.pizza.model.DietaryType.VEG : com.neapolitan.pizza.model.DietaryType.NON_VEG);
        item.setCategory(category);
        
        return menuItemRepository.save(item);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
