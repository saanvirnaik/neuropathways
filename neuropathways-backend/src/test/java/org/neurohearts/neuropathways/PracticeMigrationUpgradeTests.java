package org.neurohearts.neuropathways;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import java.sql.DriverManager;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PracticeMigrationUpgradeTests {
    @Test void upgradeFromDeployedV3PreservesExistingDataAndSeedsPracticeOnce() throws Exception {
        String url = "jdbc:h2:mem:practice-upgrade;MODE=PostgreSQL;DB_CLOSE_DELAY=-1";
        Flyway.configure().dataSource(url, "sa", "").target("3").load().migrate();
        try (var connection = DriverManager.getConnection(url, "sa", "");
             var sql = connection.createStatement()) {
            sql.executeUpdate("INSERT INTO users (first_name,last_name,email,password_hash,created_at,updated_at) "
                + "VALUES ('Migration','Fixture','migration@example.invalid','test-only',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)");
            sql.executeUpdate("INSERT INTO contact_messages (name,email,topic,message,created_at,status) "
                + "VALUES ('Fixture','migration@example.invalid','GENERAL','Preserve this fixture',CURRENT_TIMESTAMP,'NEW')");
            var flyway = Flyway.configure().dataSource(url, "sa", "").load();
            assertEquals(7, flyway.migrate().migrationsExecuted);
            try (var rows = sql.executeQuery("SELECT message FROM contact_messages")) {
                assertTrue(rows.next());
                assertEquals("Preserve this fixture", rows.getString(1));
            }
            try (var rows = sql.executeQuery("SELECT email FROM users")) {
                assertTrue(rows.next());
                assertEquals("migration@example.invalid", rows.getString(1));
            }
            try (var rows = sql.executeQuery("SELECT COUNT(*) FROM practice_questions")) {
                assertTrue(rows.next());
                assertEquals(75, rows.getInt(1));
            }
            assertEquals(0, flyway.migrate().migrationsExecuted);
        }
    }
}
