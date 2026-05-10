from fastapi import APIRouter
from database import supabase
import datetime

router = APIRouter()

@router.get("/")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.datetime.now().isoformat(),
        "agents": ["resume", "skill_gap", "matching", "interview", "planner", "memory"]
    }

@router.post("/demo/reset/{student_id}")
async def reset_demo(student_id: str):
    # This is a dangerous operation in production, but needed for demo.
    # We would run the seed_demo_student.sql script or manually delete records.
    supabase.table("resumes").delete().eq("student_id", student_id).execute()
    supabase.table("interview_sessions").delete().eq("student_id", student_id).execute()
    supabase.table("career_goals").delete().eq("student_id", student_id).execute()
    supabase.table("skill_progress").delete().eq("student_id", student_id).execute()
    supabase.table("weekly_tasks").delete().eq("student_id", student_id).execute()
    supabase.table("agent_logs").delete().eq("student_id", student_id).execute()
    
    return {"reset": True}
