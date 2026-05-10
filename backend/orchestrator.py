from database import log_agent_start, log_agent_complete, supabase
from agents import resume_agent, skill_gap_agent, matching_agent, interview_agent, planner_agent

async def run_resume_agent(student_id: str, resume_text: str, target_role: str = ""):
    log_id = await log_agent_start("resume_agent", student_id, {"target_role": target_role})
    result = await resume_agent.run(student_id, resume_text, target_role)
    await log_agent_complete(log_id, result)
    return result

async def run_skill_gap_agent(student_id: str, target_role: str, detected_skills: list, ats_score: int):
    log_id = await log_agent_start("skill_gap_agent", student_id, {"target_role": target_role})
    result = await skill_gap_agent.run(student_id, target_role, detected_skills, ats_score)
    await log_agent_complete(log_id, result)
    return result

async def run_matching_agent(student_id: str, opportunities: list, detected_skills: list, target_role: str):
    log_id = await log_agent_start("matching_agent", student_id, {"opportunities": len(opportunities)})
    result = await matching_agent.run(student_id, opportunities, detected_skills, target_role)
    await log_agent_complete(log_id, result)
    return result

async def run_interview_question_agent(student_id: str, target_role: str, mode: str, session_summary: str, topic_weakness_map: dict, questions_so_far: list):
    log_id = await log_agent_start("interview_agent (question)", student_id, {"mode": mode})
    result = await interview_agent.generate_question(student_id, target_role, mode, session_summary, topic_weakness_map, questions_so_far)
    await log_agent_complete(log_id, result)
    return result

async def run_interview_evaluation_agent(student_id: str, question: str, topic: str, student_answer: str):
    log_id = await log_agent_start("interview_agent (evaluate)", student_id, {"topic": topic})
    result = await interview_agent.evaluate_answer(student_id, question, topic, student_answer)
    await log_agent_complete(log_id, result)
    return result

async def run_planner_agent(student_id: str, goal_text: str, current_date: str, hours_per_week: int, skill_gap_analysis: dict):
    log_id = await log_agent_start("planner_agent", student_id, {"goal_text": goal_text})
    result = await planner_agent.run(student_id, goal_text, current_date, hours_per_week, skill_gap_analysis)
    await log_agent_complete(log_id, result)
    return result
