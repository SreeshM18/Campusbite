package com.canteen.controller;

import com.canteen.dao.UserDAO;
import com.canteen.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthController extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String pathInfo = req.getPathInfo();
        Map<String, Object> responseMap = new HashMap<>();

        if ("/register".equals(pathInfo)) {
            User user = objectMapper.readValue(req.getInputStream(), User.class);
            boolean success = userDAO.registerUser(user);

            responseMap.put("success", success);
            responseMap.put("message", success ? "User registered successfully!" : "Registration failed.");
            resp.setStatus(success ? HttpServletResponse.SC_CREATED : HttpServletResponse.SC_BAD_REQUEST);

        } else if ("/login".equals(pathInfo)) {
            User loginReq = objectMapper.readValue(req.getInputStream(), User.class);
            User user = userDAO.loginUser(loginReq.getEmail(), loginReq.getPassword());

            if (user != null) {
                // Store user session
                req.getSession().setAttribute("user", user);

                responseMap.put("success", true);
                responseMap.put("message", "Login successful!");
                responseMap.put("user", user);
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                responseMap.put("success", false);
                responseMap.put("message", "Invalid email or password.");
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            responseMap.put("error", "Endpoint not found");
        }

        objectMapper.writeValue(resp.getWriter(), responseMap);
    }
}