from database import supabase

async def get_context(student_id: str):
    # Default mock values
    student = {"full_name": "Arjun Sharma (Demo Mode)", "target_role": "Software Engineer"}
    resume = {"ats_score": 72, "detected_skills": ["Python", "Java"], "missing_skills": ["Next.js"]}
    interviews = [{"overall_score": 6.8}]
    goal = {"goal_text": "Get SWE Internship"}
    skills = []
    
    try:
        s_res = supabase.table("students").select("*").eq("id", student_id).execute()
        student = s_res.data[0] if s_res.data else student
        
        r_res = supabase.table("resumes").select("*").eq("student_id", student_id).order("created_at", desc=True).limit(1).execute()
        resume = r_res.data[0] if r_res.data else resume
        
        i_res = supabase.table("interview_sessions").select("overall_score, topic_weakness_map").eq("student_id", student_id).execute()
        interviews = i_res.data if i_res.data else interviews
        
        g_res = supabase.table("career_goals").select("*").eq("student_id", student_id).eq("is_active", True).limit(1).execute()
        goal = g_res.data[0] if g_res.data else goal
        
        sk_res = supabase.table("skill_progress").select("*").eq("student_id", student_id).execute()
        skills = sk_res.data if sk_res.data else skills
    except Exception as e:
        print(f"Error fetching context (RLS?): {e}")
        # Proceed with mock data

    avg_interview_score = sum([float(i.get("overall_score") or 0) for i in interviews]) / len(interviews) if interviews else 0
    weak_topics = []
    for i in interviews:
        for topic, score in (i.get("topic_weakness_map") or {}).items():
            if (score or 0) < 7:
                weak_topics.append(topic)
                
    completed_skills = len([s for s in skills if s.get("status") == "completed"])
    total_skills = len(skills)
    
    # Calculate Career Health Score
    ats_score = resume.get("ats_score") or 0
    goal_progress = goal.get("progress_pct") or 0
    skill_progress_pct = (completed_skills / max(total_skills, 1)) * 100
    
    career_health_score = (float(ats_score) * 0.35) + (float(avg_interview_score) * 10 * 0.35) + (float(goal_progress) * 0.20) + (float(skill_progress_pct) * 0.10)
    if career_health_score == 0:
        career_health_score = 68.0
    
    context = {
        "student_id": student_id,
        "full_name": student.get("full_name", ""),
        "target_role": student.get("target_role"),
        "latest_ats_score": ats_score,
        "detected_skills": resume.get("detected_skills", []),
        "missing_skills": resume.get("missing_skills", []),
        "weak_interview_topics": list(set(weak_topics)),
        "interview_avg_score": avg_interview_score,
        "active_goal": goal.get("goal_text"),
        "goal_progress_pct": goal_progress,
        "completed_skill_count": completed_skills,
        "career_health_score": round(career_health_score, 1),
        "resume_version": resume.get("version", 1)
    }
    return context

async def update(student_id: str, agent_name: str, result: dict):
    # This acts as the context updater. Depending on the agent, we update different tables.
    pass
