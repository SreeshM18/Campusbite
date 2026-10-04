package com.canteen.dao;

import com.canteen.config.DBConnection;
import com.canteen.model.Order;
import com.canteen.model.OrderItem;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    // Place a new pre-order (inserts order + order_items atomically)
    public boolean placeOrder(Order order) {
        String insertOrderSql = "INSERT INTO orders (user_id, total_amount, status, pickup_time) VALUES (?, ?, 'PENDING', ?)";
        String insertOrderItemSql = "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start Transaction

            // 1. Insert Order
            PreparedStatement stmtOrder = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS);
            stmtOrder.setInt(1, order.getUserId());
            stmtOrder.setDouble(2, order.getTotalAmount());
            stmtOrder.setString(3, order.getPickupTime());
            stmtOrder.executeUpdate();

            ResultSet rsKey = stmtOrder.getGeneratedKeys();
            int orderId = 0;
            if (rsKey.next()) {
                orderId = rsKey.getInt(1);
            }

            // 2. Insert Order Items
            PreparedStatement stmtItem = conn.prepareStatement(insertOrderItemSql);
            for (OrderItem item : order.getItems()) {
                stmtItem.setInt(1, orderId);
                stmtItem.setInt(2, item.getItemId());
                stmtItem.setInt(3, item.getQuantity());
                stmtItem.setDouble(4, item.getPrice());
                stmtItem.addBatch();
            }
            stmtItem.executeBatch();

            conn.commit(); // Commit Transaction
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
            return false;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
    }

    // Get orders by student user ID
    public List<Order> getOrdersByUserId(int userId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getInt("order_id"));
                order.setUserId(rs.getInt("user_id"));
                order.setTotalAmount(rs.getDouble("total_amount"));
                order.setStatus(rs.getString("status"));
                order.setPickupTime(rs.getString("pickup_time"));
                order.setCreatedAt(rs.getTimestamp("created_at"));
                orders.add(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    // Update order status (for Canteen Staff)
    public boolean updateOrderStatus(int orderId, String status) {
        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, status);
            stmt.setInt(2, orderId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}