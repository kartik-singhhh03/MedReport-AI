-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  technical_analysis TEXT NOT NULL,
  layman_explanation_en TEXT NOT NULL,
  layman_explanation_hi TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  risk_factors TEXT[] DEFAULT '{}',
  key_findings TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_report_id ON analysis_results(report_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_status ON analysis_results(status);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at);

-- Add RLS policies for analysis_results
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own analysis results
CREATE POLICY "Users can view their own analysis results" ON analysis_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = analysis_results.report_id 
      AND reports.user_id = auth.uid()
    )
  );

-- Policy for users to insert their own analysis results
CREATE POLICY "Users can insert their own analysis results" ON analysis_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = analysis_results.report_id 
      AND reports.user_id = auth.uid()
    )
  );

-- Policy for users to update their own analysis results
CREATE POLICY "Users can update their own analysis results" ON analysis_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = analysis_results.report_id 
      AND reports.user_id = auth.uid()
    )
  );

-- Policy for users to delete their own analysis results
CREATE POLICY "Users can delete their own analysis results" ON analysis_results
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = analysis_results.report_id 
      AND reports.user_id = auth.uid()
    )
  );

-- Add analysis_id column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS analysis_id UUID REFERENCES analysis_results(id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  accessibility_mode BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  auto_analysis BOOLEAN DEFAULT true,
  privacy_level TEXT DEFAULT 'standard' CHECK (privacy_level IN ('standard', 'enhanced', 'maximum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Add RLS policies for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Add RLS policies for analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own analytics
CREATE POLICY "Users can view their own analytics" ON analytics
  FOR SELECT USING (user_id = auth.uid());

-- Policy for service role to insert analytics
CREATE POLICY "Service role can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Create health_checks table
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  check_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  details JSONB DEFAULT '{}',
  response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for health_checks
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_created_at ON health_checks(created_at);

-- Add RLS policies for health_checks (admin only)
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage health checks
CREATE POLICY "Service role can manage health checks" ON health_checks
  FOR ALL USING (true);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add RLS policies for audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- Policy for service role to insert audit logs
CREATE POLICY "Service role can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_analysis_results_updated_at 
  BEFORE UPDATE ON analysis_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user's health score
CREATE OR REPLACE FUNCTION get_user_health_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_score INTEGER;
BEGIN
  SELECT COALESCE(AVG(ar.health_score), 0)
  INTO avg_score
  FROM analysis_results ar
  JOIN reports r ON ar.report_id = r.id
  WHERE r.user_id = user_uuid
  AND ar.status = 'completed';
  
  RETURN avg_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's report statistics
CREATE OR REPLACE FUNCTION get_user_report_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_reports', COUNT(*),
    'completed_reports', COUNT(*) FILTER (WHERE status = 'completed'),
    'processing_reports', COUNT(*) FILTER (WHERE status = 'processing'),
    'failed_reports', COUNT(*) FILTER (WHERE status = 'failed'),
    'average_health_score', get_user_health_score(user_uuid),
    'last_upload', MAX(created_at)
  )
  INTO stats
  FROM reports
  WHERE user_id = user_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;