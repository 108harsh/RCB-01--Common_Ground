"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Briefcase, Map, Mic, User } from 'lucide-react'

export function ClientSidebar() {
  const pathname = usePathname()
  
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Internships', path: '/internships', icon: Briefcase },
    { name: 'Career Planner', path: '/planner', icon: Map },
    { name: 'Mock Interview', path: '/interview', icon: Mic },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <aside className="w-64 border-r border-white/10 bg-[#13131A] p-6 hidden md:block">
      <h1 className="text-xl font-bold text-violet-500 mb-8 flex items-center gap-2">
        <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center text-white">C</div>
        CareerOS
      </h1>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.path)
          const Icon = link.icon
          return (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? 'bg-violet-600/10 text-violet-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={18} className={isActive ? 'text-violet-400' : 'text-gray-400'} />
              {link.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-8 absolute bottom-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">AS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Arjun Sharma</p>
              <p className="text-xs text-emerald-400">● Agents Active</p>
            </div>
         </div>
      </div>
    </aside>
  )
}
