import React, { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { searchDocs, generateResponse, isValidQuestion } from './utils/search';
import type { Message } from './types/chat';

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content: 'Hello! I\'m your CDP support assistant. I can help you with questions about Segment, mParticle, Lytics, and Zeotap. What would you like to know?',
    timestamp: new Date()
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!isValidQuestion(content)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Please keep your question between 1 and 500 characters.',
        timestamp: new Date()
      }]);
      return;
    }

    setIsProcessing(true);
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);

    try {
      // Search documentation and generate response
      const results = await searchDocs(content);
      const response = generateResponse(content, results);

      // Add bot response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">CDP Support Assistant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm min-h-[calc(100vh-8rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isProcessing} />
        </div>
      </main>
    </div>
  );
}

export default App;