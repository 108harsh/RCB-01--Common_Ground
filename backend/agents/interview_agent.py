from agents import memory_agent
from utils import gemini_client
from prompts.interview_prompt import MODE_A_SYSTEM_PROMPT, MODE_B_SYSTEM_PROMPT, build_question_prompt, build_evaluation_prompt
import json

async def generate_question(student_id: str, target_role: str, mode: str, session_summary: str, topic_weakness_map: dict, questions_so_far: list):
    context = await memory_agent.get_context(student_id)
    prompt = MODE_A_SYSTEM_PROMPT + "\n" + build_question_prompt(json.dumps(context), target_role, mode, session_summary, json.dumps(topic_weakness_map), json.dumps(questions_so_far))
    result = await gemini_client.generate_json(prompt)
    return result

async def evaluate_answer(student_id: str, question: str, topic: str, student_answer: str):
    context = await memory_agent.get_context(student_id)
    prompt = MODE_B_SYSTEM_PROMPT + "\n" + build_evaluation_prompt(question, topic, student_answer, json.dumps(context))
    result = await gemini_client.generate_json(prompt)
    return result
