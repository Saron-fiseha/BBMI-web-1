-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS trainings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table first
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update users table to ensure it has all required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add constraint to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'instructor', 'student'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_status_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended'));
    END IF;
END $$;

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_paid BOOLEAN DEFAULT false,
    mentor_name VARCHAR(255),
    mentor_address TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trainings table
CREATE TABLE trainings (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    course_code VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,
    max_trainees INTEGER DEFAULT 0,
    duration_hours INTEGER DEFAULT 0,
    instructor_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    training_id INTEGER REFERENCES trainings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module_code VARCHAR(50) NOT NULL,
    youtube_video_id VARCHAR(50),
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    training_id INTEGER REFERENCES trainings(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, training_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trainings_category ON trainings(category_id);
CREATE INDEX IF NOT EXISTS idx_trainings_project ON trainings(project_id);
CREATE INDEX IF NOT EXISTS idx_modules_training ON modules(training_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_training ON enrollments(training_id);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES 
('admin', 'Full system access', '{"all": true}'),
('instructor', 'Can manage assigned courses and students', '{"courses": ["read", "update"], "students": ["read"]}'),
('student', 'Can access enrolled courses', '{"courses": ["read"], "profile": ["read", "update"]}')
ON CONFLICT (name) DO NOTHING;

-- Insert test admin user (password is Admin@123)
INSERT INTO users (name, email, password_hash, role, phone, address, status) VALUES 
('System Administrator', 'admin@glamour.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'admin', '+1234567890', '123 Admin Street, Admin City', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, level) VALUES 
('Makeup Artistry', 'Professional makeup techniques and applications', 'intermediate'),
('Hair Styling', 'Hair cutting, styling, and treatment techniques', 'beginner'),
('Skincare', 'Facial treatments and skincare routines', 'beginner'),
('Nail Care', 'Manicure, pedicure, and nail art techniques', 'beginner')
ON CONFLICT DO NOTHING;

-- Insert sample project
INSERT INTO projects (name, description, is_paid, mentor_name, mentor_address) VALUES 
('Beauty Professional Certification', 'Comprehensive beauty training program', true, 'Sarah Johnson', '456 Beauty Ave, Glamour City')
ON CONFLICT DO NOTHING;

-- Insert sample trainings
INSERT INTO trainings (project_id, category_id, name, description, course_code, price, max_trainees, duration_hours) VALUES 
(1, 1, 'Advanced Makeup Techniques', 'Master professional makeup application techniques', 'MUA-ADV-001', 299.99, 20, 40),
(1, 2, 'Hair Styling Fundamentals', 'Learn basic to intermediate hair styling', 'HAIR-FUN-001', 199.99, 25, 30),
(1, 3, 'Skincare Specialist Course', 'Comprehensive skincare and facial treatments', 'SKIN-SPC-001', 249.99, 15, 35),
(1, 4, 'Professional Nail Care', 'Complete nail care and art techniques', 'NAIL-PRO-001', 149.99, 30, 25)
ON CONFLICT (course_code) DO NOTHING;

-- Insert sample modules
INSERT INTO modules (training_id, name, description, module_code, youtube_video_id, duration_minutes, order_index) VALUES 
(1, 'Introduction to Makeup', 'Basic makeup principles and tools', 'MUA-001-M01', 'dQw4w9WgXcQ', 45, 1),
(1, 'Color Theory', 'Understanding color matching and application', 'MUA-001-M02', 'dQw4w9WgXcQ', 60, 2),
(2, 'Hair Cutting Basics', 'Fundamental hair cutting techniques', 'HAIR-001-M01', 'dQw4w9WgXcQ', 90, 1),
(3, 'Skin Analysis', 'How to analyze different skin types', 'SKIN-001-M01', 'dQw4w9WgXcQ', 30, 1),
(4, 'Manicure Techniques', 'Professional manicure procedures', 'NAIL-001-M01', 'dQw4w9WgXcQ', 75, 1)
ON CONFLICT DO NOTHING;
