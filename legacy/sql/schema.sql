-- Canteen Pre-Order System - MySQL schema

CREATE DATABASE IF NOT EXISTS canteen_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE canteen_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    pickup_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu
        FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Sample menu data
INSERT INTO menu_items (name, category, price, is_available)
SELECT 'Idli', 'Breakfast', 30.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Idli');

INSERT INTO menu_items (name, category, price, is_available)
SELECT 'Masala Dosa', 'Breakfast', 60.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Masala Dosa');

INSERT INTO menu_items (name, category, price, is_available)
SELECT 'Veg Biriyani', 'Lunch', 90.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Veg Biriyani');

INSERT INTO menu_items (name, category, price, is_available)
SELECT 'Chicken Biriyani', 'Lunch', 120.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Chicken Biriyani');

INSERT INTO menu_items (name, category, price, is_available)
SELECT 'French Fries', 'Snacks', 50.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'French Fries');

INSERT INTO menu_items (name, category, price, is_available)
SELECT 'Cold Coffee', 'Beverages', 60.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Cold Coffee');
