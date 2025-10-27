-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_firstName VARCHAR(50) NOT NULL,
    user_lastName VARCHAR(50) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    company_role VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create user_role table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_role (
    user_role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    user_email VARCHAR(100) NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATETIME NOT NULL,
    habesha_cookies_quantity INT NOT NULL DEFAULT 0,
    baklava_quantity INT NOT NULL DEFAULT 0,
    almunium_phoil_quantity INT NOT NULL DEFAULT 0,
    packaging_type ENUM('small', 'large', 'small and large') NOT NULL DEFAULT 'small',
    special_instructions TEXT,
    order_status ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    total_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    address_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    shipping_option VARCHAR(100),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert initial roles
INSERT INTO roles (company_role) 
VALUES ('Customer'), 
       ('Staff'), 
       ('Manager'), 
       ('Admin');

-- Replace this bcrypt hash with a real one generated from your environment for password '12345678'
-- Example of generating hash in Node.js: bcrypt.hash('12345678', 10)
INSERT INTO users (user_firstName, user_lastName, user_email, user_password) 
VALUES ('Admin', 'User', 'admin@injeradelivery.com', '$2a$10$N9qo8uLOickgx2ZMRZo5i.uW0Rf7LRHhkH/Uv8L75W59xkKi1s7dO');

-- Assign Admin role to the default user
INSERT INTO user_role (user_id, role_id)
VALUES (
  (SELECT user_id FROM users WHERE user_email = 'admin@injeradelivery.com'),
  (SELECT role_id FROM roles WHERE company_role = 'Admin')
);

-- Indexes for performance optimization
CREATE INDEX idx_order_status ON orders(order_status);
CREATE INDEX idx_delivery_date ON orders(delivery_date);
CREATE INDEX idx_user_email ON users(user_email);
