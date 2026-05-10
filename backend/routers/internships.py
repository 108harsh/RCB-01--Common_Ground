from fastapi import APIRouter
from database import supabase
from agents import memory_agent
import orchestrator

router = APIRouter()

@router.get("/match/{student_id}")
async def match_internships(student_id: str):
    context = await memory_agent.get_context(student_id)
    
    opportunities = [{"title": "Software Engineer Intern", "company": "Google", "skills": ["Python", "Java"], "id": "1"}, {"title": "Backend Intern", "company": "Amazon", "skills": ["AWS", "Node"], "id": "2"}]
    try:
        opps_res = supabase.table("internship_opportunities").select("*").eq("is_active", True).execute()
        if opps_res.data:
            opportunities = opps_res.data
    except Exception as e:
        print("DB Error in internships:", e)
    
    result = await orchestrator.run_matching_agent(
        student_id, 
        opportunities, 
        context.get("detected_skills", []), 
        context.get("target_role", "Software Engineer")
    )
    
    return {
        "matches": result.get("matches", []),
        "recommendation_summary": result.get("recommendation_summary", ""),
        "generated_at": "now"
    }
