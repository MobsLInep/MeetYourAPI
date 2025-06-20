'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Image as ImageIcon, X, Code2, Sparkles, Bot, User } from 'lucide-react';
import { uploadImage } from '@/lib/imagekit';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
}

interface ChatInterfaceProps {
  chatId?: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load previous chat if chatId is provided
  useEffect(() => {
    const loadChat = async () => {
      if (chatId) {
        try {
          const response = await fetch(`/api/chats/${chatId}`);
          if (response.ok) {
            const chat = await response.json();
            setMessages(chat.messages);
            setCurrentChatId(chatId);
          }
        } catch (error) {
          console.error('Error loading chat:', error);
        }
      } else {
        setMessages([]);
        setCurrentChatId(undefined);
      }
    };

    loadChat();
  }, [chatId]);

  // Listen for new chat event
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([]);
      setCurrentChatId(undefined);
      setInput('');
      setSelectedImage(null);
      setPreviewUrl(null);
    };

    window.addEventListener('newChat', handleNewChat);
    return () => window.removeEventListener('newChat', handleNewChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage = input.trim();
    setInput('');
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsLoading(true);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const newUserMessage: Message = {
      id: userMessageId,
      content: userMessage || '',
      role: 'user',
      imageUrl: previewUrl,
    };

    const loadingMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
    };

    setMessages(prev => [...prev, newUserMessage, loadingMessage]);

    try {
      let imageUrl: string | undefined;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        newUserMessage.imageUrl = imageUrl;
        setMessages(prev => prev.map(msg => 
          msg.id === userMessageId ? { ...msg, imageUrl } : msg
        ));
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage || 'Image query',
          imageUrl,
          messages: messages.filter(msg => msg.id !== assistantMessageId),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          assistantMessage += chunk;
          
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: assistantMessage }
              : msg
          ));
        }
      }

      const updatedMessages = [
        ...messages.filter(msg => msg.id !== assistantMessageId),
        newUserMessage,
        {
          id: assistantMessageId,
          content: assistantMessage,
          role: 'assistant',
        }
      ];

      if (!currentChatId) {
        const response = await fetch('/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: userMessage ? userMessage.slice(0, 30) + '...' : 'Image query',
            messages: updatedMessages,
          }),
        });

        if (response.ok) {
          const savedChat = await response.json();
          setCurrentChatId(savedChat._id);
          window.history.pushState({}, '', `/dashboard?chat=${savedChat._id}`);
        }
      } else {
        await fetch(`/api/chats/${currentChatId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        });
      }

      window.dispatchEvent(new Event('chatUpdated'));

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-6 border-b border-white/10 bg-black/80 backdrop-blur-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Code2 className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              MeetYourAPI
            </h1>
            <p className="text-xs text-gray-400 font-mono">Specialized API Support Assistant</p>
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/50 border border-white/10"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400 font-mono">Online</span>
        </motion.div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Welcome to MeetYourAPI
              </h2>
              <p className="text-gray-400 font-mono max-w-md">
                I'm your AI assistant specialized in API documentation, endpoints, authentication, and troubleshooting. 
                How can I help you today?
              </p>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {message.role === 'assistant' && (
                <div className="mr-3 w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500 border-2 border-white">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <motion.div
                className={`max-w-[80%] rounded-2xl p-4 overflow-hidden ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                    : 'bg-gray-900/70 border border-white/10 text-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {/* Message content */}
                {message.imageUrl && (
                  <motion.div 
                    className="mb-3 overflow-hidden rounded-lg border border-white/10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img
                      src={message.imageUrl}
                      alt="Uploaded"
                      className="max-w-full h-auto"
                    />
                  </motion.div>
                )}

                {message.role === 'assistant' ? (
                  <div className="chatgpt-markdown max-w-none">
                    <ReactMarkdown
                      components={{
                        code: ({ children, className }) => (
                          <motion.code 
                            className={`${className} bg-black/50 px-2 py-1 rounded text-cyan-400 font-mono text-sm border border-white/10`}
                            whileHover={{ scale: 1.02 }}
                          >
                            {children}
                          </motion.code>
                        ),
                        pre: ({ children }) => (
                          <motion.pre 
                            className="bg-black/50 border border-white/10 p-4 rounded-lg overflow-x-auto"
                            whileHover={{ scale: 1.01 }}
                          >
                            {children}
                          </motion.pre>
                        ),
                        a: ({ children, href }) => (
                          <a 
                            href={href} 
                            className="text-cyan-400 hover:text-purple-400 underline underline-offset-4"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        )
                      }}
                    >
                      {message.content || (isLoading && message.id.includes('assistant') ? 'Thinking...' : '')}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <motion.p 
                    className="font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {message.content}
                  </motion.p>
                )}

                {/* Timestamp */}
                <div className={`text-xs mt-2 text-right ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
              {message.role === 'user' && (
                <div className="ml-3 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 border-2 border-white">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="p-6 border-t border-white/10 bg-black/80 backdrop-blur-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <motion.textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about APIs, endpoints, authentication..."
              className="w-full p-4 pr-12 bg-gray-900/50 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-gray-400 font-mono backdrop-blur-sm"
              rows={1}
              disabled={isLoading}
            />
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-colors"
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ImageIcon size={20} />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <motion.button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {isLoading ? (
                <motion.div 
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Send size={20} />
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </div>

        {previewUrl && (
          <motion.div 
            className="mt-3 relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-32 rounded-lg border border-white/10"
            />
            <motion.button
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
}