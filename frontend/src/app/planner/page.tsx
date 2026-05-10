"use client"

import React, { useState } from 'react'
import { Map, CheckCircle2 } from 'lucide-react'

export default function PlannerPage() {
  const [goal, setGoal] = useState("Google SWE Intern in 6 months")
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<any>(null)

  const generatePlan = async () => {
    setLoading(true)
    const studentId = localStorage.getItem('student_id') || '550e8400-e29b-41d4-a716-446655440000'
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `/api/planner/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, goal_text: goal, hours_per_week: 20 })
      })
      const data = await res.json()
      setRoadmap(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Career Planner</h1>
        <p className="text-gray-400 mt-2">Generate a personalized week-by-week sprint to achieve your dream role.</p>
      </header>

      {!roadmap && (
        <div className="bg-[#13131A] border border-white/10 rounded-2xl p-8 shadow-xl max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">What is your career goal?</label>
            <textarea 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-4 text-white text-lg outline-none focus:border-violet-500 resize-none h-32"
            />
          </div>
          
          <button 
             onClick={generatePlan}
             disabled={loading}
             className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
             {loading ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 Planner Agent is Analyzing...
               </>
             ) : (
               <>
                 <Map size={20} /> Generate My Roadmap
               </>
             )}
          </button>
        </div>
      )}

      {roadmap && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-6">
             <h2 className="text-xl font-bold text-white mb-2">Goal: {roadmap.goal}</h2>
             <p className="text-violet-200">{roadmap.readiness_assessment}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Your Weekly Sprints</h3>
            
            {(roadmap.weekly_plans || []).map((week: any, i: number) => (
              <div key={i} className="bg-[#13131A] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-black/20 p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Week {week.week}</span>
                    <h4 className="text-lg font-bold text-white mt-1">{week.theme}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{i+1}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Tasks</p>
                  <ul className="space-y-3 mb-6">
                    {(week.tasks || []).map((task: string, j: number) => (
                      <li key={j} className="flex items-start gap-3 text-gray-300">
                         <button className="mt-0.5 text-gray-500 hover:text-emerald-400 transition">
                           <CheckCircle2 size={18} />
                         </button>
                         <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase">Project Focus</p>
                        <p className="text-sm text-white">{week.project || "None"}</p>
                     </div>
                     <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase">Interview Prep</p>
                        <p className="text-sm text-white">{week.interview_prep || "None"}</p>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
