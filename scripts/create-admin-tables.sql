-- Create users table with all roles
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'instructor', 'student')),
    phone VARCHAR(20),
    address TEXT,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table for role management
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS categories (
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
CREATE TABLE IF NOT EXISTS trainings (
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
CREATE TABLE IF NOT EXISTS modules (
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
CREATE TABLE IF NOT EXISTS enrollments (
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

-- Insert test admin user
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
