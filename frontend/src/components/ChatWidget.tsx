'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
}

const formatMessage = (text: string) => {
    // Replace newlines with <br> tags
    const withLineBreaks = text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
            {line}
            {i !== text.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));

    return withLineBreaks;
};

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }

        // Add welcome message when chat is first opened
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    type: 'bot',
                    text: "Welcome to CrownKing! I'm your personal shopping assistant. How can I help you today? You can ask me about our jewelry collections, pricing, or any other information about our products."
                }
            ]);
        }

        // Hide tooltip when chat is opened
        if (isOpen) {
            setShowTooltip(false);
        }
    }, [isOpen, messages.length]);

    // Hide tooltip after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowTooltip(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add user message
        const userMessage: ChatMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);

        // Clear input
        setInput('');

        // Set loading state
        setIsLoading(true);

        try {
            // Call the API
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chatbot');
            }

            const data = await response.json();

            // Add bot message
            const botMessage: ChatMessage = {
                type: 'bot',
                text: data.answer
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            setMessages(prev => [
                ...prev,
                {
                    type: 'bot',
                    text: 'Sorry, I encountered an error. Please try again later.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle pressing Enter to submit
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                handleSubmit(e as unknown as React.FormEvent);
            }
        }
    };

    return (
        <>
            {/* Chat button */}
            <div className="fixed bottom-8 right-14 z-50">
                {/* Professional chat button with integrated tooltip */}
                <div className="relative group">
                    {showTooltip && (
                        <div className="absolute bottom-[72px] right-0 transform -translate-x-1/4 bg-white text-brand-primary font-medium py-2 px-4 rounded-lg shadow-lg border border-gray-200 text-sm whitespace-nowrap">
                            <div className="absolute bottom-[-8px] right-[18px] transform rotate-45 w-4 h-4 bg-white border-r border-b border-gray-200"></div>
                            Chat with our assistant
                        </div>
                    )}
                    <button
                        onClick={toggleChat}
                        className="bg-brand-primary p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                        aria-label="Chat with us"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => !isOpen && setShowTooltip(false)}
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-8 w-8 text-white" />
                        ) : (
                            <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Chat popup */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[350px] sm:w-[380px] bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[70vh] border border-gray-200 overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="bg-brand-primary text-white p-4 flex items-center">
                        <SparklesIcon className="h-6 w-6 mr-2" />
                        <h3 className="font-semibold text-lg">CrownKing Assistant</h3>
                        <button
                            onClick={toggleChat}
                            className="ml-auto p-2 hover:bg-brand-blue-light rounded-full transition-colors"
                            aria-label="Close chat"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-brand-cream-light min-h-[350px] max-h-[450px]">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center p-4">
                                <SparklesIcon className="h-10 w-10 mb-4 text-brand-primary" />
                                <p className="mb-2 font-medium text-base">Hello! I'm your personal shopping assistant.</p>
                                <p className="text-sm">Ask me about our products, pricing, or anything else about CrownKing.</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
                                    >
                                        <div
                                            className={`inline-block p-3 rounded-lg ${message.type === 'user'
                                                ? 'bg-brand-primary text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {formatMessage(message.text)}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="text-left mb-4">
                                        <div className="inline-block p-3 rounded-lg bg-white text-gray-400 border border-gray-200 rounded-tl-none">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input area */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-brand-primary text-white p-3 rounded-r-lg hover:bg-brand-blue-light transition-colors"
                                disabled={isLoading || !input.trim()}
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

// Add this to your CSS to enable animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
    }
    `;
    document.head.appendChild(style);
}

export default ChatWidget; 