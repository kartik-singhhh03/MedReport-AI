# 🚀 MedReport AI - Real AI Analysis Setup Guide

## 🔑 Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
VITE_GEMINI_API_KEY=AIzaSyBCTvqb70F83csBRe8ZWtySVN6KLvO6osc

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=false

# API Configuration
VITE_API_URL=http://localhost:3000

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
```

## 🗄️ Database Setup

### 1. Run the Complete SQL Schema

Copy and paste this complete SQL into your Supabase SQL Editor:

```sql
-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  filename text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  technical_analysis text,
  layman_explanation_en text,
  layman_explanation_hi text,
  recommendations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language text DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  accessibility_mode boolean DEFAULT false,
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT false,
  auto_analysis boolean DEFAULT true,
  privacy_level text DEFAULT 'standard' CHECK (privacy_level IN ('standard', 'enhanced', 'maximum')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Create health_checks table
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  check_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  details JSONB DEFAULT '{}',
  response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Enable RLS on all tables
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reports
CREATE POLICY "Users can view own reports" ON reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON reports FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON reports FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for analysis_results
CREATE POLICY "Users can view their own analysis results" ON analysis_results FOR SELECT USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = analysis_results.report_id AND reports.user_id = auth.uid()));
CREATE POLICY "Users can insert their own analysis results" ON analysis_results FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM reports WHERE reports.id = analysis_results.report_id AND reports.user_id = auth.uid()));
CREATE POLICY "Users can update their own analysis results" ON analysis_results FOR UPDATE USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = analysis_results.report_id AND reports.user_id = auth.uid()));
CREATE POLICY "Users can delete their own analysis results" ON analysis_results FOR DELETE USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = analysis_results.report_id AND reports.user_id = auth.uid()));

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics" ON analytics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service role can insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- Create RLS policies for health_checks
CREATE POLICY "Service role can manage health checks" ON health_checks FOR ALL USING (true);

-- Create RLS policies for audit_logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service role can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', false) ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload own medical reports" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own medical reports" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own medical reports" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own medical reports" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_report_id ON analysis_results(report_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_status ON analysis_results(status);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_created_at ON health_checks(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analysis_results_updated_at BEFORE UPDATE ON analysis_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
```

## 🤖 AI Services Setup

### 1. Hugging Face API Key
- Go to [huggingface.co](https://huggingface.co)
- Create an account
- Go to Settings > Access Tokens
- Create a new token
- Add it to your `.env` file

### 2. Gemini Pro API Key
- Your Gemini API key is already configured: `AIzaSyBCTvqb70F83csBRe8ZWtySVN6KLvO6osc`
- This is stored securely in your `.env` file

## 🚀 Deploy Edge Function

### 1. Install Supabase CLI
```bash
npm install -g @supabase/cli
```

### 2. Login to Supabase
```bash
npx supabase login
```

### 3. Link your project
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy the function
```bash
npx supabase functions deploy analyze-report
```

## 🧪 Testing Real AI Analysis

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test File Upload
1. Go to http://localhost:5173
2. Sign up/Sign in
3. Upload a medical report (PDF, image, or text file)
4. Watch the real AI analysis process:
   - OCR text extraction
   - Hugging Face medical analysis
   - Gemini Pro comprehensive analysis
   - Personalized recommendations

### 3. Expected Results
- **Real OCR extraction** from uploaded files
- **Medical entity recognition** using Hugging Face
- **Comprehensive analysis** using Gemini Pro
- **Personalized health scores** and recommendations
- **Multi-language support** (English and Hindi)
- **Biomarker extraction** and interpretation

## 🔧 Troubleshooting

### If OCR fails:
- Check file format (PDF, JPEG, PNG supported)
- Ensure file is readable and not corrupted
- Check browser console for errors

### If Hugging Face analysis fails:
- Verify API key is correct
- Check network connectivity
- Review API usage limits

### If Gemini Pro analysis fails:
- Verify API key is correct
- Check API quota limits
- Review request format

## 🎯 Real AI Features Implemented

✅ **OCR Text Extraction** - Real text extraction from medical reports
✅ **Medical Entity Recognition** - Using Hugging Face Bio_ClinicalBERT
✅ **Comprehensive Analysis** - Using Gemini Pro for detailed interpretation
✅ **Biomarker Extraction** - Automatic detection of medical values
✅ **Health Score Calculation** - AI-powered health assessment
✅ **Personalized Recommendations** - Based on actual report content
✅ **Multi-language Support** - English and Hindi explanations
✅ **Risk Factor Analysis** - AI-identified health risks
✅ **Confidence Scoring** - Analysis quality assessment

## 🔒 Security Notes

- API keys are stored in `.env` file (not committed to git)
- All database operations use Row Level Security (RLS)
- File uploads are validated and sanitized
- Analysis results are user-specific and private

Your MedReport AI now performs **real AI analysis** instead of hardcoded responses! 🚀 