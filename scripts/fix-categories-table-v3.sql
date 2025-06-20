-- Drop and recreate categories table with proper structure
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Insert sample categories for testing
INSERT INTO categories (name, description, image_url, level, status) VALUES
('Hair Styling Basics', 'Learn fundamental hair styling techniques including cutting, coloring, and basic treatments', '', 'beginner', 'active'),
('Advanced Makeup Artistry', 'Master professional makeup techniques for special events, photography, and bridal services', '', 'advanced', 'active'),
('Nail Art & Design', 'Creative nail art techniques, gel applications, and professional manicure/pedicure services', '', 'intermediate', 'active'),
('Skincare & Facials', 'Professional skincare treatments, facial techniques, and skin analysis methods', '', 'beginner', 'active'),
('Eyebrow & Lash Services', 'Eyebrow shaping, tinting, lash extensions, and enhancement techniques', '', 'intermediate', 'active');

-- Verify the table was created successfully
SELECT 'Categories table created successfully with ' || COUNT(*) || ' sample records' as result FROM categories;
