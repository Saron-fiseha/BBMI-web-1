-- Drop existing tables if they exist to recreate with proper structure
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with all required fields
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  age INTEGER,
  sex VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert admin user with bcrypt hash for "Admin123!"
INSERT INTO users (
  full_name, 
  email, 
  password_hash, 
  role, 
  email_verified
) VALUES (
  'BBMI Administrator',
  'admin@bbmi.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified;

-- Insert instructor user with bcrypt hash for "Instructor123!"
INSERT INTO users (
  full_name, 
  email, 
  password_hash, 
  role, 
  email_verified
) VALUES (
  'Sarah Johnson',
  'instructor@bbmi.com',
  '$2a$12$8K1p3UnqiO1u8Qy2HuZOj.WdkSO0nUBHBdkRdQVeP5C4aI8jO8qAy',
  'instructor',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified;

-- Insert student user with bcrypt hash for "Student123!"
INSERT INTO users (
  full_name, 
  email, 
  password_hash, 
  role, 
  email_verified
) VALUES (
  'Emma Wilson',
  'student@bbmi.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'student',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified;

-- Create courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id INTEGER REFERENCES users(id),
  price DECIMAL(10, 2) DEFAULT 0,
  duration INTEGER,
  level VARCHAR(50) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  progress DECIMAL(5,2) DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id, price, duration, level, category, image_url)
SELECT 
  'Advanced Hair Coloring Techniques',
  'Master the art of hair coloring with advanced techniques including balayage, ombre, and color correction.',
  id,
  199.99,
  480,
  'Advanced',
  'Hair Styling',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'instructor@bbmi.com';

INSERT INTO courses (title, description, instructor_id, price, duration, level, category, image_url)
SELECT 
  'Professional Makeup Artistry',
  'Learn professional makeup techniques for various occasions including bridal, editorial, and special effects.',
  id,
  299.99,
  600,
  'Intermediate',
  'Makeup',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'instructor@bbmi.com';

INSERT INTO courses (title, description, instructor_id, price, duration, level, category, image_url)
SELECT 
  'Skincare Fundamentals',
  'Learn the basics of skincare, including skin types, common concerns, and creating effective skincare routines.',
  id,
  99.99,
  240,
  'Beginner',
  'Skincare',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'instructor@bbmi.com';
