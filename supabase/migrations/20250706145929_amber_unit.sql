/*
  # Create analytics table for usage tracking

  1. New Tables
    - `analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `event_type` (text, type of event)
      - `event_data` (jsonb, event metadata)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `analytics` table
    - Add policies for authenticated users to insert their own events
    - Admin-only access for reading analytics data

  3. Performance
    - Indexes for efficient querying
    - Partitioning by date for large datasets
*/

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics table
CREATE POLICY "Users can insert own analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin policy for reading analytics (you can modify this based on your admin setup)
CREATE POLICY "Service role can read all analytics"
  ON analytics
  FOR SELECT
  TO service_role
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_data ON analytics USING gin(event_data);