-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS mentor_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mentor_address TEXT;

-- Update existing records to have default values
UPDATE projects 
SET type = 'free' 
WHERE type IS NULL;

UPDATE projects 
SET mentor_name = 'Unknown Mentor' 
WHERE mentor_name IS NULL;

UPDATE projects 
SET mentor_address = '' 
WHERE mentor_address IS NULL;
