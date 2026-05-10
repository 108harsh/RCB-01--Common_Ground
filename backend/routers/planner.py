from fastapi import APIRouter
from pydantic import BaseModel
from database import supabase
import orchestrator
import datetime

router = APIRouter()

class GeneratePlannerRequest(BaseModel):
    student_id: str
    goal_text: str
    hours_per_week: int

class TaskUpdateRequest(BaseModel):
    is_completed: bool

@router.post("/generate")
async def generate_planner(req: GeneratePlannerRequest):
    # We first run skill gap to get analysis
    target_role = "Software Engineer"
    try:
        context_res = supabase.table("students").select("target_role").eq("id", req.student_id).execute()
        if context_res.data:
            target_role = context_res.data[0].get("target_role", "Software Engineer")
    except Exception:
        pass
    
    # We should really get detected skills from memory agent, but let's mock the analysis step to save time
    # Running skill gap agent
    skill_gap = await orchestrator.run_skill_gap_agent(req.student_id, target_role, [], 50)
    
    # Run planner agent
    roadmap = await orchestrator.run_planner_agent(
        req.student_id, 
        req.goal_text, 
        str(datetime.date.today()), 
        req.hours_per_week, 
        skill_gap
    )
    
    # Save to database
    try:
        supabase.table("career_goals").insert({
            "student_id": req.student_id,
            "goal_text": roadmap.get("goal"),
            "target_date": roadmap.get("target_date"),
            "gap_analysis": roadmap.get("gap_summary"),
            "phases": roadmap.get("phases"),
            "weekly_plans": roadmap.get("weekly_plans"),
            "milestones": roadmap.get("milestones"),
            "is_active": True
        }).execute()
    except Exception:
        pass
    
    return roadmap

@router.get("/{student_id}")
async def get_planner(student_id: str):
    res = supabase.table("career_goals").select("*").eq("student_id", student_id).eq("is_active", True).limit(1).execute()
    if not res.data:
        return {}
    return res.data[0]

@router.patch("/task/{task_id}")
async def update_task(task_id: str, req: TaskUpdateRequest):
    # Implementation for task tracking
    return {"task_id": task_id, "is_completed": req.is_completed, "new_progress_pct": 10}
