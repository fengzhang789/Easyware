"use client"

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden justify-center items-center">
      <div className="bg-[#1A1A1A] min-h-screen relative overflow-hidden flex flex-col">
        <div className="flex justify-end p-[1rem] animate-fade-in-up-instant">
          <Button
            variant="outline"
            className="bg-[#ffffff] text-[#000000] border-[#d9d9d9] px-[1rem] py-[0.5rem] rounded-full font-crimson hover:bg-[#d9d9d9]"
          >
            sign in
          </Button>
        </div>

        <div className="flex-1 flex flex-col px-[1rem] justify-center items-center">
          <div className="text-center z-10">
            <h1 className="text-[#ffffff] !text-[4.5rem] md:!text-[4.5rem] font-cormorant-garamond-italic animate-fade-in-up italic mb-2">
              Easyware
            </h1>
            <h1 className="text-[#ffffff] !text-[2rem] md:!text-[2rem] font-crimson-italic animate-fade-in-up">
              What do you want to build today?
            </h1>
            <div className="relative w-full max-w-xl mx-auto animate-fade-in-scale animate-delay-500">
              <div className="flex items-center justify-between bg-[#272727] border-[#ffffff] border-2 rounded-[8px] pr-3 focus-within:ring-0">
                <div className="flex-1 textarea-center-content w-[40rem]">
                  <textarea
                    placeholder="help me build a bluetooth doorknob..."
                    className="bg-[#272727] text-[#ffffff] placeholder:text-[#d9d9d9] font-crimson-italic text-[18px]"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      const newHeight = Math.min(target.scrollHeight, 10 * 16);
                      target.style.height = newHeight + 'px';
                    }}
                  />
                </div>
                <Button
                  size="icon"
                  className="bg-[#ffffff] hover:bg-[#d9d9d9] rounded-full w-6 h-6 flex-shrink-0 !mx-[0.5rem] !shadow-none !outline-none !border-none focus:ring-0 focus:outline-none focus:border-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none p-[0.3rem]"
                >
                  <Send className="w-[1rem] h-[1rem] text-[#000000]" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements - larger and cut off by corners */}
        <div className="absolute -bottom-[5rem] -left-[5rem] opacity-20 animate-fade-in-left animate-delay-1000">
          <img src="/images/hammer-icon.png" alt="Hammer tool illustration" className="w-[20rem] h-[20rem] object-contain opacity-[0.5]" />
        </div>

        <div className="absolute -bottom-[5rem] -right-[5rem] opacity-20 animate-fade-in-right animate-delay-1000">
          <img
            src="/images/wrench-icon.png"
            alt="Wrench tool illustration"
            className="w-[20rem] h-[20rem] object-contain transform scale-x-[-1] opacity-[0.5]"
          />
        </div>
      </div>
    </div>
  )
}
