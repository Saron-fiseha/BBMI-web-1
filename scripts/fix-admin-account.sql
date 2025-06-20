-- Delete existing admin account if it exists
DELETE FROM users WHERE email = 'admin@glamour.com';

-- Insert admin account with properly hashed password (Admin@123)
-- This hash is generated using bcrypt with salt rounds 12
INSERT INTO users (name, email, password_hash, role, phone, address, status, created_at, updated_at) VALUES 
('System Administrator', 'admin@glamour.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'admin', '+1234567890', '123 Admin Street, Admin City', 'active', NOW(), NOW());

-- Verify the admin account was created
SELECT id, name, email, role, status FROM users WHERE email = 'admin@glamour.com';
