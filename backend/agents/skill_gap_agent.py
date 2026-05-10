from agents import memory_agent
from utils import gemini_client
from prompts.skill_gap_prompt import SYSTEM_PROMPT, build_skill_gap_prompt
import json

async def run(student_id: str, target_role: str, detected_skills: list, ats_score: int):
    context = await memory_agent.get_context(student_id)
    prompt = SYSTEM_PROMPT + "\n" + build_skill_gap_prompt(json.dumps(context), target_role, detected_skills, ats_score)
    result = await gemini_client.generate_json(prompt)
    return result
