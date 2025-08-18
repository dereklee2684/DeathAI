-- Safe Universities Insert Script (Checks for existing universities)
-- This script only inserts universities that don't already exist
-- Run this in your Supabase SQL Editor

-- Insert Ivy League Universities (only if they don't exist)
INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-001', 'Harvard University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Harvard University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-002', 'Yale University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Yale University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-003', 'Princeton University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Princeton University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-004', 'Columbia University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Columbia University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-005', 'University of Pennsylvania', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Pennsylvania');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-006', 'Brown University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Brown University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-007', 'Dartmouth College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Dartmouth College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'ivy-008', 'Cornell University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Cornell University');

-- Insert Top Private Universities (only if they don't exist)
INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-001', 'Stanford University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Stanford University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-002', 'Massachusetts Institute of Technology (MIT)', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Massachusetts Institute of Technology (MIT)');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-003', 'California Institute of Technology (Caltech)', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'California Institute of Technology (Caltech)');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-004', 'University of Chicago', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Chicago');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-005', 'Duke University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Duke University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-006', 'Northwestern University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Northwestern University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-007', 'Johns Hopkins University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Johns Hopkins University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-008', 'Carnegie Mellon University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Carnegie Mellon University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-009', 'Vanderbilt University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Vanderbilt University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-010', 'Rice University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Rice University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-011', 'Washington University in St. Louis', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Washington University in St. Louis');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-012', 'Emory University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Emory University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-013', 'Georgetown University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Georgetown University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-014', 'University of Notre Dame', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Notre Dame');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-015', 'University of Southern California (USC)', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Southern California (USC)');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-016', 'New York University (NYU)', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'New York University (NYU)');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-017', 'Boston University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Boston University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-018', 'Tufts University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Tufts University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-019', 'Brandeis University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Brandeis University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-020', 'Case Western Reserve University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Case Western Reserve University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-021', 'Wake Forest University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Wake Forest University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-022', 'Lehigh University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Lehigh University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-023', 'Villanova University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Villanova University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-024', 'Pepperdine University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Pepperdine University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-025', 'Santa Clara University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Santa Clara University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-026', 'Loyola Marymount University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Loyola Marymount University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-027', 'University of San Francisco', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of San Francisco');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-028', 'University of San Diego', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of San Diego');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-029', 'Chapman University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Chapman University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-030', 'Occidental College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Occidental College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-031', 'Pomona College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Pomona College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-032', 'Claremont McKenna College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Claremont McKenna College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-033', 'Harvey Mudd College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Harvey Mudd College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-034', 'Scripps College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Scripps College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-035', 'Pitzer College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Pitzer College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-036', 'Reed College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Reed College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-037', 'Lewis & Clark College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Lewis & Clark College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-038', 'University of Puget Sound', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Puget Sound');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-039', 'Whitman College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Whitman College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-040', 'Willamette University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Willamette University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-041', 'University of the Pacific', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of the Pacific');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-042', 'Mills College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Mills College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-043', 'Saint Mary''s College of California', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Saint Mary''s College of California');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-044', 'University of Redlands', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Redlands');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-045', 'Whittier College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Whittier College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-046', 'University of La Verne', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of La Verne');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-047', 'Azusa Pacific University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Azusa Pacific University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-048', 'Biola University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Biola University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-049', 'Point Loma Nazarene University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Point Loma Nazarene University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-050', 'Westmont College', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Westmont College');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-051', 'University of Rochester', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'University of Rochester');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-052', 'Rochester Institute of Technology', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Rochester Institute of Technology');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-053', 'Syracuse University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Syracuse University');

INSERT INTO universities (id, name, logo_url, created_at, updated_at)
SELECT 'pri-054', 'Northeastern University', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name = 'Northeastern University');

-- Note: This script only inserts universities that don't already exist
-- It checks the name field to avoid duplicates
-- You can run this safely multiple times without creating duplicates 