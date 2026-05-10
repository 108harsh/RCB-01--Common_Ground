-- STUDENTS
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  target_role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RESUMES
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  parsed_text TEXT,
  ats_score INTEGER,                    -- 0 to 100
  score_breakdown JSONB,                -- {keywords, format, experience, skills}
  detected_skills TEXT[],
  missing_skills JSONB,                 -- [{skill, importance}]
  suggestions JSONB,                    -- [{section, issue, fix}]
  overall_summary TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INTERNSHIP_OPPORTUNITIES (pre-seeded)
CREATE TABLE internship_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT,                          -- SWE, Data, Design, etc.
  required_skills TEXT[],
  description TEXT,
  stipend TEXT,
  duration TEXT,
  location TEXT,
  apply_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INTERNSHIP_MATCHES
CREATE TABLE internship_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES internship_opportunities(id),
  match_score INTEGER,                  -- 0 to 100
  why_matched TEXT,
  skill_gaps TEXT[],
  effort_to_close TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INTERVIEW_SESSIONS
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  mode TEXT DEFAULT 'technical',        -- technical | hr | mixed
  questions JSONB DEFAULT '[]',         -- [{id, question, topic, difficulty}]
  answers JSONB DEFAULT '[]',           -- [{question_id, answer, score, feedback}]
  topic_weakness_map JSONB DEFAULT '{}',-- {topic: avg_score}
  overall_score DECIMAL(4,2),
  status TEXT DEFAULT 'active',         -- active | completed
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- CAREER_GOALS
CREATE TABLE career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,              -- "Google SWE Intern in 6 months"
  target_date DATE,
  gap_analysis JSONB,                   -- {current_skills, required_skills, gaps}
  phases JSONB,                         -- [{phase, name, weeks, goals}]
  weekly_plans JSONB,                   -- [{week, tasks[], project, certification}]
  milestones JSONB,                     -- [{week, milestone, check}]
  progress_pct INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SKILL_PROGRESS
CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  status TEXT DEFAULT 'planned',        -- planned | learning | completed
  proficiency INTEGER DEFAULT 0,        -- 0 to 100
  source TEXT,                          -- resume | goal | interview
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- WEEKLY_TASKS
CREATE TABLE weekly_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES career_goals(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  week_number INTEGER,
  task_text TEXT,
  task_type TEXT,                       -- learning | project | certification | coding
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- AGENT_LOGS (for Agent Activity Feed in UI)
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT DEFAULT 'running',        -- running | completed | error
  input_summary TEXT,
  output_summary TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
