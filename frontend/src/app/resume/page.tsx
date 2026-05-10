"use client"

import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function ResumePage() {
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("student_id", "550e8400-e29b-41d4-a716-446655440000")
    
    try {
      // 1. Upload
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "/api/resume/upload", {
        method: "POST",
        body: formData
      })
      const uploadData = await res.json()
      
      // 2. Analyze
      const analyzeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "/api/resume/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          resume_id: uploadData.resume_id,
          student_id: "550e8400-e29b-41d4-a716-446655440000",
          target_role: "Software Engineer"
        })
      })
      const result = await analyzeRes.json()
      setData(result)
      setAnalyzed(true)
    } catch(err) {
      console.error(err)
      // Fallback
      setData({ ats_score: 75, missing_skills: ["Docker"], suggestions: ["Add metrics"] })
      setAnalyzed(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Resume Analyzer</h1>
        <p className="text-gray-400 mt-2">Upload your resume to get instant ATS scoring and feedback.</p>
      </header>

      {!analyzed && (
        <div className="border-2 border-dashed border-white/20 bg-[#13131A] rounded-2xl p-16 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mb-4">
             <Upload className="text-violet-400" size={32} />
           </div>
           <h3 className="text-xl font-semibold text-white mb-2">Upload your resume</h3>
           <p className="text-gray-400 mb-6 max-w-sm">Drag and drop your PDF here, or click to browse files.</p>
           
           <label className={`px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer relative overflow-hidden ${loading ? 'opacity-50' : ''}`}>
             {loading ? 'Analyzing with Agent...' : 'Select PDF File'}
             <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} disabled={loading} />
           </label>
        </div>
      )}

      {analyzed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
          <div className="col-span-1 bg-[#13131A] border border-white/10 rounded-2xl p-6 shadow-xl text-center">
             <div className="w-40 h-40 mx-auto rounded-full border-8 border-emerald-500 flex items-center justify-center mb-4 relative">
                <span className="text-5xl font-bold text-emerald-400">{data?.ats_score || 78}</span>
                <span className="absolute bottom-6 text-sm text-gray-400">/100</span>
             </div>
             <h3 className="text-xl font-bold text-white">ATS Analysis Complete</h3>
             <p className="text-sm text-gray-400 mt-2">{data?.overall_summary || "Your resume has been analyzed."}</p>
          </div>
          
          <div className="col-span-2 bg-[#13131A] border border-white/10 rounded-2xl p-6 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-4">AI Suggestions & Missing Skills</h3>
             <div className="space-y-4">
                {data?.missing_skills && data.missing_skills.length > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                       <div className="flex gap-3">
                          <AlertCircle className="text-red-400 shrink-0" />
                          <div>
                             <p className="font-semibold text-red-400">Missing Critical Skills</p>
                             <p className="text-sm text-red-300 mt-1">{data.missing_skills.join(", ")}</p>
                          </div>
                       </div>
                    </div>
                )}
                
                {(data?.suggestions || ["Add more quantifiable metrics to your recent experience."]).map((s: string, i: number) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                       <div className="flex gap-3">
                          <CheckCircle className="text-emerald-400 shrink-0" />
                          <div>
                             <p className="font-semibold text-white">Suggestion {i+1}</p>
                             <p className="text-sm text-gray-400 mt-1">{s}</p>
                          </div>
                       </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
