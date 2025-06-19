import React, { useState, useRef, useEffect } from 'react';
import { Send, Package, XCircle, CheckCircle, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'status' | 'cancellation' | 'error' | 'success';
}

interface OrderStatus {
  status: string;
  eta: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

interface CancellationResult {
  return_id: string;
  instructions: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you with your order status or cancellation requests. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForOrderId, setWaitingForOrderId] = useState(false);
  const [waitingForReason, setWaitingForReason] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [currentIntent, setCurrentIntent] = useState<'status' | 'cancel' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add order ID format validation function
  const isValidOrderId = (id: string) => /^ORD-\d{5}$/.test(id);

  // Mock API functions
  const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate random API errors
    const random = Math.random();
    if (random < 0.05) {
      const error: any = new Error('System error');
      error.code = 500;
      throw error;
    }
    // Mock data for demonstration
    const mockOrders: Record<string, OrderStatus> = {
      'ORD-12345': {
        status: 'shipped',
        eta: '2025-06-21 by 6:00 PM',
        items: [{ name: 'Wireless Headphones', quantity: 1, price: 99.99 }]
      },
      'ORD-67890': {
        status: 'processing',
        eta: '2025-06-22 by 5:00 PM',
        items: [{ name: 'Gaming Mouse', quantity: 1, price: 59.99 }]
      },
      'ORD-11111': {
        status: 'delivered',
        eta: 'Delivered on 2025-06-18',
        items: [{ name: 'Bluetooth Speaker', quantity: 1, price: 79.99 }]
      }
    };
    if (mockOrders[orderId]) {
      return mockOrders[orderId];
    } else {
      const error: any = new Error('Order not found');
      error.code = 404;
      throw error;
    }
  };

  const cancelOrder = async (orderId: string, reason: string): Promise<CancellationResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate random API error
    if (Math.random() < 0.05) {
      const error: any = new Error('Cancellation failed');
      error.code = 500;
      throw error;
    }
    return {
      return_id: `RET-${Math.floor(Math.random() * 100000)}`,
      instructions: 'Your cancellation is confirmed. If the order has shipped, you can refuse delivery or use the prepaid return label that will be emailed to you within 2 hours.'
    };
  };

  const addMessage = (text: string, isUser: boolean, type?: Message['type']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (callback: () => void) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);
    callback();
  };

  const detectIntent = (message: string): 'status' | 'cancel' | null => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('where') && lowerMessage.includes('order') ||
        lowerMessage.includes('status') ||
        lowerMessage.includes('track') ||
        lowerMessage.includes('delivery')) {
      return 'status';
    }
    
    if (lowerMessage.includes('cancel') ||
        lowerMessage.includes('return') ||
        lowerMessage.includes('refund')) {
      return 'cancel';
    }
    
    return null;
  };

  const extractOrderId = (message: string): string | null => {
    const orderIdMatch = message.match(/(?:ORD-)?(\d{5})/i);
    if (orderIdMatch) {
      return `ORD-${orderIdMatch[1]}`;
    }
    return null;
  };

  const formatStatusResponse = (orderStatus: OrderStatus, orderId: string): string => {
    const statusMessages = {
      processing: "Your order is being prepared in our warehouse",
      shipped: "Great news! Your order is on its way",
      delivered: "Your order has been delivered"
    };

    const statusMessage = statusMessages[orderStatus.status as keyof typeof statusMessages] || "Your order status has been updated";
    const itemsText = orderStatus.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
    
    return `${statusMessage}! Order ${orderId} ${orderStatus.status === 'delivered' ? orderStatus.eta : `should arrive by ${orderStatus.eta}`}. This includes: ${itemsText}. Is there anything else I can help you with today?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, true);
    setInputValue('');

    // Handle different conversation states
    if (waitingForOrderId) {
      const orderId = extractOrderId(userMessage) || userMessage.toUpperCase();
      // Validate order ID format before proceeding
      if (!isValidOrderId(orderId)) {
        addMessage("That doesn't look like a valid order number. It should look like 'ORD-12345'. Could you double-check and enter it again?", false, 'error');
        setWaitingForOrderId(true);
        return;
      }
      setCurrentOrderId(orderId);
      setWaitingForOrderId(false);
      
      if (currentIntent === 'status') {
        await simulateTyping(async () => {
          try {
            const orderStatus = await getOrderStatus(orderId);
            addMessage(formatStatusResponse(orderStatus, orderId), false, 'success');
          } catch (error) {
            if ((error as any).code === 404) {
              addMessage("I'm not able to find an order with that number. Could you double-check the order number? It should look like 'ORD-12345'. If you're still having trouble, I can connect you with a specialist.", false, 'error');
              setWaitingForOrderId(true);
            } else if ((error as any).code === 500) {
              addMessage("I'm experiencing a temporary system issue while looking up your order. Let me connect you with a human agent who can assist you right away, or you can try again in a few minutes.", false, 'error');
              setCurrentOrderId('');
              setCurrentIntent(null);
            } else {
              addMessage("Sorry, something went wrong. Please try again.", false, 'error');
              setCurrentOrderId('');
              setCurrentIntent(null);
            }
          }
        });
      } else if (currentIntent === 'cancel') {
        await simulateTyping(async () => {
          try {
            const orderStatus = await getOrderStatus(orderId);
            if (orderStatus.status === 'delivered') {
              addMessage("I see this order has already been delivered. For returns of delivered items, please visit our returns portal or contact our returns department directly.", false, 'error');
            } else {
              addMessage("To process your cancellation, could you let me know the reason? This helps us improve our service.", false);
              setWaitingForReason(true);
            }
          } catch (error) {
            if ((error as any).code === 404) {
              addMessage("I'm not able to find an order with that number. Could you double-check the order number? It should look like 'ORD-12345'. If you're still having trouble, I can connect you with a specialist.", false, 'error');
              setWaitingForOrderId(true);
            } else if ((error as any).code === 500) {
              addMessage("I'm experiencing a temporary system issue while looking up your order. Let me connect you with a human agent who can assist you right away, or you can try again in a few minutes.", false, 'error');
              setCurrentOrderId('');
              setCurrentIntent(null);
            } else {
              addMessage("Sorry, something went wrong. Please try again.", false, 'error');
              setCurrentOrderId('');
              setCurrentIntent(null);
            }
          }
        });
      }
      return;
    }

    if (waitingForReason && currentOrderId) {
      setWaitingForReason(false);
      await simulateTyping(async () => {
        try {
          const result = await cancelOrder(currentOrderId, userMessage);
          addMessage(`Thank you for sharing your reason for cancellation. Your feedback helps us improve our service.\n\nYour cancellation has been processed successfully.\nReturn ID: ${result.return_id}.\n${result.instructions}`,
            false,
            'success');
          setTimeout(() => {
            addMessage("Is there anything else I can help you with today?", false);
          }, 500);
          setCurrentOrderId('');
          setCurrentIntent(null);
        } catch (error) {
          if ((error as any).code === 500) {
            addMessage("I'm having trouble processing your cancellation request right now. To ensure this gets handled quickly, let me transfer you to our cancellation specialist, or you can call our direct cancellation line at 1-800-555-1234.", false, 'error');
          } else {
            addMessage("Sorry, something went wrong. Please try again.", false, 'error');
          }
        }
      });
      return;
    }

    // Detect intent and handle new conversations
    const intent = detectIntent(userMessage);
    const orderId = extractOrderId(userMessage);

    if (intent === 'status') {
      setCurrentIntent('status');
      if (orderId) {
        if (!isValidOrderId(orderId)) {
          await simulateTyping(() => {
            addMessage("That doesn't look like a valid order number. It should look like 'ORD-12345'. Could you double-check and enter it again?", false, 'error');
            setWaitingForOrderId(true);
          });
        } else {
          setCurrentOrderId(orderId);
          await simulateTyping(async () => {
            try {
              const orderStatus = await getOrderStatus(orderId);
              addMessage(formatStatusResponse(orderStatus, orderId), false, 'success');
            } catch (error) {
              if ((error as any).code === 404) {
                addMessage("I'm not able to find an order with that number. Could you double-check the order number? It should look like 'ORD-12345'. If you're still having trouble, I can connect you with a specialist.", false, 'error');
                setWaitingForOrderId(true);
              } else if ((error as any).code === 500) {
                addMessage("I'm experiencing a temporary system issue while looking up your order. Let me connect you with a human agent who can assist you right away, or you can try again in a few minutes.", false, 'error');
                setCurrentOrderId('');
                setCurrentIntent(null);
              } else {
                addMessage("Sorry, something went wrong. Please try again.", false, 'error');
                setCurrentOrderId('');
                setCurrentIntent(null);
              }
            }
          });
        }
      } else {
        await simulateTyping(() => {
          addMessage("I'd be happy to check your order status! Could you please provide your order number? It usually starts with 'ORD-' followed by numbers.", false);
          setWaitingForOrderId(true);
        });
      }
    } else if (intent === 'cancel') {
      setCurrentIntent('cancel');
      if (orderId) {
        if (!isValidOrderId(orderId)) {
          await simulateTyping(() => {
            addMessage("That doesn't look like a valid order number. It should look like 'ORD-12345'. Could you double-check and enter it again?", false, 'error');
            setWaitingForOrderId(true);
          });
        } else {
          setCurrentOrderId(orderId);
          await simulateTyping(async () => {
            try {
              const orderStatus = await getOrderStatus(orderId);
              if (orderStatus.status === 'delivered') {
                addMessage("I see this order has already been delivered. For returns of delivered items, please visit our returns portal or contact our returns department directly.", false, 'error');
              } else {
                addMessage("To process your cancellation, could you let me know the reason? This helps us improve our service.", false);
                setWaitingForReason(true);
              }
            } catch (error) {
              if ((error as any).code === 404) {
                addMessage("I'm not able to find an order with that number. Could you double-check the order number? It should look like 'ORD-12345'. If you're still having trouble, I can connect you with a specialist.", false, 'error');
                setWaitingForOrderId(true);
              } else if ((error as any).code === 500) {
                addMessage("I'm experiencing a temporary system issue while looking up your order. Let me connect you with a human agent who can assist you right away, or you can try again in a few minutes.", false, 'error');
                setCurrentOrderId('');
                setCurrentIntent(null);
              } else {
                addMessage("Sorry, something went wrong. Please try again.", false, 'error');
                setCurrentOrderId('');
                setCurrentIntent(null);
              }
            }
          });
        }
      } else {
        await simulateTyping(() => {
          addMessage("I'd be happy to help you cancel your order. Could you please provide your order number?", false);
          setWaitingForOrderId(true);
        });
      }
    } else {
      await simulateTyping(() => {
        addMessage("I specialize in helping with order status and cancellations. For questions about other topics, I'd recommend reaching out to our support team. However, I'm here if you need help checking on an order or processing a cancellation!", false);
      });
    }
  };

  const getMessageIcon = (type?: Message['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'status':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'cancellation':
        return <Truck className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] w-full max-w-full md:max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Customer Service Assistant</h2>
            <p className="text-blue-100 text-sm">Order Status & Cancellation Support</p>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && getMessageIcon(message.type)}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setInputValue("Where is my order ORD-12345?");
            }}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            Check order status
          </button>
          <button
            onClick={() => {
              setInputValue("I want to cancel my order");
            }}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            Cancel order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 