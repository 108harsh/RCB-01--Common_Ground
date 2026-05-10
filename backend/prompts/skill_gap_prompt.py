SYSTEM_PROMPT = """
You are the Skill Gap Agent inside CareerOS. You receive a student's detected
skills and a target role, and perform a deep gap analysis. Be precise.
"""

def build_skill_gap_prompt(student_context_json, target_role, detected_skills_list, ats_score):
    return f"""
Student Context: {student_context_json}
Target Role: {target_role}
Student's Detected Skills: {detected_skills_list}
Student's ATS Score: {ats_score}

Analyze the exact skill gap between the student and what is required for
{target_role} roles at top companies (FAANG, funded startups).

Return ONLY valid JSON:
{{
  "role": "{target_role}",
  "student_skill_level": "beginner|intermediate|advanced",
  "readiness_score": <integer 0-100>,
  "gap_analysis": {{
    "strong_matches": ["skill1", "skill2"],
    "partial_matches": [{{"skill": "Python", "student_level": "basic", "needed_level": "advanced"}}],
    "missing_critical": ["System Design", "Distributed Systems"],
    "missing_nice_to_have": ["Kubernetes", "GraphQL"]
  }},
  "estimated_months_to_ready": <integer>,
  "top_3_priorities": ["Learn Docker + containerization", "Build 2 full-stack projects", "Start DSA practice"],
  "recommended_resources": [
    {{"skill": "System Design", "resource": "Grokking the System Design Interview", "type": "course"}}
  ]
}}
"""
