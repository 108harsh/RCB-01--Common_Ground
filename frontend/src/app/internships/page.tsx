"use client"

import React, { useEffect, useState } from 'react'
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react'

export default function InternshipsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const studentId = localStorage.getItem('student_id') || '550e8400-e29b-41d4-a716-446655440000'
    fetch(`http://localhost:8000/api/internships/match/${studentId}`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
         <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
         <h2 className="text-xl text-white font-medium">Matching Agent is analyzing...</h2>
         <p className="text-gray-400 mt-2 max-w-md">Scanning 25+ top opportunities against your exact skill profile.</p>
      </div>
    )
  }

  const matches = Array.isArray(data?.matches) ? data.matches : []

  if (data?.error || data?.detail) {
    return (
      <div className="text-center mt-20 p-8 bg-red-500/10 border border-red-500/20 rounded-xl max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-400">Database Connection Error</h2>
        <p className="mt-4 text-sm text-gray-300">The backend returned an error, likely because Row-Level Security (RLS) is enabled in Supabase and blocking queries.</p>
        <p className="mt-2 text-sm text-gray-400 bg-black/40 p-3 rounded text-left font-mono">
           {JSON.stringify(data?.error || data?.detail)}
        </p>
        <p className="mt-4 text-sm text-emerald-400 font-semibold">Fix: Go to your Supabase Dashboard → Authentication → Policies, and Disable RLS for all tables.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Internship Matcher</h1>
        <p className="text-gray-400 mt-2">{data?.recommendation_summary || "Here are your top matched opportunities based on your skills."}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match: any, i: number) => (
          <div key={i} className="bg-[#13131A] border border-white/10 rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{match.opportunity_id || "Software Engineer Intern"}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1"><Briefcase size={14}/> Tech Company</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${match.match_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {match.match_score}% Match
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 flex-1">
              {match.why_matched}
            </p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {match.skill_gaps?.map((gap: string, j: number) => (
                  <span key={j} className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
                    {gap}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl mb-4 border border-white/5">
              <p className="text-xs text-violet-300 italic">" {match.advisor_note} "</p>
            </div>

            <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition flex justify-center items-center gap-2">
              Apply Now <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
