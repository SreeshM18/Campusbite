package com.canteen.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.canteen.dao.OrderDAO;
import com.canteen.model.Order;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/orders/*")
public class OrderController extends HttpServlet {

    private final OrderDAO orderDAO = new OrderDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // GET /api/orders?userId=1 -> Get user order history
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String userIdParam = req.getParameter("userId");
        if (userIdParam != null) {
            int userId = Integer.parseInt(userIdParam);
            List<Order> orders = orderDAO.getOrdersByUserId(userId);
            objectMapper.writeValue(resp.getWriter(), orders);
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), Map.of("error", "Missing userId parameter"));
        }
    }

    // POST /api/orders -> Place new pre-order
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        Order order = objectMapper.readValue(req.getInputStream(), Order.class);
        boolean success = orderDAO.placeOrder(order);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", success);
        responseMap.put("message", success ? "Pre-order placed successfully!" : "Failed to place order.");

        resp.setStatus(success ? HttpServletResponse.SC_CREATED : HttpServletResponse.SC_BAD_REQUEST);
        objectMapper.writeValue(resp.getWriter(), responseMap);
    }

    // PUT /api/orders/status -> Update status (PENDING -> PREPARING -> READY_FOR_PICKUP)
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Use TypeReference to avoid the unchecked conversion warning:
Map<String, Object> reqData = objectMapper.readValue(
    req.getInputStream(), 
    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
);
        int orderId = (Integer) reqData.get("orderId");
        String status = (String) reqData.get("status");

        boolean updated = orderDAO.updateOrderStatus(orderId, status);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", updated);
        responseMap.put("message", updated ? "Order status updated." : "Failed to update order status.");

        resp.setStatus(updated ? HttpServletResponse.SC_OK : HttpServletResponse.SC_BAD_REQUEST);
        objectMapper.writeValue(resp.getWriter(), responseMap);
    }
}