-- Ensure courses table exists with proper structure
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  duration INT DEFAULT 0, -- in minutes
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  category_id INT,
  instructor_id INT NOT NULL,
  thumbnail_url VARCHAR(500),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instructor (instructor_id),
  INDEX idx_status (status),
  INDEX idx_category (category_id)
);

-- Ensure enrollments table exists
CREATE TABLE IF NOT EXISTS enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  progress DECIMAL(5,2) DEFAULT 0,
  UNIQUE KEY unique_enrollment (user_id, course_id),
  INDEX idx_user (user_id),
  INDEX idx_course (course_id),
  INDEX idx_status (status)
);

-- Ensure course_reviews table exists
CREATE TABLE IF NOT EXISTS course_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (course_id, user_id),
  INDEX idx_course (course_id),
  INDEX idx_user (user_id),
  INDEX idx_rating (rating)
);

-- Ensure sessions table exists
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  course_id INT,
  instructor_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration INT DEFAULT 60, -- in minutes
  meeting_url VARCHAR(500),
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instructor (instructor_id),
  INDEX idx_course (course_id),
  INDEX idx_scheduled (scheduled_at),
  INDEX idx_status (status)
);

-- Ensure session_bookings table exists
CREATE TABLE IF NOT EXISTS session_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_booking (session_id, user_id),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Add some sample data for testing (only if tables are empty)
INSERT IGNORE INTO courses (id, title, description, price, duration, level, instructor_id, status) VALUES
(1, 'Advanced Hair Styling Techniques', 'Master professional hair styling with advanced techniques used by top stylists.', 299.99, 480, 'advanced', 1, 'published'),
(2, 'Professional Makeup Artistry', 'Learn professional makeup techniques for various occasions and skin types.', 399.99, 600, 'intermediate', 1, 'published');

INSERT IGNORE INTO enrollments (user_id, course_id, status) VALUES
(2, 1, 'active'),
(3, 1, 'active'),
(4, 1, 'completed'),
(2, 2, 'active'),
(5, 2, 'active');

INSERT IGNORE INTO course_reviews (course_id, user_id, rating, review) VALUES
(1, 2, 5, 'Excellent course! Learned so much about advanced styling techniques.'),
(1, 4, 4, 'Great content, very detailed explanations.'),
(2, 2, 5, 'Amazing makeup course, highly recommend!'),
(2, 5, 5, 'Professional quality instruction, worth every penny.');

INSERT IGNORE INTO sessions (title, description, instructor_id, course_id, scheduled_at, duration) VALUES
('Live Q&A: Hair Styling Techniques', 'Interactive session to answer questions about hair styling', 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), 90),
('Makeup Demo: Bridal Looks', 'Live demonstration of bridal makeup techniques', 1, 2, DATE_ADD(NOW(), INTERVAL 10 DAY), 120);
