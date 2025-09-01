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
  host VARCHAR(255) NOT NULL,
  port INT NOT NULL DEFAULT 22,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit table: lưu log hoạt động
CREATE TABLE IF NOT EXISTS audit (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  meta JSON NULL
);

-- Bảng users: quản lý user đăng nhập web admin
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng connections: lưu session kết nối tới server
CREATE TABLE IF NOT EXISTS connections (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  server_id INT NOT NULL,
  user_id INT NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  status ENUM('active','closed') DEFAULT 'active',
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo user mặc định (admin/admin123) - bạn nên đổi mật khẩu sau khi chạy
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$10$eB4QipDqA9Lk3S4Xo0G6sOpWeT3QfM4pN1fFUp.e3ZwnmAHLf5Qq6', 'admin')
ON DUPLICATE KEY UPDATE username = username;
-- Password hash ở trên = bcrypt("admin123")
