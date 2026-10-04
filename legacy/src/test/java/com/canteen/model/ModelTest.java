package com.canteen.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ModelTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Test User model getters, setters, and JSON serialization")
    public void testUserModel() throws Exception {
        User user = new User(1, "John Doe", "john@example.com", "secure123", "STUDENT");
        
        assertEquals(1, user.getUserId());
        assertEquals("John Doe", user.getName());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("secure123", user.getPassword());
        assertEquals("STUDENT", user.getRole());

        String json = objectMapper.writeValueAsString(user);
        assertTrue(json.contains("John Doe"));
        assertTrue(json.contains("john@example.com"));

        User deserialized = objectMapper.readValue(json, User.class);
        assertEquals(user.getName(), deserialized.getName());
        assertEquals(user.getEmail(), deserialized.getEmail());
    }

    @Test
    @DisplayName("Test MenuItem model getters, setters, and JSON serialization")
    public void testMenuItemModel() throws Exception {
        MenuItem item = new MenuItem(101, "Veg Biryani", "Lunch", 90.00, true);
        
        assertEquals(101, item.getItemId());
        assertEquals("Veg Biryani", item.getName());
        assertEquals("Lunch", item.getCategory());
        assertEquals(90.00, item.getPrice(), 0.001);
        assertTrue(item.isAvailable());

        item.setAvailable(false);
        assertFalse(item.isAvailable());

        String json = objectMapper.writeValueAsString(item);
        assertTrue(json.contains("Veg Biryani"));
        assertTrue(json.contains("90.0"));
    }

    @Test
    @DisplayName("Test Order and OrderItem model aggregation")
    public void testOrderAndOrderItems() throws Exception {
        OrderItem item1 = new OrderItem(1, 2, 90.00);
        item1.setItemName("Veg Biryani");
        item1.setOrderItemId(10);
        item1.setOrderId(50);

        assertEquals(10, item1.getOrderItemId());
        assertEquals(50, item1.getOrderId());
        assertEquals(1, item1.getItemId());
        assertEquals("Veg Biryani", item1.getItemName());
        assertEquals(2, item1.getQuantity());
        assertEquals(90.00, item1.getPrice(), 0.001);

        Order order = new Order();
        order.setOrderId(50);
        order.setUserId(1);
        order.setUserName("John Doe");
        order.setTotalAmount(180.00);
        order.setStatus("PENDING");
        order.setPickupTime("12:30 PM");
        order.setItems(List.of(item1));

        assertEquals(50, order.getOrderId());
        assertEquals(1, order.getUserId());
        assertEquals("John Doe", order.getUserName());
        assertEquals(180.00, order.getTotalAmount(), 0.001);
        assertEquals("PENDING", order.getStatus());
        assertEquals("12:30 PM", order.getPickupTime());
        assertEquals(1, order.getItems().size());

        String json = objectMapper.writeValueAsString(order);
        assertTrue(json.contains("180.0"));
        assertTrue(json.contains("PENDING"));
        assertTrue(json.contains("12:30 PM"));
    }
}
