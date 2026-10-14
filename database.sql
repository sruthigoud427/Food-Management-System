CREATE DATABASE IF NOT EXISTS food_ordering;
USE food_ordering;

CREATE TABLE IF NOT EXISTS food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL,
    category ENUM('Vegetarian', 'Non-Vegetarian') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    availability BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO food (food_name, category, price, description, availability) VALUES
('Margherita Pizza', 'Vegetarian', 199.00, 'Classic cheese pizza with tomato and basil.', TRUE),
('Veg Burger', 'Vegetarian', 99.00, 'Crispy veggie patty with fresh lettuce.', TRUE),
('Chicken Biryani', 'Non-Vegetarian', 249.00, 'Aromatic rice with spices and chicken.', TRUE),
('Paneer Tikka', 'Vegetarian', 179.00, 'Grilled paneer with a flavorful marinade.', FALSE);
