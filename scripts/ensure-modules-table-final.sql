-- Drop and recreate modules table with proper structure
DROP TABLE IF EXISTS modules CASCADE;

-- Create modules table with all necessary fields
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    program VARCHAR(255),
    video_url TEXT,
    duration INTEGER DEFAULT 0, -- in minutes
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    training_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_modules_status ON modules(status);
CREATE INDEX idx_modules_training_id ON modules(training_id);
CREATE INDEX idx_modules_order ON modules(order_index);
CREATE INDEX idx_modules_created_at ON modules(created_at);

-- Insert sample modules data
INSERT INTO modules (name, code, description, program, video_url, duration, order_index, status, training_id) VALUES
('Basic Facial Techniques', 'MOD001', 'Learn fundamental facial treatment techniques including cleansing, exfoliation, and moisturizing.', 'Facial Specialist Program', 'https://example.com/video1', 45, 1, 'active', 1),
('Advanced Skincare Analysis', 'MOD002', 'Master the art of skin analysis and treatment customization for different skin types.', 'Advanced Skincare Program', 'https://example.com/video2', 60, 2, 'active', 2),
('Hair Cutting Fundamentals', 'MOD003', 'Essential hair cutting techniques and tools for professional stylists.', 'Hair Styling Program', 'https://example.com/video3', 90, 1, 'draft', 3),
('Makeup Application Basics', 'MOD004', 'Foundation techniques for professional makeup application and color theory.', 'Makeup Artist Program', 'https://example.com/video4', 75, 1, 'active', 4),
('Nail Art Techniques', 'MOD005', 'Creative nail art designs and advanced manicure techniques.', 'Nail Technician Program', 'https://example.com/video5', 50, 2, 'inactive', 5);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Modules table created successfully with % sample records', (SELECT COUNT(*) FROM modules);
END $$;
