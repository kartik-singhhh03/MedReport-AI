/*
  # Create RLS helper functions

  1. Helper Functions
    - `is_admin()` - Check if current user is admin
    - `can_access_report()` - Check report access permissions
    - `get_user_quota()` - Get user's upload quota

  2. Security
    - Secure function definitions
    - Proper permission checks
*/

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- You can customize this based on your admin setup
  -- For now, we'll use a simple email check
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('admin@medisimplify.com', 'support@medisimplify.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check report access permissions
CREATE OR REPLACE FUNCTION can_access_report(report_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Users can access their own reports, admins can access all
  RETURN EXISTS (
    SELECT 1 FROM reports 
    WHERE id = report_id 
    AND (user_id = auth.uid() OR is_admin())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's upload quota and usage
CREATE OR REPLACE FUNCTION get_user_quota()
RETURNS TABLE (
  max_reports integer,
  used_reports bigint,
  max_storage bigint,
  used_storage bigint,
  can_upload boolean
) AS $$
DECLARE
  user_reports bigint;
  user_storage bigint;
  max_reports_limit integer := 50; -- Default limit
  max_storage_limit bigint := 524288000; -- 500MB default
BEGIN
  -- Get current usage
  SELECT COUNT(*), COALESCE(SUM(
    CASE 
      WHEN file_url IS NOT NULL THEN 
        (SELECT size FROM storage.objects WHERE name = SUBSTRING(file_url FROM '[^/]+$'))
      ELSE 0 
    END
  ), 0)
  INTO user_reports, user_storage
  FROM reports 
  WHERE user_id = auth.uid();
  
  -- Return quota information
  RETURN QUERY SELECT 
    max_reports_limit,
    user_reports,
    max_storage_limit,
    user_storage,
    (user_reports < max_reports_limit AND user_storage < max_storage_limit) as can_upload;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;