/*
  # Create database functions for enhanced functionality

  1. Functions
    - `get_user_report_stats()` - Get user's report statistics
    - `cleanup_old_files()` - Clean up old files and records
    - `get_system_health()` - System health check function

  2. Security
    - Functions with proper security context
    - Input validation and sanitization

  3. Performance
    - Optimized queries with proper indexing
    - Efficient data aggregation
*/

-- Function to get user report statistics
CREATE OR REPLACE FUNCTION get_user_report_stats(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  total_reports bigint,
  processing_reports bigint,
  completed_reports bigint,
  failed_reports bigint,
  total_storage_used bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_reports,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_reports,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_reports,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_reports,
    COALESCE(SUM(
      CASE 
        WHEN file_url IS NOT NULL THEN 
          (SELECT size FROM storage.objects WHERE name = SUBSTRING(file_url FROM '[^/]+$'))
        ELSE 0 
      END
    ), 0) as total_storage_used
  FROM reports 
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old files (admin only)
CREATE OR REPLACE FUNCTION cleanup_old_files(days_old integer DEFAULT 90)
RETURNS TABLE (
  deleted_reports bigint,
  deleted_files bigint
) AS $$
DECLARE
  deleted_reports_count bigint := 0;
  deleted_files_count bigint := 0;
BEGIN
  -- Only allow service role to execute this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Delete old failed reports
  WITH deleted AS (
    DELETE FROM reports 
    WHERE status = 'failed' 
    AND created_at < NOW() - INTERVAL '%s days' 
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_reports_count FROM deleted;

  -- Note: File deletion would need to be handled by a separate process
  -- as we can't directly delete from storage in SQL
  
  RETURN QUERY SELECT deleted_reports_count, deleted_files_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system health metrics
CREATE OR REPLACE FUNCTION get_system_health()
RETURNS TABLE (
  total_users bigint,
  active_users_24h bigint,
  total_reports bigint,
  reports_today bigint,
  processing_reports bigint,
  avg_processing_time interval,
  storage_used bigint
) AS $$
BEGIN
  -- Only allow service role to execute this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM reports WHERE created_at > NOW() - INTERVAL '24 hours') as active_users_24h,
    (SELECT COUNT(*) FROM reports) as total_reports,
    (SELECT COUNT(*) FROM reports WHERE created_at::date = CURRENT_DATE) as reports_today,
    (SELECT COUNT(*) FROM reports WHERE status = 'processing') as processing_reports,
    (SELECT AVG(updated_at - created_at) FROM reports WHERE status = 'completed') as avg_processing_time,
    (SELECT COALESCE(SUM(size), 0) FROM storage.objects WHERE bucket_id = 'medical-reports') as storage_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate file upload
CREATE OR REPLACE FUNCTION validate_file_upload(
  file_name text,
  file_size bigint,
  file_type text
)
RETURNS boolean AS $$
BEGIN
  -- Check file size (10MB limit)
  IF file_size > 10485760 THEN
    RAISE EXCEPTION 'File size exceeds 10MB limit';
  END IF;
  
  -- Check file type
  IF file_type NOT IN ('application/pdf', 'image/jpeg', 'image/png', 'image/jpg') THEN
    RAISE EXCEPTION 'Invalid file type. Only PDF, JPEG, and PNG files are allowed';
  END IF;
  
  -- Check filename
  IF LENGTH(file_name) > 255 THEN
    RAISE EXCEPTION 'Filename too long';
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;