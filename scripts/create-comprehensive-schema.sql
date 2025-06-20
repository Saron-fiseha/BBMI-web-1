-- Create comprehensive schema for the beauty salon LMS

-- Users table (already exists, but let's ensure it has all needed fields)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    phone VARCHAR(20),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

-- Roles and permissions tables
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    user_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    type VARCHAR(20) DEFAULT 'free',
    mentor_name VARCHAR(255),
    mentor_address TEXT,
    trainings_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    level VARCHAR(50) DEFAULT 'beginner',
    trainings_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses/Trainings table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_code VARCHAR(50) UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    project_id INTEGER REFERENCES projects(id),
    instructor_id INTEGER REFERENCES users(id),
    price DECIMAL(10,2) DEFAULT 0,
    discount INTEGER DEFAULT 0,
    max_students INTEGER DEFAULT 50,
    current_students INTEGER DEFAULT 0,
    modules_count INTEGER DEFAULT 0,
    duration_hours INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'beginner',
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module_code VARCHAR(50),
    course_id INTEGER REFERENCES courses(id),
    video_id VARCHAR(255),
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    status VARCHAR(50) DEFAULT 'active',
    progress DECIMAL(5,2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_amount DECIMAL(10,2) DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    next_lesson VARCHAR(255),
    completed_modules INTEGER DEFAULT 0,
    total_modules INTEGER DEFAULT 0
);

-- Module Progress table
CREATE TABLE IF NOT EXISTS module_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    module_id INTEGER REFERENCES modules(id),
    course_id INTEGER REFERENCES courses(id),
    completed BOOLEAN DEFAULT FALSE,
    progress DECIMAL(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    certificate_code VARCHAR(100) UNIQUE,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    instructor_name VARCHAR(255),
    verification_code VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Live Sessions table
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    session_date DATE,
    start_time TIME,
    end_time TIME,
    meeting_url TEXT,
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Enrollments table
CREATE TABLE IF NOT EXISTS session_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES live_sessions(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES 
('admin', 'Full system access', '["create", "read", "update", "delete", "manage_users", "manage_courses", "manage_roles", "manage_payments", "view_analytics", "manage_sessions", "manage_certificates"]'),
('instructor', 'Can manage courses and students', '["read", "update", "manage_courses", "view_students", "create_sessions", "grade_assignments", "issue_certificates"]'),
('student', 'Can access courses and profile', '["read", "update_profile", "enroll_courses", "view_progress", "download_certificates", "join_sessions"]')
ON CONFLICT (name) DO NOTHING;

-- Update user counts for roles
UPDATE roles SET user_count = (
    SELECT COUNT(*) FROM users WHERE role = roles.name
);
