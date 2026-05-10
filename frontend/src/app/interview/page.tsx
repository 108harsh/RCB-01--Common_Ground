"use client"

import React, { useState } from 'react'
import { Mic, Send, AlertCircle } from 'lucide-react'

export default function InterviewPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [history, setHistory] = useState<any[]>([])
  
  const startInterview = async () => {
    setLoading(true)
    const studentId = localStorage.getItem('student_id') || '550e8400-e29b-41d4-a716-446655440000'
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, target_role: "Software Engineer", mode: "technical" })
      })
      const data = await res.json()
      if (data.error || data.detail) {
        alert("Database Error: " + JSON.stringify(data.error || data.detail) + ". Please disable RLS in Supabase.")
        setLoading(false)
        return
      }
      setSession(data)
      setHistory([{ type: 'agent', content: data.first_question?.question || "Let's begin." }])
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if(!answer.trim() || !session) return;
    
    const newHistory = [...history, { type: 'user', content: answer }]
    setHistory(newHistory)
    setAnswer("")
    setLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `/api/interview/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: session.session_id, 
          question_id: session.first_question?.question_id || "q1", 
          answer 
        })
      })
      const data = await res.json()
      
      setHistory([
        ...newHistory, 
        { type: 'feedback', content: `Score: ${data.evaluation?.score}/10. ${data.evaluation?.strengths?.[0] || 'Good effort.'}` },
        { type: 'agent', content: data.next_question?.question || "Next question..." }
      ])
      // Update current question reference if needed
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center border-4 border-violet-500/30">
           <Mic size={32} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mock Interview Agent</h1>
          <p className="text-gray-400 mt-2">Get adaptive, role-specific interview practice. I will focus on your weak areas automatically.</p>
        </div>
        
        <div className="w-full bg-[#13131A] p-6 rounded-2xl border border-white/10 text-left">
           <label className="block text-sm text-gray-400 mb-2">Target Role</label>
           <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white mb-4 outline-none focus:border-violet-500">
             <option>Software Engineer Intern</option>
             <option>Backend Engineer</option>
             <option>Data Scientist</option>
           </select>
           
           <button 
             onClick={startInterview}
             disabled={loading}
             className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {loading ? "Initializing Agent..." : "Start Session"}
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-[#13131A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
         <div>
           <h2 className="text-white font-semibold flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Live Interview Session
           </h2>
           <p className="text-xs text-gray-400">Software Engineer Intern</p>
         </div>
         <button className="px-4 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md text-sm font-medium transition">
           End Session
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.type === 'user' 
                ? 'bg-violet-600 text-white rounded-br-sm' 
                : msg.type === 'feedback'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-tl-sm text-sm'
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
            }`}>
              {msg.type === 'agent' && <p className="text-xs text-violet-400 mb-1 font-semibold uppercase tracking-wider">Agent</p>}
              {msg.type === 'feedback' && <p className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12}/> Feedback</p>}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 w-16 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex gap-2">
          <textarea 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
            placeholder="Type your answer here..."
            className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-violet-500 resize-none h-14"
          />
          <button 
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="w-14 h-14 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
