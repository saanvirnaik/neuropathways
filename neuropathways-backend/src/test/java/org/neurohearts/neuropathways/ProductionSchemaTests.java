package org.neurohearts.neuropathways;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.jdbc.core.JdbcTemplate;
import org.flywaydb.core.Flyway;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("prod")
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:migrations;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa", "spring.datasource.password=",
    "app.jwt.secret=TestOnlySecretNotForDeployment01234567890123456789",
    "app.cors.allowed-origins=https://staging.example.com"
})
class ProductionSchemaTests {
    @Autowired JdbcTemplate jdbc;
    @Autowired Flyway flyway;
    @Test void migrationSeedsOnlyQuestionsAndCanRunAgain() {
        assertEquals(15, jdbc.queryForObject("select count(*) from assessment_questions", Integer.class));
        assertEquals(0, jdbc.queryForObject("select count(*) from users", Integer.class));
        assertEquals(0, flyway.migrate().migrationsExecuted);
        assertEquals(15, jdbc.queryForObject("select count(*) from assessment_questions", Integer.class));
    }
}
