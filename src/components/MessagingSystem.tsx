import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Send,
  Search,
  Plus,
  Music,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: "text" | "track_share" | "collaboration_request";
  data?: any;
}

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: number;
}

interface User {
  id: string;
  fullName: string;
  username?: string;
  avatar?: string;
  lastActive?: string;
  isOnline?: boolean;
}

const MessagingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and users
  useEffect(() => {
    if (user) {
      loadConversations();
      loadUsers();
    }
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time message listener
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      if (
        user &&
        (message.toUserId === user.id || message.fromUserId === user.id)
      ) {
        // Refresh conversations and messages
        loadConversations();
        if (
          selectedConversation &&
          (message.toUserId === user.id || message.fromUserId === user.id)
        ) {
          loadMessages(selectedConversation.id);
        }
      }
    };

    window.addEventListener("newMessage", handleNewMessage as EventListener);
    return () => {
      window.removeEventListener(
        "newMessage",
        handleNewMessage as EventListener,
      );
    };
  }, [user, selectedConversation]);

  const loadConversations = () => {
    if (!user) return;

    const allConversations = JSON.parse(
      localStorage.getItem(`conversations_${user.id}`) || "[]",
    );
    setConversations(
      allConversations.sort((a: any, b: any) => b.updatedAt - a.updatedAt),
    );
  };

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    setUsers(allUsers.filter((u: User) => u.id !== user?.id));
  };

  const loadMessages = (conversationId: string) => {
    const conversationMessages = JSON.parse(
      localStorage.getItem(`messages_${conversationId}`) || "[]",
    );
    setMessages(conversationMessages);

    // Mark messages as read
    markMessagesAsRead(conversationId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markMessagesAsRead = (conversationId: string) => {
    if (!user) return;

    const conversationMessages = JSON.parse(
      localStorage.getItem(`messages_${conversationId}`) || "[]",
    );

    const updatedMessages = conversationMessages.map((msg: Message) => {
      if (msg.toUserId === user.id && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });

    localStorage.setItem(
      `messages_${conversationId}`,
      JSON.stringify(updatedMessages),
    );

    // Update conversation unread count
    const conversations = JSON.parse(
      localStorage.getItem(`conversations_${user.id}`) || "[]",
    );
    const updatedConversations = conversations.map((conv: Conversation) => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });

    localStorage.setItem(
      `conversations_${user.id}`,
      JSON.stringify(updatedConversations),
    );

    setMessages(updatedMessages);
    setConversations(updatedConversations);
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      fromUserId: user.id,
      toUserId: selectedConversation.participantIds.find(
        (id) => id !== user.id,
      )!,
      content: newMessage.trim(),
      timestamp: Date.now(),
      read: false,
      type: "text",
    };

    // Add message to conversation
    const conversationMessages = JSON.parse(
      localStorage.getItem(`messages_${selectedConversation.id}`) || "[]",
    );
    conversationMessages.push(message);
    localStorage.setItem(
      `messages_${selectedConversation.id}`,
      JSON.stringify(conversationMessages),
    );

    // Update conversation
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: message,
      updatedAt: Date.now(),
    };

    // Update sender's conversations
    const senderConversations = JSON.parse(
      localStorage.getItem(`conversations_${user.id}`) || "[]",
    );
    const senderConvIndex = senderConversations.findIndex(
      (conv: Conversation) => conv.id === selectedConversation.id,
    );
    if (senderConvIndex !== -1) {
      senderConversations[senderConvIndex] = updatedConversation;
    }
    localStorage.setItem(
      `conversations_${user.id}`,
      JSON.stringify(senderConversations),
    );

    // Update receiver's conversations
    const receiverConversations = JSON.parse(
      localStorage.getItem(`conversations_${message.toUserId}`) || "[]",
    );
    const receiverConvIndex = receiverConversations.findIndex(
      (conv: Conversation) => conv.id === selectedConversation.id,
    );
    if (receiverConvIndex !== -1) {
      receiverConversations[receiverConvIndex] = {
        ...updatedConversation,
        unreadCount: receiverConversations[receiverConvIndex].unreadCount + 1,
      };
    }
    localStorage.setItem(
      `conversations_${message.toUserId}`,
      JSON.stringify(receiverConversations),
    );

    // Broadcast real-time event
    const fromUser = {
      id: user.id,
      name: user.fullName,
      avatar: user.avatar,
      username: user.username,
    };

    const event = new CustomEvent("newMessage", {
      detail: { message, fromUser },
    });
    window.dispatchEvent(event);

    setMessages(conversationMessages);
    setNewMessage("");
    loadConversations();
  };

  const startConversation = (targetUser: User) => {
    if (!user) return;

    // Check if conversation already exists
    const existingConv = conversations.find((conv) =>
      conv.participantIds.includes(targetUser.id),
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
      setIsNewChatOpen(false);
      return;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participantIds: [user.id, targetUser.id],
      unreadCount: 0,
      updatedAt: Date.now(),
    };

    // Add to both users' conversations
    const senderConversations = JSON.parse(
      localStorage.getItem(`conversations_${user.id}`) || "[]",
    );
    senderConversations.push(newConversation);
    localStorage.setItem(
      `conversations_${user.id}`,
      JSON.stringify(senderConversations),
    );

    const receiverConversations = JSON.parse(
      localStorage.getItem(`conversations_${targetUser.id}`) || "[]",
    );
    receiverConversations.push(newConversation);
    localStorage.setItem(
      `conversations_${targetUser.id}`,
      JSON.stringify(receiverConversations),
    );

    setSelectedConversation(newConversation);
    setConversations(senderConversations);
    setIsNewChatOpen(false);
  };

  const getOtherUser = (conversation: Conversation): User | null => {
    const otherUserId = conversation.participantIds.find(
      (id) => id !== user?.id,
    );
    return users.find((u) => u.id === otherUserId) || null;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchUsers.toLowerCase()),
  );

  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <MessageCircle className="w-4 h-4 mr-2" />
          Messages
          {totalUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 min-w-5 h-5 text-xs flex items-center justify-center"
            >
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[600px] p-0">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-border flex flex-col">
            <DialogHeader className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <DialogTitle>Messages</DialogTitle>
                <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Start New Conversation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchUsers}
                          onChange={(e) => setSearchUsers(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <ScrollArea className="h-60">
                        <div className="space-y-2">
                          {filteredUsers.map((targetUser) => (
                            <div
                              key={targetUser.id}
                              className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                              onClick={() => startConversation(targetUser)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={targetUser.avatar} />
                                <AvatarFallback>
                                  {targetUser.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {targetUser.fullName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  @{targetUser.username || "user"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  if (!otherUser) return null;

                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-purple-500/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>
                            {otherUser.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {otherUser.fullName}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage?.content ||
                                "Start a conversation"}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="min-w-5 h-5 text-xs flex items-center justify-center"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  {(() => {
                    const otherUser = getOtherUser(selectedConversation);
                    return otherUser ? (
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>
                            {otherUser.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{otherUser.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            @{otherUser.username || "user"}
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.fromUserId === user?.id;
                      const messageUser = isOwnMessage
                        ? user
                        : getOtherUser(selectedConversation);

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? "bg-purple-600 text-white"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-end space-x-1 mt-1 ${
                                isOwnMessage
                                  ? "text-purple-200"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span className="text-xs">
                                {formatTime(message.timestamp)}
                              </span>
                              {isOwnMessage && (
                                <div className="text-purple-200">
                                  {message.read ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingSystem;
