package com.canteen.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.canteen.dao.MenuDAO;
import com.canteen.model.MenuItem;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/menu/*")
public class MenuController extends HttpServlet {

    private final MenuDAO menuDAO = new MenuDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // GET /api/menu -> Get available items | GET /api/menu/all -> Get all items
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String pathInfo = req.getPathInfo();
        List<MenuItem> items;

        if ("/all".equals(pathInfo)) {
            items = menuDAO.getAllItems();
        } else {
            items = menuDAO.getAllAvailableItems();
        }

        objectMapper.writeValue(resp.getWriter(), items);
    }

    // PUT /api/menu/availability -> Toggle availability status
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Use TypeReference to avoid the unchecked conversion warning:
Map<String, Object> reqData = objectMapper.readValue(
    req.getInputStream(), 
    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
);
        int itemId = (Integer) reqData.get("itemId");
        boolean isAvailable = (Boolean) reqData.get("isAvailable");

        boolean updated = menuDAO.updateAvailability(itemId, isAvailable);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", updated);
        responseMap.put("message", updated ? "Item status updated." : "Failed to update item status.");

        resp.setStatus(updated ? HttpServletResponse.SC_OK : HttpServletResponse.SC_BAD_REQUEST);
        objectMapper.writeValue(resp.getWriter(), responseMap);
    }
}