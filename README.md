# CareerOS - Agentic Career Ecosystem 🚀

**CareerOS** is a multi-agent AI career platform developed for the GDG Nagpur Agentic Premier League Hackathon by **Team RCB**. 

Unlike standard AI wrappers, CareerOS functions as a unified "operating system." It deploys 5 specialized AI agents that share context through a persistent memory database (Supabase) to intelligently guide students from resume-building all the way to securing internships.

---

## 🌟 Key Features & Agent Ecosystem

CareerOS operates using a persistent memory architecture. The **Memory Agent** constantly evaluates your progress across the platform to calculate a live **Career Health Score**.

1. **Resume Analyzer (Skill Gap Agent)**: Upload your PDF resume. The AI parses the actual text, grades it against ATS systems, and flags critical missing skills for your target role.
2. **Intelligent Internship Matcher (Matching Agent)**: Instead of basic keyword matching, the AI compares your active skills against a live Supabase database of job postings, explaining *why* you are a good fit and what you need to learn.
3. **Adaptive Mock Interviewer (Interview Agent)**: A conversational technical interviewer. **Agentic feature:** It remembers your weak topics from past sessions and actively targets them in future interviews to force improvement.
4. **Personalized Career Planner (Planner Agent)**: Generates a week-by-week sprint roadmap to help you achieve your goals based on the exact skills the Resume Agent said you were missing.

---

## 💻 Technology Stack

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS v4 & Framer Motion
* **Deployment:** Vercel

### Backend
* **Framework:** FastAPI (Python 3.11)
* **AI Engine:** Google Gemini 2.5 Flash API
* **Resume Parsing:** pdfminer.six
* **Deployment:** Render

### Database & State
* **Database:** Supabase (PostgreSQL)
* **Features:** Relational schema holding Student Profiles, Agent Logs, Resumes, Interview Sessions, and Internship Opportunities.

---

## 🛠️ How to Run Locally

To test this project locally, you will need to start both the Python backend and the Next.js frontend.

### 1. Setup the Database
1. Create a Supabase project.
2. Run the SQL schemas located in `/database/schema.sql`.
3. **CRITICAL:** Disable Row-Level Security (RLS) on all tables for local testing.

### 2. Start the Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # (Windows) or source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_key
```
Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Run the app:
```bash
npm run dev
```

Visit `http://localhost:3000` to interact with CareerOS!

---
*Built with ❤️ for the GDG Nagpur Hackathon*
