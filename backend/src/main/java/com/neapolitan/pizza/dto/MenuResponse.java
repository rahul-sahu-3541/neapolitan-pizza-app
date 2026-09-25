package com.neapolitan.pizza.dto;

import com.neapolitan.pizza.model.Category;
import com.neapolitan.pizza.model.Topping;

import java.util.List;

public class MenuResponse {
    private List<Category> categories;
    private List<Topping> availableToppings;

    public MenuResponse() {}

    public MenuResponse(List<Category> categories, List<Topping> availableToppings) {
        this.categories = categories;
        this.availableToppings = availableToppings;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<Topping> getAvailableToppings() {
        return availableToppings;
    }

    public void setAvailableToppings(List<Topping> availableToppings) {
        this.availableToppings = availableToppings;
    }
}
