# MySQL Setup

1. Install MySQL Server and start the MySQL service.
2. Open MySQL Workbench or the MySQL command line.
3. Run `sql/schema.sql`.
4. Open `src/main/resources/db.properties`.
5. Replace `YOUR_MYSQL_PASSWORD` with the password of the MySQL `root` user.
6. Build the project:
   `mvn clean package`
7. Deploy `target/canteen-preorder-system.war` to Tomcat 10+.
8. Open the application through Tomcat.

For deployments, you can leave the password placeholder in `db.properties` and set the
`DB_PASSWORD` environment variable instead.

Important:
- Do not keep the old MariaDB JAR in the classpath.
- Do not run an old WAR from the `target` folder; rebuild after changing the database driver.
- The JDBC driver is now `com.mysql.cj.jdbc.Driver`.
- The JDBC URL is now `jdbc:mysql://localhost:3306/canteen_db`.
