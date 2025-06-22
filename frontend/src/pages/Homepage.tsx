"use client"

import { Button } from "../components/ui/button"
import { Send, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Homepage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(245,241,237,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      {/* Floating geometric shapes with enhanced animations */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-[#F5F1ED]/20 rounded-full animate-pulse shadow-lg shadow-[#F5F1ED]/10" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#F5F1ED]/20 rotate-45 animate-pulse shadow-lg shadow-[#F5F1ED]/10" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-16 border border-[#F5F1ED]/20 rounded-full animate-pulse shadow-lg shadow-[#F5F1ED]/10" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-10 w-20 h-20 border border-[#F5F1ED]/20 rotate-45 animate-pulse shadow-lg shadow-[#F5F1ED]/10" style={{ animationDelay: '0.5s' }} />
      
      {/* Additional decorative elements */}
      <div className="absolute top-40 right-40 w-8 h-8 bg-gradient-to-r from-[#F5F1ED]/30 to-transparent rounded-full blur-sm animate-ping" />
      <div className="absolute bottom-40 left-40 w-6 h-6 bg-gradient-to-r from-[#F5F1ED]/40 to-transparent rounded-full blur-sm animate-ping" style={{ animationDelay: '1.5s' }} />
      
      {/* Header with enhanced styling */}
      <header className="relative z-10 flex justify-end p-6">
        <Button
          variant="outline"
          className="bg-[#F5F1ED]/10 backdrop-blur-md text-[#F5F1ED] border-[#F5F1ED]/30 px-8 py-3 rounded-full font-light hover:bg-[#F5F1ED]/20 hover:border-[#F5F1ED]/50 transition-all duration-500 hover:scale-105 shadow-lg shadow-[#F5F1ED]/10 hover:shadow-xl hover:shadow-[#F5F1ED]/20"
        >
          Sign in
        </Button>
      </header>
      
      {/* Main content with enhanced animations */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="text-center space-y-16">
          {/* Main heading with fancy effects */}
          <div className="relative">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium text-[#F5F1ED] tracking-tight drop-shadow-2xl leading-none">
              <span className="italic">
                Easyware
              </span>
            </h1>
          </div>
          
          {/* Subheading with enhanced styling */}
          <p className="text-[#F5F1ED]/90 text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            What do you want to build today?
          </p>
          
          {/* Enhanced search input */}
          <div className="relative w-full max-w-2xl mx-auto group">
            <div className="flex items-center bg-[#F5F1ED]/10 backdrop-blur-md border border-[#F5F1ED]/30 rounded-3xl px-8 py-6 focus-within:ring-2 focus-within:ring-[#F5F1ED]/20 focus-within:border-[#F5F1ED]/50 focus-within:shadow-lg focus-within:shadow-[#F5F1ED]/10 transition-all duration-300 hover:shadow-md hover:shadow-[#F5F1ED]/5">
              <textarea
                placeholder="Help me build a bluetooth doorknob..."
                className="flex-1 bg-transparent text-[#F5F1ED] placeholder:text-[#F5F1ED]/60 font-light text-lg resize-none outline-none border-none focus:ring-0"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 10 * 16);
                  target.style.height = newHeight + 'px';
                }}
              />
              <Button
                size="icon"
                onClick={() => navigate('/chat')}
                className="bg-[#F5F1ED] hover:bg-[#F5F1ED]/90 text-[#272727] rounded-full w-14 h-14 flex-shrink-0 ml-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#F5F1ED]/20"
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
            {/* Subtle glow around input */}
            <div className="absolute inset-0 blur-xl bg-[#F5F1ED]/5 rounded-3xl -z-10 group-hover:bg-[#F5F1ED]/8 transition-all duration-300" />
          </div>
        </div>
      </main>
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]/30 pointer-events-none" />
    </div>
  )
}
