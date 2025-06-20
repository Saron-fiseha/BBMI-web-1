-- Drop and recreate categories table to ensure proper structure
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table with proper structure
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT '',
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Insert sample data to test
INSERT INTO categories (name, description, image_url, level, status) VALUES
('Hair Styling', 'Professional hair cutting, styling, and treatment techniques', '/placeholder.svg?height=200&width=300', 'beginner', 'active'),
('Makeup Artistry', 'Professional makeup techniques and application for all occasions', '/placeholder.svg?height=200&width=300', 'intermediate', 'active'),
('Skincare & Facial', 'Advanced skincare treatments and facial procedures', '/placeholder.svg?height=200&width=300', 'advanced', 'active');

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- Test data insertion
SELECT * FROM categories ORDER BY created_at DESC;
