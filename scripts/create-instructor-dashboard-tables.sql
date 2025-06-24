-- Ensure all necessary tables exist for instructor dashboard

-- Sessions table for live sessions
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  course_id INT,
  instructor_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration INT DEFAULT 60, -- in minutes
  meeting_url VARCHAR(500),
  status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_instructor_scheduled (instructor_id, scheduled_at),
  INDEX idx_status_scheduled (status, scheduled_at)
);

-- Session bookings table
CREATE TABLE IF NOT EXISTS session_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_session_user (session_id, user_id),
  INDEX idx_user_sessions (user_id, status)
);

-- Reviews table for course reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_course_user_review (course_id, user_id),
  INDEX idx_course_rating (course_id, rating),
  INDEX idx_user_reviews (user_id)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled', 'suspended') DEFAULT 'active',
  progress DECIMAL(5,2) DEFAULT 0.00, -- percentage completed
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course (user_id, course_id),
  INDEX idx_course_enrollments (course_id, status),
  INDEX idx_user_enrollments (user_id, status)
);

-- Courses table updates
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS instructor_id INT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS duration INT DEFAULT 0, -- in minutes
ADD COLUMN IF NOT EXISTS level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS category_id INT,
ADD FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add some sample data for testing
INSERT IGNORE INTO courses (id, title, description, instructor_id, price, duration, level, status, created_at) VALUES
(1, 'Advanced Hair Styling Techniques', 'Master advanced hair styling techniques for professional results', 1, 299.99, 480, 'advanced', 'published', NOW()),
(2, 'Professional Makeup Artistry', 'Learn professional makeup techniques from industry experts', 1, 399.99, 600, 'intermediate', 'published', NOW()),
(3, 'Bridal Hair & Makeup Masterclass', 'Specialized course for bridal beauty services', 1, 499.99, 720, 'advanced', 'draft', NOW());

-- Add sample enrollments
INSERT IGNORE INTO enrollments (user_id, course_id, status, progress) VALUES
(2, 1, 'active', 75.50),
(3, 1, 'active', 45.25),
(4, 1, 'completed', 100.00),
(2, 2, 'active', 30.00),
(3, 2, 'active', 60.75);

-- Add sample reviews
INSERT IGNORE INTO reviews (course_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Excellent course! Learned so much about advanced techniques.'),
(1, 4, 5, 'Amazing instructor and great content. Highly recommended!'),
(2, 2, 4, 'Very informative course with practical examples.');

-- Add sample sessions
INSERT IGNORE INTO sessions (title, description, course_id, instructor_id, scheduled_at, duration, status) VALUES
('Live Q&A: Hair Styling Techniques', 'Interactive session to answer your questions about hair styling', 1, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 90, 'scheduled'),
('Makeup Demo: Bridal Looks', 'Live demonstration of bridal makeup techniques', 2, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 120, 'scheduled');

-- Add sample session bookings
INSERT IGNORE INTO session_bookings (session_id, user_id, status) VALUES
(1, 2, 'confirmed'),
(1, 3, 'confirmed'),
(2, 2, 'confirmed');
