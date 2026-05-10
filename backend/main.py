from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, internships, interview, planner, student, health
from config import config

app = FastAPI(title="CareerOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(internships.router, prefix="/api/internships", tags=["internships"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(planner.router, prefix="/api/planner", tags=["planner"])
app.include_router(student.router, prefix="/api/student", tags=["student"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
