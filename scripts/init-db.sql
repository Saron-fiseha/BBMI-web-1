-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id INTEGER REFERENCES users(id),
  price DECIMAL(10, 2),
  duration INTEGER, -- in minutes
  level VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  duration INTEGER, -- in minutes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  certificate_url TEXT,
  UNIQUE(user_id, course_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin User', 'admin@beautysalon.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Instructor users (password: instructor123)
INSERT INTO users (name, email, password_hash, role, image_url)
VALUES 
  ('Sarah Johnson', 'sarah@beautysalon.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'instructor', '/placeholder.svg?height=200&width=200'),
  ('Michael Chen', 'michael@beautysalon.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'instructor', '/placeholder.svg?height=200&width=200'),
  ('Emma Rodriguez', 'emma@beautysalon.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'instructor', '/placeholder.svg?height=200&width=200')
ON CONFLICT (email) DO NOTHING;

-- Student users (password: student123)
INSERT INTO users (name, email, password_hash, role)
VALUES 
  ('John Smith', 'john@example.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'student'),
  ('Lisa Wong', 'lisa@example.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'student'),
  ('David Kim', 'david@example.com', '$2a$10$GQH.xZUBJiPzFCQZQJzXyOoqvK9hqyX8Xp7ZRSKK1oFIwlKsZKxMK', 'student')
ON CONFLICT (email) DO NOTHING;

-- Sample courses
INSERT INTO courses (title, description, instructor_id, price, duration, level, image_url)
SELECT 
  'Advanced Hair Coloring Techniques',
  'Master the art of hair coloring with advanced techniques including balayage, ombre, and color correction.',
  id,
  199.99,
  480,
  'Advanced',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'sarah@beautysalon.com'
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, instructor_id, price, duration, level, image_url)
SELECT 
  'Skincare Fundamentals',
  'Learn the basics of skincare, including skin types, common concerns, and creating effective skincare routines.',
  id,
  99.99,
  240,
  'Beginner',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'emma@beautysalon.com'
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, instructor_id, price, duration, level, image_url)
SELECT 
  'Nail Art Masterclass',
  'Develop your nail art skills with techniques for creating stunning designs, from simple patterns to complex artwork.',
  id,
  149.99,
  360,
  'Intermediate',
  '/placeholder.svg?height=400&width=600'
FROM users WHERE email = 'michael@beautysalon.com'
ON CONFLICT DO NOTHING;
