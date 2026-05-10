from supabase import create_client, Client
from config import config

supabase: Client = create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY)

async def log_agent_start(agent_name: str, student_id: str, payload: dict):
    try:
        response = supabase.table("agent_logs").insert({
            "agent_name": agent_name,
            "student_id": student_id,
            "action": "started",
            "input_summary": str(payload),
            "status": "running"
        }).execute()
        return response.data[0]["id"]
    except Exception as e:
        print(f"Ignored DB Error: {e}")
        return "mock_id"

async def log_agent_complete(log_id: str, result: dict):
    if log_id == "mock_id": return []
    try:
        response = supabase.table("agent_logs").update({
            "action": "completed",
            "status": "completed",
            "output_summary": str(result)[:500] + "..." if len(str(result)) > 500 else str(result)
        }).eq("id", log_id).execute()
        return response.data
    except Exception:
        return []
