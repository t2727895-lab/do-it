-- Run this against the `quilnix` database
-- mysql -u root -p quilnix < database/migrations/create_contact_leads.sql

CREATE TABLE IF NOT EXISTS contact_leads (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    phone       VARCHAR(50)     NULL,
    company     VARCHAR(255)    NULL,
    subject     VARCHAR(255)    NULL,
    message     TEXT            NOT NULL,
    ip_address  VARCHAR(45)     NULL COMMENT 'IPv4 or IPv6 of submitter',
    user_agent  VARCHAR(500)    NULL COMMENT 'Browser user agent',
    status      ENUM('new','contacted','converted','spam') NOT NULL DEFAULT 'new',
    notes       TEXT            NULL COMMENT 'Internal admin notes',
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email      (email),
    INDEX idx_status     (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
