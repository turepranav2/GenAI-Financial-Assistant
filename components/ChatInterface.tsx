'use client';

import { useState, useRef, useEffect } from 'react';
import SendIcon from './SendIcon';
import { FiTrash2, FiDollarSign, FiPieChart, FiTrendingUp, FiCreditCard } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const newAssistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <FiDollarSign className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Financial Genius</h1>
            <p className="text-sm text-gray-500">AI-powered financial intelligence</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors flex items-center space-x-2 hover:bg-red-50 rounded-lg border border-red-100"
        >
          <FiTrash2 className="h-4 w-4" />
          <span>Clear Chat</span>
        </button>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6 animate-fade-in">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center shadow-inner">
                  <FiTrendingUp className="h-10 w-10 text-indigo-500" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Your Financial Companion
                </h2>
                <p className="text-gray-500 max-w-md text-lg">
                  Ask me anything about personal finance, investments, or wealth management. I'm here to help you make smarter money decisions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                <button 
                  onClick={() => handleQuickQuestion("How can I start investing with $1000?")}
                  className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-300"
                >
                  <FiTrendingUp className="text-blue-500" />
                  <span>Investing Basics</span>
                </button>
                <button 
                  onClick={() => handleQuickQuestion("What's the best way to save for retirement?")}
                  className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                >
                  <FiPieChart className="text-purple-500" />
                  <span>Retirement</span>
                </button>
                <button 
                  onClick={() => handleQuickQuestion("How can I improve my credit score?")}
                  className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-green-300"
                >
                  <FiCreditCard className="text-green-500" />
                  <span>Credit Score</span>
                </button>
                <button 
                  onClick={() => handleQuickQuestion("What are some tax saving strategies?")}
                  className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-orange-300"
                >
                  <FiDollarSign className="text-orange-500" />
                  <span>Tax Tips</span>
                </button>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={message.timestamp}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-white/90 text-gray-800 border border-gray-100'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl p-4 border border-gray-100 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white/90 backdrop-blur-lg p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, savings, taxes..."
              className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center mt-3 space-x-4">
            <button 
              type="button" 
              onClick={() => handleQuickQuestion("Best way to save for a house?")}
              className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
            >
              Saving for home
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickQuestion("How to pay off debt faster?")}
              className="text-xs text-purple-500 hover:text-purple-600 transition-colors"
            >
              Debt payoff
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickQuestion("What are index funds?")}
              className="text-xs text-green-500 hover:text-green-600 transition-colors"
            >
              Index funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}