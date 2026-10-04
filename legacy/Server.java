import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class Server {

    private static final int PORT = System.getenv("PORT") != null ? Integer.parseInt(System.getenv("PORT")) : 8080;
    private static final String WEB_ROOT = "./src/main/webapp";

    // Database credentials with environment variable support
    private static final String DB_URL = System.getenv("DB_URL") != null 
        ? System.getenv("DB_URL") 
        : "jdbc:mysql://localhost:3306/canteen_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata";
    private static final String DB_USER = System.getenv("DB_USER") != null 
        ? System.getenv("DB_USER") 
        : "root";
    private static final String DB_PASS = System.getenv("DB_PASSWORD") != null 
        ? System.getenv("DB_PASSWORD") 
        : "YOUR_MYSQL_PASSWORD"; 

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/register", new RegisterHandler());
        server.createContext("/", new StaticFileHandler());

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        System.out.println("==================================================");
        System.out.println("ByteBite Server running on http://localhost:" + PORT + "/login.html");
        System.out.println("==================================================");
        server.start();
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/login.html";

            File file = new File(WEB_ROOT + path);
            if (!file.exists() || file.isDirectory()) {
                String response = "404 Not Found";
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(404, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
                return;
            }

            String contentType = getContentType(path);
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, file.length());

            try (InputStream is = new FileInputStream(file);
                 OutputStream os = exchange.getResponseBody()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
        }

        private String getContentType(String path) {
            if (path.endsWith(".html")) return "text/html";
            if (path.endsWith(".css")) return "text/css";
            if (path.endsWith(".js")) return "application/javascript";
            if (path.endsWith(".json")) return "application/json";
            return "text/plain";
        }
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                System.out.println("\n[LOGIN] Payload received: " + body);

                String email = getParam(body, "email");
                if (email.isEmpty()) email = getParam(body, "collegeEmail");
                String password = getParam(body, "password");

                boolean isValid = checkUser(email, password);
                String jsonResponse = isValid 
                    ? "{\"status\":\"success\", \"message\":\"Login successful\"}"
                    : "{\"status\":\"error\", \"message\":\"Invalid email or password\"}";

                sendJsonResponse(exchange, isValid ? 200 : 401, jsonResponse);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }

        private boolean checkUser(String email, String password) {
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?")) {
                stmt.setString(1, email);
                stmt.setString(2, password);
                try (ResultSet rs = stmt.executeQuery()) {
                    boolean found = rs.next();
                    System.out.println("[LOGIN] User found in database: " + found);
                    return found;
                }
            } catch (SQLException e) {
                System.err.println("[LOGIN ERROR] " + e.getMessage());
                return false;
            }
        }
    }

    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                System.out.println("\n[REGISTER] Payload received: " + body);

                String name = getParam(body, "name");
                if (name.isEmpty()) name = getParam(body, "fullName");

                String email = getParam(body, "email");
                if (email.isEmpty()) email = getParam(body, "collegeEmail");

                String password = getParam(body, "password");
                String role = getParam(body, "role");
                if (role.isEmpty()) role = "Student";

                boolean success = registerUser(name, email, password, role);
                String jsonResponse = success 
                    ? "{\"status\":\"success\", \"message\":\"Registered successfully\"}"
                    : "{\"status\":\"error\", \"message\":\"Registration failed\"}";

                sendJsonResponse(exchange, success ? 200 : 400, jsonResponse);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }

        private boolean registerUser(String name, String email, String password, String role) {
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")) {
                stmt.setString(1, name);
                stmt.setString(2, email);
                stmt.setString(3, password);
                stmt.setString(4, role);
                int rows = stmt.executeUpdate();
                System.out.println("[REGISTER] Rows inserted: " + rows);
                return rows > 0;
            } catch (SQLException e) {
                System.err.println("[REGISTER ERROR] " + e.getMessage());
                return false;
            }
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
             BufferedReader br = new BufferedReader(isr)) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    private static String getParam(String body, String key) {
        for (String pair : body.split("&")) {
            String[] kv = pair.split("=");
            if (kv.length > 1 && kv[0].equalsIgnoreCase(key)) {
                return java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
            }
        }
        return "";
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}