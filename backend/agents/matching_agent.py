from agents import memory_agent
from utils import gemini_client
from prompts.matching_prompt import SYSTEM_PROMPT, build_matching_prompt
import json

async def run(student_id: str, opportunities: list, detected_skills: list, target_role: str):
    context = await memory_agent.get_context(student_id)
    prompt = SYSTEM_PROMPT + "\n" + build_matching_prompt(json.dumps(context), json.dumps(opportunities), detected_skills, target_role)
    result = await gemini_client.generate_json(prompt)
    return result
