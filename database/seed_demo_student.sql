-- Insert Demo Student: Arjun Sharma
INSERT INTO students (id, email, full_name, avatar_url, target_role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'arjun@example.com', 'Arjun Sharma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', 'Software Engineer Intern');

-- Insert Demo Resume for Arjun
INSERT INTO resumes (student_id, file_url, parsed_text, ats_score, score_breakdown, detected_skills, missing_skills, suggestions, overall_summary) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'https://example.com/arjun_resume.pdf', 'Arjun Sharma. Education: B.Tech Computer Science. Projects: Personal Website, Simple Chat App. Skills: C++, HTML, CSS, JavaScript. Looking for a software engineering internship.', 
68, 
'{"keywords": 15, "format": 18, "experience": 20, "skills": 15}', 
ARRAY['C++', 'HTML', 'CSS', 'JavaScript'], 
'[{"skill": "React", "importance": "critical"}, {"skill": "Node.js", "importance": "high"}, {"skill": "Git", "importance": "medium"}]', 
'[{"section": "Projects", "issue": "Lack of quantified impact", "fix": "Mention user metrics or performance improvements."}]', 
'Arjun has a solid foundation in core programming languages like C++ and web basics. However, to be competitive for modern SWE internships, he needs to build projects using popular frameworks like React and Node.js.');

-- Insert Demo Interview Sessions
INSERT INTO interview_sessions (student_id, target_role, mode, questions, answers, topic_weakness_map, overall_score, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Software Engineer Intern', 'technical', 
'[{"id": "q1", "topic": "Data Structures", "question": "Explain the difference between an Array and a Linked List.", "difficulty": "easy"}]', 
'[{"question_id": "q1", "answer": "An array stores elements in contiguous memory, while a linked list uses nodes with pointers.", "score": 6.2, "feedback": "Good basic understanding, but could mention dynamic resizing and time complexity for operations."}]', 
'{"Data Structures": 6.2}', 6.20, 'completed'),
('550e8400-e29b-41d4-a716-446655440000', 'Software Engineer Intern', 'mixed', 
'[{"id": "q2", "topic": "Behavioral", "question": "Tell me about a time you faced a difficult bug.", "difficulty": "medium"}]', 
'[{"question_id": "q2", "answer": "I had a bug in my chat app. I used console.log to find it.", "score": 7.1, "feedback": "Nice that you resolved it, but try using the STAR method to structure your answer."}]', 
'{"Behavioral": 7.1}', 7.10, 'completed');

-- Insert Active Career Goal
INSERT INTO career_goals (student_id, goal_text, target_date, gap_analysis, phases, weekly_plans, milestones, progress_pct, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Google SWE Intern in 6 months', '2026-11-10', 
'{"current_skills": ["C++", "JavaScript"], "required_skills": ["Data Structures", "Algorithms", "System Design Basics", "Python/Java"], "gaps": ["Advanced DSA", "System Design", "Frameworks"]}', 
'[{"phase": 1, "name": "DSA Foundation", "weeks": "1-4", "goals": ["Master Arrays, Strings, Linked Lists", "Solve 50 LeetCode Easy"]}]', 
'[{"week": 1, "tasks": ["Complete Array section on LeetCode", "Read CTCI Chapter 1"], "project": "None", "certification": "None"}]', 
'[{"week": 4, "milestone": "Solve 50 LC Easy", "check": "LeetCode Profile"}]', 
25, true);
