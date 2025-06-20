-- Drop and recreate categories table with proper structure
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Insert sample categories
INSERT INTO categories (name, description, image_url, level, status) VALUES
('Makeup Artistry', 'Professional makeup techniques and application for various occasions', '/placeholder.svg?height=200&width=300', 'intermediate', 'active'),
('Hair Styling', 'Hair cutting, styling, and treatment techniques for modern salon services', '/placeholder.svg?height=200&width=300', 'beginner', 'active'),
('Skincare & Facial', 'Advanced skincare treatments and facial procedures for healthy skin', '/placeholder.svg?height=200&width=300', 'advanced', 'active'),
('Nail Art & Manicure', 'Creative nail art designs and professional manicure techniques', '/placeholder.svg?height=200&width=300', 'beginner', 'active'),
('Eyebrow & Lash', 'Eyebrow shaping, tinting, and eyelash extension services', '/placeholder.svg?height=200&width=300', 'intermediate', 'active');

-- Verify the table was created successfully
SELECT 'Categories table created successfully with ' || COUNT(*) || ' sample records' as result FROM categories;
