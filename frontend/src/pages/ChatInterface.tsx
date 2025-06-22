import React, { useState, FormEvent, useRef, useEffect } from 'react';
import TSCircuitRenderer from '../components/TSCircuitRenderer';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hello! I can help you design a circuit. What would you like to build?', sender: 'bot' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [board, setBoard] = useState<string>('<board width="80mm" height="60mm"></board>');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);


    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;


        setInputValue('');
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark">
            {/* Left side: Chat */}
            <div className="flex-none w-[400px] flex flex-col border-r border-gray-200 dark:border-gray-700">
                <Card className="flex flex-col h-full rounded-none border-0">
                    <CardHeader>
                        <CardTitle>Chat with TSCircuit</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-2">
                        <form onSubmit={handleSendMessage} className="flex flex-col w-full gap-2">
                            <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about a circuit component..."
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </form>
                    </CardFooter>
                </Card>
            </div>

            {/* Right side: TSCircuitRenderer */}
            <div className="flex-1 bg-white h-screen">
                <TSCircuitRenderer board={board} />
            </div>
        </div>
    );
};

export default ChatInterface;
