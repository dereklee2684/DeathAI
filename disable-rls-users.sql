-- Completely disable RLS on users table to fix the blocking issue
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT 'RLS disabled on users table' as status;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public'; 