-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'editor', 'viewer')),
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
CREATE INDEX IF NOT EXISTS admin_users_is_active_idx ON admin_users(is_active);

-- Insert default admin user (email: admin@savehorses.org, password: demo12345)
-- For demo/testing purposes, password is stored plain text
-- In production, use bcrypt hashing
INSERT INTO admin_users (email, password_hash, role, full_name, is_active)
VALUES (
  'admin@savehorses.org',
  'demo12345',
  'super_admin',
  'Save Horses Admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Note: RLS policies are managed through API middleware authentication
-- Since we use custom JWT tokens in cookies, RLS is handled at the application level

-- Optional: Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_id_idx ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON admin_audit_log(created_at);
