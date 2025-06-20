-- Ensure categories table exists with proper structure
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);

-- Insert some sample categories if table is empty
INSERT INTO categories (name, description, image_url, level, status)
SELECT 'Makeup Artistry', 'Professional makeup techniques and application', '/placeholder.svg?height=200&width=300', 'intermediate', 'active'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Makeup Artistry');

INSERT INTO categories (name, description, image_url, level, status)
SELECT 'Hair Styling', 'Hair cutting, styling, and treatment techniques', '/placeholder.svg?height=200&width=300', 'beginner', 'active'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Hair Styling');

INSERT INTO categories (name, description, image_url, level, status)
SELECT 'Skincare & Facial', 'Advanced skincare treatments and facial procedures', '/placeholder.svg?height=200&width=300', 'advanced', 'active'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Skincare & Facial');
