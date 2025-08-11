-- Insert universities into the database
INSERT INTO public.universities (id, name, logo_url, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Stanford University',
  'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'MIT',
  'https://upload.wikimedia.org/wikipedia/en/a/a1/MIT_logo.svg',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Harvard University',
  'https://upload.wikimedia.org/wikipedia/en/2/29/Harvard_University_logo.svg',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Test University',
  NULL,
  NOW(),
  NOW()
);

-- Insert a platform admin user (you'll need to replace with actual user ID)
-- This assumes you have a user with ID that you want to make platform admin
-- INSERT INTO public.user_roles (user_id, role, created_at) VALUES
-- ('your-user-id-here', 'platform_admin', NOW()); 