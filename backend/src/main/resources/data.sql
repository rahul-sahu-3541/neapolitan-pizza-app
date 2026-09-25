-- 1. Categories
INSERT INTO categories (id, name, description, display_order) VALUES
(1, 'Pizze Rosse', 'Classic red sauce pizzas made with sweet Italian San Marzano D.O.P. tomatoes', 1),
(2, 'Pizze Bianche', 'White base pizzas featuring creamy Fior di Latte mozzarella and aged cheeses', 2),
(3, 'Antipasti & Sides', 'Wood-fired appetisers and starters from our stone oven', 3),
(4, 'Dolci', 'Authentic Italian desserts made in-house fresh daily', 4),
(5, 'Bevande', 'Refreshing sparkling sodas and Italian beverages', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Menu Items (with authentic Neapolitan descriptions & Indian dietary tags)
INSERT INTO menu_items (id, category_id, name, description, sourdough_notes, base_price, dietary_type, image_url, is_available) VALUES
(1, 1, 'Margherita D.O.P.', 
    'San Marzano D.O.P. tomatoes, fresh Fior di Latte mozzarella, fresh sweet basil, and extra virgin olive oil.', 
    '48h cold fermented sourdough with light, airy cornicione (crust). High digestibility.', 
    495.00, 'VEG', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', true),

(2, 1, 'Marinara Tradizionale', 
    'Sweet San Marzano tomatoes, sliced garlic, wild Sicilian oregano, and cold-pressed extra virgin olive oil. The oldest traditional pizza from Naples.', 
    'Naturally 100% plant-based and vegan. Ultra crisp and aromatic.', 
    425.00, 'VEG', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', true),

(3, 1, 'Burrata & Pesto Genovese', 
    'San Marzano base, topped fresh post-bake with a whole creamy artisanal Burrata ball, cherry tomatoes, and cold-pressed pine-nut basil pesto.', 
    'Served warm with chilled creamy burrata center for contrasting textures.', 
    595.00, 'VEG', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', true),

(4, 1, 'Diavola Calabra', 
    'San Marzano tomato sauce, fior di latte, spicy Italian salumi / pepperoni, and a generous drizzle of hot chili-infused honey.', 
    'Sweet heat balance with 90-second charred crust blister.', 
    595.00, 'NON_VEG', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', true),

(5, 1, 'Pollo Affumicato e Peperoni', 
    'San Marzano tomatoes, fior di latte, hickory-smoked pulled chicken breast, fire-roasted sweet bell peppers, and fresh oregano.', 
    'Smoky tenderness with blistered cornicione.', 
    565.00, 'NON_VEG', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', true),

(6, 2, 'Quattro Formaggi', 
    'White base with Fior di latte, sharp Gorgonzola blue cheese, 24-month Parmigiano-Reggiano, and smoked Scamorza.', 
    'Rich cheese blend perfectly balanced with high-temperature wood fire.', 
    575.00, 'VEG', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', true),

(7, 2, 'Tartufo e Funghi Selvatici', 
    'Piedmontese black truffle cream, sautéed wild button mushrooms, garlic confit, fior di latte, and cracked tellicherry pepper.', 
    'Earthy umami flavor with blistered puffed crust.', 
    625.00, 'VEG', 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80', true),

(8, 3, 'Wood-Fired Garlic & Rosemary Focaccia', 
    'Puffed 48h sourdough flatbread infused with roasted garlic confit, rosemary leaves, sea salt flakes, and cold-pressed EVOO.', 
    'Baked in 90 seconds. Ideal table starter.', 
    275.00, 'VEG', 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80', true),

(9, 4, 'Classico Tiramisù al Mascarpone', 
    'Authentic Italian savoiardi ladyfingers soaked in dark espresso, layered with whipped Italian mascarpone cream and dusted with raw cocoa powder.', 
    'Made fresh in-house daily.', 
    345.00, 'VEG', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', true),

(10, 5, 'San Pellegrino Aranciata Rossa', 
    'Italian sparkling blood orange soda, 330ml can.', 
    'Natural citrus soda imported from Italy.', 
    220.00, 'VEG', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', true),

(11, 5, 'San Pellegrino Limonata', 
    'Zesty sparkling lemon beverage made with Mediterranean lemons, 330ml can.', 
    'Crisp palate cleanser for pizza.', 
    220.00, 'VEG', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Toppings / Add-ons (Indian market customizable)
INSERT INTO toppings (id, name, price, dietary_type, is_available) VALUES
(1, 'Fresh Artisanal Burrata Ball', 150.00, 'VEG', true),
(2, 'Hot Calabrian Chili Honey Drizzle', 60.00, 'VEG', true),
(3, 'Extra Fior di Latte Mozzarella', 80.00, 'VEG', true),
(4, 'White Truffle Oil Drizzle', 90.00, 'VEG', true),
(5, 'Pickled Jalapeño Slices', 40.00, 'VEG', true),
(6, 'Smoked Spicy Pepperoni', 140.00, 'NON_VEG', true),
(7, 'Herb Roast Pulled Chicken', 120.00, 'NON_VEG', true)
ON CONFLICT (id) DO NOTHING;
