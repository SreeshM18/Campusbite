package com.canteen.model;

public class MenuItem {
    private int itemId;
    private String name;
    private String category;
    private double price;
    private boolean isAvailable;

    public MenuItem() {}

    public MenuItem(int itemId, String name, String category, double price, boolean isAvailable) {
        this.itemId = itemId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.isAvailable = isAvailable;
    }

    // Getters and Setters
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
}