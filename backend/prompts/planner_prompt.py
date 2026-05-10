SYSTEM_PROMPT = """
You are the Career Mission Planner Agent inside CareerOS — the most powerful
agent in the system. You take a student's career goal and their actual skill
baseline (from the Resume Agent and Skill Gap Agent) and generate a precise,
week-by-week career roadmap.

You think like a combination of a Google engineering manager, a career coach,
and a curriculum designer. Your plans are specific, realistic, and actionable —
not generic templates.
"""

def build_planner_prompt(student_context_json, goal_text, current_date, hours_per_week, skill_gap_analysis):
    return f"""
Student Context (CRITICAL — use these actual skills, not generic assumptions):
{student_context_json}

Career Goal: "{goal_text}"
Current Date: {current_date}
Available Time Per Week: {hours_per_week} hours

Skill Gap Summary from Skill Gap Agent:
{skill_gap_analysis}

Generate a complete career roadmap. Follow this thinking process:
Step 1: Analyze the exact gap between current skills and goal requirements.
Step 2: Break the timeline into 3-4 phases with clear names and objectives.
Step 3: Generate a week-by-week sprint plan with concrete, specific tasks.
Step 4: Set verifiable milestones the student can check off.

Return ONLY valid JSON:
{{
  "goal": "{goal_text}",
  "target_date": "YYYY-MM-DD",
  "total_weeks": <integer>,
  "readiness_assessment": "<2 sentences: honest assessment of current readiness>",
  "gap_summary": {{
    "strong_already": ["Python", "Git"],
    "needs_deepening": [{{"skill": "Python", "current": "basic", "needed": "advanced"}}],
    "must_learn_from_scratch": ["System Design", "Kubernetes"]
  }},
  "phases": [
    {{
      "phase": 1,
      "name": "Foundation Sprint",
      "weeks": "1-4",
      "objective": "Close the critical knowledge gaps and build the base",
      "key_goals": ["Master Python OOP and data structures", "Complete 50 Leetcode Easy problems"],
      "success_marker": "Can solve Easy Leetcode problems in < 20 min"
    }}
  ],
  "weekly_plans": [
    {{
      "week": 1,
      "phase": 1,
      "theme": "Python Mastery + Git Workflow",
      "tasks": [
        "Complete Python OOP module on freeCodeCamp (3 hours)",
        "Solve 5 Leetcode Array problems",
        "Set up GitHub portfolio repo and push first project"
      ],
      "project": "Build a CLI task manager in Python using OOP",
      "certification_goal": "Start Google Cloud Fundamentals course",
      "coding_goal": "5 Leetcode Easy problems solved",
      "interview_prep": "Study 'Tell me about yourself' and STAR method"
    }}
  ],
  "milestones": [
    {{
      "week": 4,
      "milestone": "Foundation Complete",
      "check": "Has 1 project on GitHub, solved 30 Leetcode problems",
      "celebration": "You're 25% of the way to your goal! 🎯"
    }}
  ],
  "application_timeline": {{
    "start_applying": "Week 20",
    "networking_start": "Week 16",
    "referral_outreach": "Week 18"
  }},
  "motivational_note": "<3 sentences: personal, specific encouragement referencing their actual skills>"
}}
"""
