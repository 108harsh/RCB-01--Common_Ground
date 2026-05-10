from fastapi import APIRouter
from database import supabase
from agents import memory_agent

router = APIRouter()

@router.get("/dashboard/{student_id}")
async def get_dashboard(student_id: str):
    context = await memory_agent.get_context(student_id)
    return context

@router.get("/history/{student_id}")
async def get_history(student_id: str):
    resumes = supabase.table("resumes").select("*").eq("student_id", student_id).execute()
    interviews = supabase.table("interview_sessions").select("*").eq("student_id", student_id).execute()
    skills = supabase.table("skill_progress").select("*").eq("student_id", student_id).execute()
    logs = supabase.table("agent_logs").select("*").eq("student_id", student_id).order("created_at", desc=True).limit(5).execute()
    
    return {
        "resume_versions": resumes.data,
        "interview_sessions": interviews.data,
        "skill_progress": skills.data,
        "agent_logs": logs.data
    }
