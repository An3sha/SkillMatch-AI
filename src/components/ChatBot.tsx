import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatBot: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch("https://api.langbase.com/v1/pipes/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_LANGBASE_PIPE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content }],
          stream: false
        })
      });

      const json = await res.json();
      
      if (json.completion) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: json.completion,
          timestamp: new Date()
        }]);
      } else if (json.error) {
        // Handle specific error cases
        if (json.error.message && json.error.message.includes('Overloaded')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I'm currently experiencing high traffic and may be a bit slow to respond. Please try again in a moment, or you can:\n\n• Ask a simpler question\n• Try again in 30 seconds\n• Check back later when traffic is lower\n\nI apologize for the inconvenience!`,
            timestamp: new Date()
          }]);
        } else {
          throw new Error(json.error.message || "API Error");
        }
      } else {
        throw new Error("No response from Langbase");
      }

    } catch (error) {
      console.error('Langbase fetch error:', error);
      
      // Provide helpful error message based on the error type
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Overloaded')) {
          errorMessage = `I'm currently experiencing high traffic and may be a bit slow to respond. Please try again in a moment, or you can:\n\n• Ask a simpler question\n• Try again in 30 seconds\n• Check back later when traffic is lower\n\nI apologize for the inconvenience!`;
        } else if (error.message.includes('fetch')) {
          errorMessage = 'I\'m having trouble connecting to my services. Please check your internet connection and try again.';
        } else if (error.message.includes('API')) {
          errorMessage = 'There was an issue with my AI service. Please try again in a few moments.';
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const formatMessage = (content: string) => {
    // Check if this is a candidate response (contains ## and candidate info)
    if (content.includes('##') && (content.includes('Salary') || content.includes('Experience') || content.includes('Skills'))) {
      return formatCandidateResponse(content);
    }
    
    // Regular text formatting for other responses
    return formatRegularText(content);
  };

  const formatRegularText = (content: string) => {
    // Split content by markdown headers (##)
    const sections = content.split(/(## \d+\.)/);
    
    return sections.map((section, index) => {
      if (index === 0) {
        // First section (before any ##) - regular text
        return section.trim() ? (
          <p key={index} className="mb-3 leading-relaxed">{section.trim()}</p>
        ) : null;
      } else if (index % 2 === 1) {
        // Header section (## 1., ## 2., etc.)
        const headerText = section.trim();
        return (
          <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2 text-sm">
            {headerText}
          </h4>
        );
      } else {
        // Content section after header
        const lines = section.trim().split('\n');
        return (
          <div key={index} className="mb-3 pl-4 border-l-2 border-[#4c4cc9]/20">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;
              
              // Check for bold text (**text**)
              if (trimmedLine.includes('**')) {
                const parts = trimmedLine.split(/(\*\*.*?\*\*)/);
                return (
                  <p key={lineIndex} className="mb-1 text-sm">
                    {parts.map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <span key={partIndex} className="font-semibold text-gray-900">
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      return <span key={partIndex}>{part}</span>;
                    })}
                  </p>
                );
              }
              
              return (
                <p key={lineIndex} className="mb-1 text-sm text-gray-700">
                  {trimmedLine}
                </p>
              );
            })}
          </div>
        );
      }
    });
  };

  const formatCandidateResponse = (content: string) => {
    // Split content by candidate sections (## 1., ## 2., etc.)
    const sections = content.split(/(## \d+\.)/);
    
    return sections.map((section, index) => {
      if (index === 0) {
        // Introduction text (before any ##)
        return section.trim() ? (
          <div key={index} className="mb-4">
            <p className="text-sm leading-relaxed text-gray-700">{section.trim()}</p>
          </div>
        ) : null;
      } else if (index % 2 === 1) {
        // Header section (## 1., ## 2., etc.)
        const headerText = section.trim();
        return (
          <div key={index} className="mt-6 mb-3">
            <h3 className="text-lg font-bold text-[#4c4cc9] mb-2">
              {headerText}
            </h3>
          </div>
        );
      } else {
        // Candidate card content
        const lines = section.trim().split('\n').filter(line => line.trim());
        if (lines.length === 0) return null;

        // Extract candidate name and location from first line
        const firstLine = lines[0];
        const nameLocationMatch = firstLine.match(/(.*?) - (.*)/);
        const candidateName = nameLocationMatch ? nameLocationMatch[1].trim() : firstLine;
        const candidateLocation = nameLocationMatch ? nameLocationMatch[2].trim() : '';

        // Parse other candidate details
        const candidateDetails: { [key: string]: string } = {};
        lines.slice(1).forEach(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;
          
          // Handle different formats
          let match = trimmedLine.match(/Salary Expectation: (.*)/);
          if (match) {
            candidateDetails['Salary Expectation'] = match[1];
            return;
          }
          
          match = trimmedLine.match(/Experience: (.*)/);
          if (match) {
            candidateDetails['Experience'] = match[1];
            return;
          }
          
          match = trimmedLine.match(/Skills: (.*)/);
          if (match) {
            candidateDetails['Skills'] = match[1];
            return;
          }
          
          match = trimmedLine.match(/Education: (.*)/);
          if (match) {
            candidateDetails['Education'] = match[1];
            return;
          }
          
          match = trimmedLine.match(/Highlights: (.*)/);
          if (match) {
            candidateDetails['Highlights'] = match[1];
            return;
          }
        });

        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
            {/* Candidate Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-base">{candidateName}</h4>
                {candidateLocation && (
                  <p className="text-sm text-gray-600">{candidateLocation}</p>
                )}
              </div>
            </div>

            {/* Candidate Details */}
            <div className="space-y-2">
              {candidateDetails['Salary Expectation'] && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-20">Salary:</span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {candidateDetails['Salary Expectation']}
                  </span>
                </div>
              )}
              
              {candidateDetails['Experience'] && (
                <div className="flex items-start space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-20 mt-0.5">Experience:</span>
                  <span className="text-sm text-gray-700 flex-1">{candidateDetails['Experience']}</span>
                </div>
              )}
              
              {candidateDetails['Skills'] && (
                <div className="flex items-start space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-20 mt-0.5">Skills:</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1">
                      {candidateDetails['Skills'].split(', ').map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="inline-block bg-[#4c4cc9]/10 text-[#4c4cc9] text-xs px-2 py-1 rounded-full border border-[#4c4cc9]/20"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {candidateDetails['Education'] && (
                <div className="flex items-start space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-20 mt-0.5">Education:</span>
                  <span className="text-sm text-gray-700 flex-1">{candidateDetails['Education']}</span>
                </div>
              )}
              
              {candidateDetails['Highlights'] && (
                <div className="flex items-start space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-20 mt-0.5">Highlights:</span>
                  <span className="text-sm text-gray-700 flex-1">{candidateDetails['Highlights']}</span>
                </div>
              )}
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#4c4cc9] shadow-lg hover:bg-[#4c4cc9]/90 transition-colors text-white text-2xl focus:outline-none focus:ring-2 focus:ring-[#4c4cc9]/40"
          aria-label="Open chat bot"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
      {/* Chat Window */}
      {showChat && (
        <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#4c4cc9] text-white rounded-t-2xl">
            <span className="font-semibold text-base">Ask TalentBot</span>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 rounded-full hover:bg-[#4c4cc9]/80 transition-colors"
              aria-label="Close chat bot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Messages Area */}
          <div className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50 text-sm text-gray-700">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-8 h-8 mb-2" />
                <span>How can I help you?</span>
                <span className="text-xs mt-1">Ask me about candidates!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-[#4c4cc9] text-white'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm">
                          {formatMessage(message.content)}
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-[#4c4cc9]/80' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-700 border border-gray-200 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex items-center px-3 py-2 border-t border-gray-100 bg-white">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c4cc9] bg-gray-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-lg bg-[#4c4cc9] text-white hover:bg-[#4c4cc9]/90 transition-colors disabled:opacity-50"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}; 