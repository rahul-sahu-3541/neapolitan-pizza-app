package com.neapolitan.pizza.controller;

import com.neapolitan.pizza.dto.MenuResponse;
import com.neapolitan.pizza.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<MenuResponse> getMenu() {
        return ResponseEntity.ok(menuService.getFullMenu());
    }
}
