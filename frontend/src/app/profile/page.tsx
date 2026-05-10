"use client"

import React, { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    const studentId = localStorage.getItem('student_id') || '550e8400-e29b-41d4-a716-446655440000'
    fetch(`http://localhost:8000/api/student/history/${studentId}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e))
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Student Profile</h1>
        <p className="text-gray-400 mt-2">Your historical progress and agent logs.</p>
      </header>

      <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Recent Agent Activity</h3>
        <div className="space-y-4">
           {data?.agent_logs?.map((log: any, i: number) => (
             <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3">
               <div>
                 <p className="text-white font-medium capitalize">{log.agent_name.replace('_', ' ')}</p>
                 <p className="text-sm text-gray-400">Status: {log.status}</p>
               </div>
               <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
             </div>
           ))}
           {!data?.agent_logs?.length && (
             <p className="text-gray-500 text-sm">No agent activity recorded yet.</p>
           )}
        </div>
      </div>
      
      <div className="bg-[#13131A] border border-white/10 rounded-2xl p-6 shadow-xl text-center">
         <h3 className="text-lg font-bold text-white mb-2">Hackathon Demo Controls</h3>
         <p className="text-sm text-gray-400 mb-6">Reset all generated data to show a fresh demo flow.</p>
         <button className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition">
           Reset Demo Data
         </button>
      </div>
    </div>
  )
}
