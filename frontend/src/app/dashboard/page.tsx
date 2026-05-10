"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const studentId = localStorage.getItem('student_id') || '550e8400-e29b-41d4-a716-446655440000'
    fetch(`http://localhost:8000/api/student/dashboard/${studentId}`)
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
    return <div className="text-white">Loading dashboard...</div>
  }

  const healthScore = data?.career_health_score || 0;
  const atsScore = data?.latest_ats_score || 0;
  const interviewAvg = data?.interview_avg_score ? data.interview_avg_score.toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back {data?.full_name}, let's track your career progress.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <h2 className="text-lg font-semibold text-white">Career Health Score</h2>
              <p className="text-sm text-gray-400 max-w-sm mt-1">
                Your readiness based on resume strength, skills, and mock interviews.
              </p>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-violet-600/20 border-4 border-violet-500">
              <span className="text-4xl font-bold text-violet-400">{healthScore}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#13131A] border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">ATS Score</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{atsScore}/100</p>
            </div>
            <div className="bg-[#13131A] border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">Target Role</p>
              <p className="text-xl font-bold text-violet-400 mt-2 truncate">{data?.target_role || 'Not Set'}</p>
            </div>
            <div className="bg-[#13131A] border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">Interview Avg</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">{interviewAvg}/10</p>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 h-full shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Skill Gaps Detected</h3>
            <div className="space-y-3">
              {data?.missing_skills?.slice(0, 4).map((skill: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-gray-300">{skill.skill || skill}</span>
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-md">Missing</span>
                </div>
              ))}
              {!data?.missing_skills?.length && (
                <p className="text-gray-500 text-sm">No critical gaps detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
           <h3 className="text-lg font-semibold text-white">Ready for a challenge?</h3>
           <p className="text-gray-400 mt-1 text-sm">Start a new mock interview session to boost your score.</p>
        </div>
        <Link href="/interview" className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition">
          Start Mock Interview
        </Link>
      </div>
    </div>
  )
}
