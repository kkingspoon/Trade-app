
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Bot, ChatMessage } from '../types';
import { XMarkIcon, CpuChipIcon } from './Icons';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
  conversation: ChatMessage[];
  loading: boolean;
  onSendMessage: (query: string) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({ isOpen, onClose, bot, conversation, loading, onSendMessage }) => {
  const [query, setQuery] = useState('');
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSendMessage(query);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-cyan-500/20 w-full max-w-2xl m-4 transform transition-all duration-300 scale-100 flex flex-col h-[80vh] max-h-[700px]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold font-space-grotesk text-white flex items-center">
            <CpuChipIcon className="h-6 w-6 mr-3 text-cyan-400" />
            AI Agent: {bot?.name}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 flex-grow overflow-y-auto">
          {conversation.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center flex-shrink-0"><CpuChipIcon className="h-5 w-5 text-cyan-400"/></div>}
              <div className={`max-w-md p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700/50 text-gray-200 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center flex-shrink-0"><CpuChipIcon className="h-5 w-5 text-cyan-400"/></div>
               <div className="max-w-md p-3 rounded-lg bg-gray-700/50 text-gray-200 rounded-bl-none flex items-center">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce mr-2"></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150 mr-2"></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
               </div>
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-xl flex items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your AI agent..."
            disabled={loading}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
