import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <header className="border-b border-zinc-800 p-4">
        <h1 className="text-white font-semibold text-xl">
          Hardware <span className="text-white">Chat</span>
        </h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </main>
  )
}
