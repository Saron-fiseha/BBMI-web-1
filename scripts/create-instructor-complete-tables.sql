-- Create instructor profiles table
CREATE TABLE IF NOT EXISTS instructor_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bio TEXT,
  location VARCHAR(255),
  specialties JSON,
  experience_years INT DEFAULT 0,
  certifications JSON,
  social_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_profile (user_id)
);

-- Create course progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_progress (user_id, course_id)
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_review (user_id, course_id)
);

-- Create instructor replies table
CREATE TABLE IF NOT EXISTS instructor_replies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id INT NOT NULL,
  instructor_id INT NOT NULL,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES course_reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review_reply (review_id)
);

-- Create message threads table
CREATE TABLE IF NOT EXISTS message_threads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  instructor_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  last_read_by_student TIMESTAMP NULL,
  last_read_by_instructor TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  thread_id INT NOT NULL,
  sender_id INT NOT NULL,
  sender_type ENUM('student', 'instructor') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add last_login column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON course_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_message_threads_instructor ON message_threads(instructor_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_student ON message_threads(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_sessions_instructor ON sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON sessions(scheduled_at);

-- Insert sample data for testing
INSERT IGNORE INTO instructor_profiles (user_id, bio, location, specialties, experience_years, certifications, social_links) VALUES
(1, 'Professional makeup artist and hair stylist with over 10 years of experience. Passionate about teaching and helping others discover their beauty potential.', 'Los Angeles, CA', '["Hair Styling", "Makeup Artistry", "Bridal Beauty", "Color Theory"]', 10, '["Certified Makeup Artist", "Advanced Hair Styling Certificate", "Bridal Beauty Specialist"]', '{"website": "https://brushedbybetty.com", "instagram": "@brushedbybetty", "linkedin": "betty-smith-mua"}');

-- Insert sample course progress
INSERT IGNORE INTO course_progress (user_id, course_id, progress_percentage) VALUES
(2, 1, 80),
(2, 2, 70),
(3, 1, 100),
(4, 1, 60),
(4, 2, 30),
(4, 3, 45);

-- Insert sample reviews
INSERT IGNORE INTO course_reviews (user_id, course_id, rating, comment, helpful_count) VALUES
(2, 1, 5, 'Absolutely amazing course! Betty\'s techniques are professional and easy to follow. I\'ve already started implementing what I learned in my salon.', 12),
(3, 2, 5, 'This course exceeded my expectations. The step-by-step tutorials are incredibly detailed and Betty\'s expertise really shows.', 8),
(4, 1, 4, 'Great course with lots of practical tips. Would love to see more content on color techniques in future updates.', 5),
(5, 2, 5, 'Betty is an incredible instructor. Her passion for makeup artistry is contagious and her teaching style is perfect for beginners like me.', 15);

-- Insert sample message threads
INSERT IGNORE INTO message_threads (student_id, instructor_id, subject) VALUES
(2, 1, 'Question about hair styling technique'),
(3, 1, 'Thank you for the amazing course!'),
(4, 1, 'Makeup product recommendations');

-- Insert sample messages
INSERT IGNORE INTO messages (thread_id, sender_id, sender_type, content) VALUES
(1, 2, 'student', 'Hi Betty, I\'m having trouble with the curling technique from lesson 3. Could you help?'),
(1, 1, 'instructor', 'Hi Sarah! I\'d be happy to help. Can you tell me specifically what part you\'re struggling with?'),
(2, 3, 'student', 'Thank you so much for your detailed feedback on my practice photos!'),
(2, 1, 'instructor', 'You\'re very welcome! Keep up the great work!'),
(3, 4, 'student', 'Could you recommend some affordable brushes for beginners?'),
(3, 1, 'instructor', 'I recommend starting with a basic set from EcoTools or Real Techniques.');
