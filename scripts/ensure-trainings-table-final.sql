-- Drop and recreate trainings table with proper structure
DROP TABLE IF EXISTS trainings CASCADE;

-- Create trainings table
CREATE TABLE trainings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    course_code VARCHAR(100) NOT NULL UNIQUE,
    category_id INTEGER,
    price DECIMAL(10,2) DEFAULT 0,
    discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    max_trainees INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_trainings_category_id ON trainings(category_id);
CREATE INDEX idx_trainings_status ON trainings(status);
CREATE INDEX idx_trainings_course_code ON trainings(course_code);
CREATE INDEX idx_trainings_created_at ON trainings(created_at);

-- Insert sample trainings (using category IDs that should exist)
INSERT INTO trainings (name, description, image_url, course_code, category_id, price, discount, max_trainees, status) VALUES
('Advanced Makeup Techniques', 'Master professional makeup artistry with advanced color theory and application techniques', '/placeholder.svg?height=200&width=300', 'MKP-ADV-001', 1, 299.99, 10, 15, 'active'),
('Hair Cutting & Styling Basics', 'Learn fundamental hair cutting techniques and modern styling methods', '/placeholder.svg?height=200&width=300', 'HAIR-BAS-001', 2, 199.99, 0, 20, 'active'),
('Professional Skincare Treatments', 'Advanced facial treatments and skincare analysis for professional results', '/placeholder.svg?height=200&width=300', 'SKIN-PRO-001', 3, 399.99, 15, 12, 'active'),
('Creative Nail Art Design', 'Explore creative nail art techniques and professional manicure services', '/placeholder.svg?height=200&width=300', 'NAIL-ART-001', 4, 149.99, 5, 18, 'active'),
('Eyebrow Shaping & Tinting', 'Professional eyebrow shaping, tinting, and enhancement techniques', '/placeholder.svg?height=200&width=300', 'BROW-SHP-001', 5, 179.99, 0, 16, 'draft');

-- Verify the table was created successfully
SELECT 'Trainings table created successfully with ' || COUNT(*) || ' sample records' as result FROM trainings;
