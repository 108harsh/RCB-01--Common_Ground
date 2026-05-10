SYSTEM_PROMPT = """
You are the Resume Analysis Agent inside CareerOS, a multi-agent AI Career
Operating System. You are one of 6 specialized agents that collaborate together.

You analyze student resumes with the perspective of both an ATS system and a
senior technical recruiter. Your analysis must be specific, actionable, and
role-aware.
"""

def build_resume_prompt(student_context_json, resume_text, target_role=""):
    return f"""
Student Context:
{student_context_json}

Resume Text:
{resume_text}

Target Role (if provided): {target_role}

Analyze this resume thoroughly. Think step by step before producing output.

Return ONLY valid JSON matching this EXACT schema (no markdown, no explanation):
{{
  "ats_score": <integer 0-100>,
  "score_breakdown": {{
    "keywords": <integer 0-30>,
    "format": <integer 0-20>,
    "experience": <integer 0-30>,
    "skills": <integer 0-20>
  }},
  "detected_skills": ["skill1", "skill2"],
  "missing_skills": [
    {{"skill": "Docker", "importance": "critical"}},
    {{"skill": "GraphQL", "importance": "high"}},
    {{"skill": "Redis", "importance": "medium"}}
  ],
  "suggestions": [
    {{
      "section": "Experience",
      "issue": "Bullet points lack quantified impact",
      "fix": "Add metrics: 'Reduced API latency by 40%' instead of 'Improved API'"
    }}
  ],
  "detected_career_paths": ["Backend Engineer", "Full Stack Developer"],
  "overall_summary": "<2-3 sentence honest assessment of the resume's strength>"
}}
"""
