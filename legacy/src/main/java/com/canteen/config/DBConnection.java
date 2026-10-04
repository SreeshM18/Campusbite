package com.canteen.config;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {

    private static String url;
    private static String user;
    private static String password;
    private static String driver;

    static {
        try (InputStream input =
                     DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {

            if (input == null) {
                throw new IllegalStateException("db.properties not found in classpath");
            }

            Properties prop = new Properties();
            prop.load(input);

            url = prop.getProperty("db.url");
            user = prop.getProperty("db.user");
            password = prop.getProperty("db.password");
            driver = prop.getProperty("db.driver");

            // Environment variable overrides for deployment.
            String envUrl = System.getenv("DB_URL");
            if (envUrl != null && !envUrl.isBlank()) {
                url = envUrl;
            }

            String envUser = System.getenv("DB_USER");
            if (envUser != null && !envUser.isBlank()) {
                user = envUser;
            }

            String envPassword = System.getenv("DB_PASSWORD");
            if (envPassword != null && !envPassword.isBlank()) {
                password = envPassword;
            }

            Class.forName(driver);

        } catch (Exception e) {
            throw new ExceptionInInitializerError(
                "Database configuration/driver initialization failed: " + e.getMessage()
            );
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
}
