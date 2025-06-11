import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "like" | "follow" | "message" | "track_upload" | "collaboration";
  title: string;
  message: string;
  fromUser?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  trackId?: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.id) {
      const stored = localStorage.getItem(`notifications_${userData.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.id && notifications.length > 0) {
      localStorage.setItem(
        `notifications_${userData.id}`,
        JSON.stringify(notifications),
      );
    }
  }, [notifications]);

  // Listen for real-time events
  useEffect(() => {
    const handleTrackLiked = (event: CustomEvent) => {
      const { track, likedBy } = event.detail;
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (track.userId === userData.id && likedBy.id !== userData.id) {
        addNotification({
          type: "like",
          title: "Track Liked! ❤️",
          message: `${likedBy.name} liked your track "${track.title}"`,
          fromUser: likedBy,
          trackId: track.id,
          read: false,
        });
      }
    };

    const handleNewFollower = (event: CustomEvent) => {
      const { follower, followedUser } = event.detail;
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (followedUser.id === userData.id) {
        addNotification({
          type: "follow",
          title: "New Follower! 👥",
          message: `${follower.name} started following you`,
          fromUser: follower,
          read: false,
        });
      }
    };

    const handleNewMessage = (event: CustomEvent) => {
      const { message, fromUser } = event.detail;
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (message.toUserId === userData.id) {
        addNotification({
          type: "message",
          title: "New Message 💬",
          message: `${fromUser.name}: ${message.content.substring(0, 50)}${
            message.content.length > 50 ? "..." : ""
          }`,
          fromUser: fromUser,
          read: false,
          data: { messageId: message.id },
        });
      }
    };

    const handleTrackUpload = (event: CustomEvent) => {
      const { track, user } = event.detail;
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      // Notify followers when someone they follow uploads a track
      const followers = JSON.parse(
        localStorage.getItem(`followers_${user.id}`) || "[]",
      );

      if (followers.includes(userData.id)) {
        addNotification({
          type: "track_upload",
          title: "New Track! 🎵",
          message: `${user.name} uploaded "${track.title}"`,
          fromUser: user,
          trackId: track.id,
          read: false,
        });
      }
    };

    // Add event listeners
    window.addEventListener("trackLiked", handleTrackLiked as EventListener);
    window.addEventListener("newFollower", handleNewFollower as EventListener);
    window.addEventListener("newMessage", handleNewMessage as EventListener);
    window.addEventListener(
      "trackUploaded",
      handleTrackUpload as EventListener,
    );

    return () => {
      window.removeEventListener(
        "trackLiked",
        handleTrackLiked as EventListener,
      );
      window.removeEventListener(
        "newFollower",
        handleNewFollower as EventListener,
      );
      window.removeEventListener(
        "newMessage",
        handleNewMessage as EventListener,
      );
      window.removeEventListener(
        "trackUploaded",
        handleTrackUpload as EventListener,
      );
    };
  }, []);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      // Keep only last 50 notifications
      const updated = [newNotification, ...prev].slice(0, 50);
      return updated;
    });

    // Show toast for important notifications
    if (["like", "follow", "message"].includes(notification.type)) {
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
