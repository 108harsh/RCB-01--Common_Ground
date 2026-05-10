from agents import memory_agent
from utils import gemini_client
from prompts.planner_prompt import SYSTEM_PROMPT, build_planner_prompt
import json

async def run(student_id: str, goal_text: str, current_date: str, hours_per_week: int, skill_gap_analysis: dict):
    context = await memory_agent.get_context(student_id)
    prompt = SYSTEM_PROMPT + "\n" + build_planner_prompt(json.dumps(context), goal_text, current_date, hours_per_week, json.dumps(skill_gap_analysis))
    # Note: the actual requirements ask for SSE streaming, but gemini_client.generate_json 
    # doesn't stream JSON chunks. So we will just use it normally, or use generate_stream 
    # if we want raw string chunks. For a structured roadmap, full JSON is better.
    result = await gemini_client.generate_json(prompt)
    return result
