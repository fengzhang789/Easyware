"use client"

import { Button } from "../components/ui/button"
import { Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import WrenchIcon from "../assets/images/wrench-icon.png"
import HammerIcon from "../assets/images/hammer-icon.png"

export default function Homepage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20 animate-fade-in" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(245,241,237,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      {/* Floating geometric shapes with enhanced animations */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-[#F5F1ED]/20 rounded-full animate-pulse shadow-lg shadow-[#F5F1ED]/10 animate-fade-in" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-[-5rem] right-[-5rem] w-72 h-72 border border-[#F5F1ED]/20 rotate-45 animate-pulse shadow-lg shadow-[#F5F1ED]/10 animate-fade-in" style={{ animationDelay: '0.4s', animation: 'pulse 2s ease-in-out infinite 1s' }} />
      <div className="absolute bottom-[-6rem] left-[-4rem] w-64 h-64 border border-[#F5F1ED]/20 rounded-full animate-pulse shadow-lg shadow-[#F5F1ED]/10 animate-fade-in" style={{ animationDelay: '0.6s', animation: 'pulse 2s ease-in-out infinite 2s' }} />
      <div className="absolute top-1/3 right-10 w-20 h-20 border border-[#F5F1ED]/20 rotate-45 animate-pulse shadow-lg shadow-[#F5F1ED]/10 animate-fade-in" style={{ animationDelay: '0.8s', animation: 'pulse 2s ease-in-out infinite 0.5s' }} />
      
      {/* Additional decorative elements */}
      <div className="absolute top-40 right-40 w-8 h-8 bg-gradient-to-r from-[#F5F1ED]/30 to-transparent rounded-full blur-sm animate-ping animate-fade-in" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-40 w-6 h-6 bg-gradient-to-r from-[#F5F1ED]/40 to-transparent rounded-full blur-sm animate-ping animate-fade-in" style={{ animationDelay: '1.2s', animation: 'ping 2s ease-in-out infinite 1.5s' }} />
      
      {/* Header with enhanced styling */}
      <header className="relative z-10 flex justify-end p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Button
          variant="outline"
          className="bg-[#F5F1ED]/10 backdrop-blur-md text-[#F5F1ED] border-[#F5F1ED]/30 px-8 py-3 rounded-full font-light hover:bg-[#F5F1ED]/20 hover:border-[#F5F1ED]/50 transition-all duration-500 hover:scale-105 shadow-lg shadow-[#F5F1ED]/10 hover:shadow-xl hover:shadow-[#F5F1ED]/20"
        >
          Sign in
        </Button>
      </header>
      
      {/* Main content with enhanced animations */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="text-center space-y-8">
          {/* Main heading with fancy effects */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium text-[#F5F1ED] tracking-tight drop-shadow-2xl leading-none font-cormorant-italic">
              <span className="italic">
                Easyware
              </span>
            </h1>
          </div>
          
          {/* Subheading with enhanced styling */}
          <p className="text-[#F5F1ED]/90 text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 leading-relaxed font-crimson-italic italic animate-fade-in" style={{ animationDelay: '0.8s' }}>
            What do you want to build today?
          </p>
          
          {/* Enhanced search input */}
          <div className="relative w-[40rem] max-w-4xl mx-auto group animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <div className="flex items-center bg-[#F5F1ED]/10 backdrop-blur-md border border-[#F5F1ED]/30 rounded-3xl px-[1rem] py-[1rem] focus-within:ring-2 focus-within:ring-[#F5F1ED]/20 focus-within:border-[#F5F1ED]/50 focus-within:shadow-lg focus-within:shadow-[#F5F1ED]/10 transition-all duration-300 hover:shadow-md hover:shadow-[#F5F1ED]/5">
              <textarea
                placeholder="Help me build a bluetooth lock..."
                className="flex-1 bg-transparent text-[#F5F1ED] placeholder:text-[#F5F1ED]/60 placeholder:font-crimson-italic font-light text-base resize-none outline-none border-none focus:ring-0 font-crimson-italic italic"
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
                className="bg-[#F5F1ED] hover:bg-[#F5F1ED]/90 text-[#272727] rounded-full w-[2rem] h-[2rem] flex-shrink-0 ml-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#F5F1ED]/20"
              >
                <Send className="w-[1.5rem] h-[1.5rem]" />
              </Button>
            </div>
            {/* Subtle glow around input */}
            <div className="absolute inset-0 blur-xl bg-[#F5F1ED]/5 rounded-3xl -z-10 group-hover:bg-[#F5F1ED]/8 transition-all duration-300" />
          </div>
        </div>
      </main>
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]/30 pointer-events-none animate-fade-in" style={{ animationDelay: '1.4s' }} />

      {/* Wrench Icon */}
      <img src={WrenchIcon} alt="Wrench Icon" className="absolute bottom-[-4rem] left-[-4rem] w-[20rem] h-[20rem] animate-fade-in opacity-50" style={{ animationDelay: '1.5s' }} />
      <img src={HammerIcon} alt="Hammer Icon" className="absolute bottom-[-4rem] right-[-4rem] w-[20rem] h-[20rem] animate-fade-in opacity-50 -scale-x-100" style={{ animationDelay: '1.5s' }} />
    </div>
  )
}
