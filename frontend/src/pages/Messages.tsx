import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { Send, Search, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

interface Conversation {
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    email?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
}

export default function Messages() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation['user'] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket
  useEffect(() => {
    if (!user) return;
    // Assuming backend runs on the same host but different port in dev, or same in prod
    // Using '/' defaults to the window location which works with Vite proxy
    const newSocket = io('/', { transports: ['websocket'] });
    
    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
    });

    newSocket.on('receiveMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      // Update last message in conversations list
      setConversations(prev => {
        const updated = [...prev];
        const convoIdx = updated.findIndex(c => 
          c.user.id === message.senderId || c.user.id === message.receiverId
        );
        if (convoIdx >= 0) {
          updated[convoIdx].lastMessage = message.text;
          updated[convoIdx].lastMessageAt = message.createdAt;
          // Move to top
          const [moved] = updated.splice(convoIdx, 1);
          updated.unshift(moved);
        }
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch Conversations
  useEffect(() => {
    if (!token) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setConversations(data.data);
          
          // If a user is passed in URL, set them as active (even if not in conversation list yet)
          if (initialUserId) {
            // Check if they are in the list
            const existing = data.data.find((c: Conversation) => c.user.id === initialUserId);
            if (existing) {
              setActiveChat(existing.user);
            } else {
              // Fetch user details to start a new chat
              const userRes = await fetch(`/api/v1/users/${initialUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const userData = await userRes.json();
              if (userData && userData.data) {
                setActiveChat({
                  id: userData.data._id,
                  fullName: userData.data.fullName,
                  avatarUrl: userData.data.avatarUrl
                });
              } else if (userData) { // fallback based on user response shape
                setActiveChat({
                  id: userData._id || initialUserId,
                  fullName: userData.fullName || 'Unknown User',
                  avatarUrl: userData.avatarUrl
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchConversations();
  }, [token, initialUserId]);

  // Fetch Messages for Active Chat
  useEffect(() => {
    if (!activeChat || !token) return;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/v1/messages/${activeChat.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChat, token]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const textToSend = newMessage.trim();
    setNewMessage(''); // optimistic clear

    try {
      const res = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeChat.id,
          text: textToSend
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error('Network error sending message');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 font-medium mb-6">Please login to view and send messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] max-h-[100vh] pt-16 bg-white overflow-hidden flex flex-col md:flex-row print:hidden">
      
      {/* Sidebar (Conversations) */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col h-full ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversations.length === 0 && !activeChat ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center space-y-3">
               <MessageCircle className="w-12 h-12 text-gray-200" />
               <p className="text-sm font-medium">No messages yet. Hire a worker to start a conversation!</p>
             </div>
          ) : (
            <>
              {/* Optional newly started chat not in list yet */}
              {activeChat && !conversations.some(c => c.user.id === activeChat.id) && (
                <div 
                  onClick={() => setActiveChat(activeChat)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 bg-primary/5`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                    {activeChat.avatarUrl ? (
                      <img src={activeChat.avatarUrl} alt={activeChat.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {activeChat.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{activeChat.fullName}</h4>
                    <p className="text-xs text-primary font-medium">New Conversation</p>
                  </div>
                </div>
              )}
              
              {conversations.map((chat) => (
                <div 
                  key={chat.user.id}
                  onClick={() => setActiveChat(chat.user)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChat?.id === chat.user.id ? 'bg-primary/5' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                    {chat.user.avatarUrl ? (
                      <img src={chat.user.avatarUrl} alt={chat.user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {chat.user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{chat.user.fullName}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                        {new Date(chat.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate font-medium">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#F0F2F5] h-full ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <MessageCircle className="w-16 h-16 text-gray-200" />
            <p className="font-medium text-lg text-gray-500">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[72px] px-4 md:px-6 border-b border-gray-200 bg-white flex items-center gap-4 shadow-sm shrink-0 z-10">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                {activeChat.avatarUrl ? (
                  <img src={activeChat.avatarUrl} alt={activeChat.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                    {activeChat.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{activeChat.fullName}</h3>
                <p className="text-xs text-green-500 font-bold">Online</p>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-white py-3 px-6 rounded-2xl shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
                    Say hello to {activeChat.fullName}! 👋
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        isMe 
                          ? 'bg-primary text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                      }`}>
                        <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                        <div className={`text-[10px] font-bold mt-1 text-right opacity-70 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 bg-white border-t border-gray-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-5xl mx-auto">
                <div className="flex-1 bg-[#F0F2F5] border border-transparent rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white focus-within:border-primary transition-all">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full max-h-32 bg-transparent px-4 py-3.5 text-[15px] focus:outline-none resize-none font-medium text-gray-800"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="shrink-0 p-3.5 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
