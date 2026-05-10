from agents import memory_agent
from utils import gemini_client
from prompts.resume_prompt import SYSTEM_PROMPT, build_resume_prompt
import json

async def run(student_id: str, resume_text: str, target_role: str = ""):
    context = await memory_agent.get_context(student_id)
    prompt = SYSTEM_PROMPT + "\n" + build_resume_prompt(json.dumps(context), resume_text, target_role)
    result = await gemini_client.generate_json(prompt)
    return result
