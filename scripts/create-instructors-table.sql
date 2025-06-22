-- Create instructors table with all required fields
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(100) NOT NULL,
    experience INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
    password_hash VARCHAR(255) NOT NULL,
    courses_teaching INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    join_date DATE DEFAULT CURRENT_DATE,
    last_active DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create upcoming sessions table for instructors
CREATE TABLE IF NOT EXISTS instructor_sessions (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES instructors(id) ON DELETE CASCADE,
    session_title VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    student_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO instructors (name, email, phone, specialization, experience, status, password_hash, courses_teaching, total_students) VALUES
('Sarah Johnson', 'sarah.instructor@email.com', '+1 (555) 123-4567', 'Makeup Artistry', 8, 'active', '$2b$10$hashedpassword1', 3, 45),
('Michael Chen', 'michael.instructor@email.com', '+1 (555) 234-5678', 'Hair Styling', 12, 'active', '$2b$10$hashedpassword2', 2, 38),
('Emily Rodriguez', 'emily.instructor@email.com', '+1 (555) 345-6789', 'Skincare & Facial', 6, 'on-leave', '$2b$10$hashedpassword3', 1, 22);

-- Insert sample sessions
INSERT INTO instructor_sessions (instructor_id, session_title, session_date, session_time, duration_minutes, student_count) VALUES
(1, 'Advanced Makeup Techniques', '2024-06-25', '10:00:00', 120, 8),
(1, 'Bridal Makeup Workshop', '2024-06-28', '14:00:00', 180, 12),
(2, 'Hair Styling Fundamentals', '2024-06-26', '09:00:00', 90, 15),
(3, 'Skincare Consultation', '2024-07-01', '11:00:00', 60, 5);
