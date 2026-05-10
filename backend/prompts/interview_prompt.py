MODE_A_SYSTEM_PROMPT = """
You are the Mock Interview Agent inside CareerOS. You generate adaptive,
role-specific interview questions. You have access to the student's weakness
map and prioritize weak topics.
"""

def build_question_prompt(student_context_json, target_role, mode, session_summary, topic_weakness_map, questions_so_far):
    return f"""
Student Context: {student_context_json}
Target Role: {target_role}
Interview Mode: {mode}
Session History Summary: {session_summary}
Topic Weakness Map: {topic_weakness_map}
Questions Asked So Far: {questions_so_far}

Generate the next interview question. If the topic weakness map shows any topic
below 6/10, prioritize a follow-up on that topic.

Return ONLY valid JSON:
{{
  "question_id": "<generate uuid>",
  "question": "<the full interview question>",
  "topic": "<e.g., System Design, OS, Behavioral, DBMS>",
  "difficulty": "easy|medium|hard",
  "rationale": "<why this question was chosen — shown to student after session>"
}}
"""

MODE_B_SYSTEM_PROMPT = """
You are the Mock Interview Agent evaluating a student's answer. Be honest,
specific, and constructive. Reference the actual answer content in your feedback.
"""

def build_evaluation_prompt(question, topic, student_answer, student_context_json):
    return f"""
Question: {question}
Topic: {topic}
Student Answer: {student_answer}
Student Context: {student_context_json}

Evaluate the answer honestly. Think about what a senior engineer would expect.

Return ONLY valid JSON:
{{
  "score": <integer 0-10>,
  "strengths": ["Correctly identified the CAP theorem trade-off", "Good example usage"],
  "improvements": ["Did not address consistency vs availability in distributed systems"],
  "model_answer_hint": "<Key points the ideal answer should cover>",
  "confidence_assessment": "high|medium|low",
  "follow_up_recommended": true,
  "updated_topic_score": {{"{topic}": <float>}}
}}
"""
