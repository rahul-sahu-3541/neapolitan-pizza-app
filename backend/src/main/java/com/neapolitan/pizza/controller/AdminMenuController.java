package com.neapolitan.pizza.controller;

import com.neapolitan.pizza.dto.MenuItemRequest;
import com.neapolitan.pizza.model.MenuItem;
import com.neapolitan.pizza.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/menu")
public class AdminMenuController {

    private final MenuService menuService;

    public AdminMenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping("/items")
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuService.createMenuItem(request);
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
