from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from database import supabase
import orchestrator

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_id: str
    student_id: str
    target_role: Optional[str] = ""

@router.post("/upload")
async def upload_resume(student_id: str = Form(...), file: UploadFile = File(...)):
    # Upload to supabase storage (mocked for simplicity, as we don't have storage set up easily in script)
    # Read text using pdfminer.six
    from pdfminer.high_level import extract_text
    import io
    content = await file.read()
    pdf_file = io.BytesIO(content)
    text = extract_text(pdf_file)
    
    # Store in DB
    resume_id = "mock_resume_id"
    try:
        response = supabase.table("resumes").insert({
            "student_id": student_id,
            "file_url": f"https://example.com/{file.filename}",
            "parsed_text": text
        }).execute()
        if response.data:
            resume_id = response.data[0]["id"]
    except Exception as e:
        print("DB error on upload:", e)
    
    return {
        "resume_id": resume_id,
        "file_url": f"https://example.com/{file.filename}",
        "parsed_text_preview": text[:500]
    }

@router.post("/analyze")
async def analyze_resume(req: AnalyzeRequest):
    resume_text = "Experienced software engineer intern candidate with Python, Java, and Next.js skills."
    try:
        resume_res = supabase.table("resumes").select("*").eq("id", req.resume_id).execute()
        if resume_res.data:
            resume_text = resume_res.data[0].get("parsed_text", "")
    except Exception:
        pass
        
    result = await orchestrator.run_resume_agent(req.student_id, resume_text, req.target_role)
    
    # Update DB
    try:
        supabase.table("resumes").update({
            "ats_score": result.get("ats_score", 0),
            "score_breakdown": result.get("score_breakdown", {}),
            "detected_skills": result.get("detected_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "suggestions": result.get("suggestions", []),
            "overall_summary": result.get("overall_summary", "")
        }).eq("id", req.resume_id).execute()
    except Exception:
        pass
    
    return result
