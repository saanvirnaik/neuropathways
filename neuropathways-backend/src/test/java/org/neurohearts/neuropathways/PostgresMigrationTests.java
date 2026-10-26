package org.neurohearts.neuropathways;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.jdbc.core.JdbcTemplate;
import org.flywaydb.core.Flyway;
import static org.junit.jupiter.api.Assertions.assertEquals;

// CI uses a disposable PostgreSQL database. Never point this at a learner database.
@EnabledIfEnvironmentVariable(named = "TEST_POSTGRES_URL", matches = ".+")
@ActiveProfiles("prod")
@SpringBootTest(properties = {
    "spring.datasource.url=${TEST_POSTGRES_URL}",
    "spring.datasource.username=${TEST_POSTGRES_USER}",
    "spring.datasource.password=${TEST_POSTGRES_PASSWORD}",
    "app.jwt.secret=TestOnlySecretNotForDeployment01234567890123456789",
    "app.cors.allowed-origins=https://staging.example.com"
})
class PostgresMigrationTests {
    @Autowired JdbcTemplate jdbc;
    @Autowired Flyway flyway;
    @Test void freshPostgresSchemaAndRepeatMigration() {
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
    }
}
