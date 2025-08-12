-- Simple migration to add "alumni" role
-- Run this in your Supabase SQL editor

-- Add the "alumni" role to the existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'alumni'; 