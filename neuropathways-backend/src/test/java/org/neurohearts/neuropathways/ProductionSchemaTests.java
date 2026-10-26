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
        assertEquals(0, jdbc.queryForObject("select count(*) from contact_messages", Integer.class));
        assertEquals(75, jdbc.queryForObject("select count(*) from practice_questions", Integer.class));
        assertEquals(15, jdbc.queryForObject("select count(*) from (select skill, difficulty from practice_questions where active = true group by skill, difficulty having count(*) >= 5) available_groups", Integer.class));
        assertEquals(0, jdbc.queryForObject("select count(*) from practice_sessions", Integer.class));
        assertEquals(0, jdbc.queryForObject("select count(*) from practice_session_questions", Integer.class));
        assertEquals(0, jdbc.queryForObject("select count(*) from practice_responses", Integer.class));
        assertEquals(0, flyway.migrate().migrationsExecuted);
        assertEquals(75, jdbc.queryForObject("select count(*) from practice_questions", Integer.class));
        assertEquals(15, jdbc.queryForObject("select count(*) from assessment_questions", Integer.class));
    }
}
