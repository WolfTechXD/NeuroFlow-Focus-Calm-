/*
  # Create Initial NeuroFlow Database Schema
  
  ## Overview
  This migration creates the core database schema for the NeuroFlow application,
  including user profiles, subscriptions, tasks, and related tables.
  
  ## Tables Created
  
  ### 1. profiles
  - Stores extended user profile information
  - Links to auth.users via user_id
  - Includes theme preferences, avatar, and settings
  
  ### 2. subscriptions
  - Tracks user subscription status and payment tiers
  - Includes payment provider information
  - Stores subscription dates and transaction references
  
  ### 3. tasks
  - User tasks with priority and difficulty levels
  - Links to users via user_id
  - Tracks completion status and XP rewards
  
  ### 4. achievements
  - User achievements and milestones
  - Tracks unlock dates and XP rewards
  
  ### 5. daily_stats
  - Daily activity tracking
  - Stores tasks completed, focus minutes, XP earned
  
  ### 6. pomodoro_sessions
  - Tracks Pomodoro timer sessions
  - Stores work and break durations
  - Links to users for analytics
  
  ### 7. zen_sessions
  - Tracks meditation and zen mode usage
  - Stores session type and duration
  
  ### 8. payment_transactions
  - Logs all payment transactions
  - Supports multiple payment providers
  - Stores transaction IDs and amounts
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies enforce authentication requirements
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    theme_preference TEXT DEFAULT 'colorful',
    streak_count INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    plan_type TEXT DEFAULT 'demo',
    is_premium BOOLEAN DEFAULT false,
    payment_provider TEXT,
    provider_subscription_id TEXT,
    purchase_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'medium',
    difficulty TEXT DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 10,
    estimated_time INTEGER,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    xp_reward INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    focus_minutes INTEGER DEFAULT 0,
    zen_minutes INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    streak_maintained BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Create pomodoro_sessions table
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    work_duration INTEGER NOT NULL,
    break_duration INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create zen_sessions table
CREATE TABLE IF NOT EXISTS zen_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    payment_provider TEXT NOT NULL,
    provider_transaction_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    plan_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zen_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON subscriptions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
    ON subscriptions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view own tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Users can view own achievements"
    ON achievements FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON achievements FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for daily_stats
CREATE POLICY "Users can view own daily stats"
    ON daily_stats FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats"
    ON daily_stats FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats"
    ON daily_stats FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for pomodoro_sessions
CREATE POLICY "Users can view own pomodoro sessions"
    ON pomodoro_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pomodoro sessions"
    ON pomodoro_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pomodoro sessions"
    ON pomodoro_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for zen_sessions
CREATE POLICY "Users can view own zen sessions"
    ON zen_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own zen sessions"
    ON zen_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own zen sessions"
    ON zen_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for payment_transactions
CREATE POLICY "Users can view own transactions"
    ON payment_transactions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON payment_transactions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_zen_sessions_user_id ON zen_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
