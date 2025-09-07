-- Create database
CREATE DATABASE IF NOT EXISTS adminpanel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Select database
USE adminpanel;

-- Server Table: save servers information to manage
CREATE TABLE IF NOT EXISTS servers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  host VARCHAR(100) NOT NULL,
  port INT NOT NULL DEFAULT 22,
  bandwidth_limit BIGINT DEFAULT 0,
  bandwidth_used BIGINT DEFAULT 0
);

-- Audit table: save active log
CREATE TABLE IF NOT EXISTS audit (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  meta JSON NULL
);

-- Users table: manage user
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user','guest') NOT NULL DEFAULT 'guest'
);

-- Connections table: save session connect to server
CREATE TABLE IF NOT EXISTS connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id INT NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP NULL,
  status ENUM('active','closed') DEFAULT 'active',
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

-- Default user (admin/admin123) - change it after running 
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$12$yvZQuoKrt1qCEQM1R9t0B.5XORbIT6xUsXoRe4ANlpxH1ZOBdTq3O', 'admin')
ON DUPLICATE KEY UPDATE username = username;
-- Password hash above = bcrypt("admin123")
