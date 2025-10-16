import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { aiService, ChatMessage, FunctionCall } from '@/services/aiService';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import AveoBuddyVideo from '@/assets/AveoBuddy.webm';
import { 
  MessageCircle, 
  X, 
  Send, 
  Leaf,
  ShoppingCart,
  Package,
  HelpCircle,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const quickActions = [
  { icon: ShoppingCart, label: 'Track Order', action: 'track' },
  { icon: Package, label: 'View Cart', action: 'cart' },
  { icon: Leaf, label: 'Eco Products', action: 'eco' },
  { icon: HelpCircle, label: 'Get Help', action: 'help' }
];

const suggestionChips = [
  "What's your most eco-friendly product?",
  "How do I calculate my carbon footprint?",
  "Tell me about your sustainability mission",
  "What are eco badges?",
  "How does the vendor program work?",
  "Show me trending products",
  "What's in my wishlist?",
  "Help me find sustainable office supplies"
];

const EnhancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm AveoBuddy, your sustainable shopping companion 🌱 How can I help you make better choices today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isBackendConnected } = useAuth();

  // Check AI service connection on mount
  useEffect(() => {
    const checkAIConnection = async () => {
      try {
        const isAvailable = await aiService.isAvailable();
        setIsAIConnected(isAvailable);
        setConnectionStatus(isAvailable ? 'connected' : 'disconnected');
      } catch (error) {
        setIsAIConnected(false);
        setConnectionStatus('disconnected');
      }
    };
    checkAIConnection();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message.trim();
    if (!textToSend) return;

    if (!isAIConnected) {
      toast({
        title: 'AI Service Unavailable',
        description: 'The AI assistant is currently offline. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessageWithAuth(textToSend);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        function_calls: response.function_calls
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show success toast for function calls
      if (response.function_calls && response.function_calls.length > 0) {
        toast({
          title: 'Action Completed',
          description: 'I\'ve executed the requested action for you.',
        });
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    const actionMessages = {
      track: "I'd be happy to help you track your order! Please share your order number.",
      cart: "Let me show you what's in your cart.",
      eco: "Here are some eco-friendly products I recommend:",
      help: "I'm here to help! What specific question do you have about our products or services?"
    };

    const message = actionMessages[action as keyof typeof actionMessages] || actionMessages.help;
    await handleSendMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await aiService.clearConversationHistory();
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi! I'm AveoBuddy, your sustainable shopping companion 🌱 How can I help you make better choices today?",
          timestamp: new Date().toISOString()
        }
      ]);
      toast({
        title: 'Chat Cleared',
        description: 'Conversation history has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear conversation history.',
        variant: 'destructive',
      });
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'AI Connected';
      case 'disconnected':
        return 'AI Offline';
      default:
        return 'Checking...';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px]">
      <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <video
                  className="w-10 h-10 rounded-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={AveoBuddyVideo} type="video/webm" />
                </video>
                <div className="absolute -bottom-1 -right-1">
                  {getConnectionStatusIcon()}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">AveoBuddy</h3>
                <p className="text-xs text-green-100">{getConnectionStatusText()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-green-600"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-green-500'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        {msg.function_calls && msg.function_calls.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.function_calls.map((call, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {call.function}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs h-8"
                    disabled={!isAIConnected}
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-1 mb-3">
                {suggestionChips.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-6 px-2 text-gray-600 hover:text-gray-800"
                    disabled={!isAIConnected}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about sustainable products..."
                  className="flex-1 text-sm"
                  disabled={!isAIConnected || isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || !isAIConnected || isLoading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Clear Chat Button */}
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default EnhancedChatBot;
