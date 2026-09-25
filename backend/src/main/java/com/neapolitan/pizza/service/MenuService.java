package com.neapolitan.pizza.service;

import com.neapolitan.pizza.dto.MenuResponse;
import com.neapolitan.pizza.model.Category;
import com.neapolitan.pizza.model.Topping;
import com.neapolitan.pizza.repository.CategoryRepository;
import com.neapolitan.pizza.repository.ToppingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuService {

    private final CategoryRepository categoryRepository;
    private final ToppingRepository toppingRepository;

    public MenuService(CategoryRepository categoryRepository, ToppingRepository toppingRepository) {
        this.categoryRepository = categoryRepository;
        this.toppingRepository = toppingRepository;
    }

    public MenuResponse getFullMenu() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        List<Topping> toppings = toppingRepository.findByIsAvailableTrue();
        return new MenuResponse(categories, toppings);
    }
}
