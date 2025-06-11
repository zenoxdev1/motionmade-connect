import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  X,
  Play,
  Pause,
  Music,
  MapPin,
  Star,
  User,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeft,
  Guitar,
  Mic,
  Piano,
  Drum,
  Headphones,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  instrument?: string;
  location?: string;
  genres?: string[];
  experience?: string;
  tracks?: any[];
}

interface SwipeableCard {
  user: UserProfile;
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
}

const Discover = () => {
  const { user } = useAuth();
  const { playTrack, pauseTrack, isPlaying, currentTrack } = useMusicPlayer();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [cardState, setCardState] = useState<SwipeableCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [passedUsers, setPassedUsers] = useState<string[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  useEffect(() => {
    loadUsers();
    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (users.length > 0 && currentUserIndex < users.length) {
      initializeCard();
    }
  }, [users, currentUserIndex]);

  const loadUsers = () => {
    // Get recommendation users from the system
    const recommendations = JSON.parse(
      localStorage.getItem("recommendations") || "[]",
    );
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");

    // Create user profiles with their tracks
    const userProfiles: UserProfile[] = recommendations
      .filter((rec: any) => rec.id !== user?.id)
      .map((rec: any) => {
        const userTracks = allTracks.filter(
          (track: any) =>
            track.userId === rec.id || track.artist === rec.fullName,
        );

        return {
          ...rec,
          tracks: userTracks,
        };
      })
      .filter(
        (profile: UserProfile) => profile.tracks && profile.tracks.length > 0,
      );

    setUsers(userProfiles);
    setIsLoading(false);
  };

  const loadUserPreferences = () => {
    if (!user) return;

    const liked = JSON.parse(
      localStorage.getItem(`discover_liked_${user.id}`) || "[]",
    );
    const passed = JSON.parse(
      localStorage.getItem(`discover_passed_${user.id}`) || "[]",
    );

    setLikedUsers(liked);
    setPassedUsers(passed);
  };

  const initializeCard = () => {
    const currentUser = users[currentUserIndex];
    if (!currentUser) return;

    setCardState({
      user: currentUser,
      currentTrackIndex: 0,
      isPlaying: false,
      isMuted: false,
    });
  };

  const playCurrentTrack = async () => {
    if (!cardState || !cardState.user.tracks) return;

    const track = cardState.user.tracks[cardState.currentTrackIndex];
    if (!track) return;

    try {
      if (isPlaying && currentTrack?.id === track.id) {
        pauseTrack();
        setCardState((prev) => (prev ? { ...prev, isPlaying: false } : null));
      } else {
        await playTrack(track, cardState.user.tracks, true);
        setCardState((prev) => (prev ? { ...prev, isPlaying: true } : null));
      }
    } catch (error) {
      toast({
        title: "Playback failed",
        description: "Unable to play this track.",
        variant: "destructive",
      });
    }
  };

  const nextTrack = () => {
    if (!cardState || !cardState.user.tracks) return;

    const nextIndex =
      (cardState.currentTrackIndex + 1) % cardState.user.tracks.length;
    setCardState((prev) =>
      prev ? { ...prev, currentTrackIndex: nextIndex, isPlaying: false } : null,
    );
  };

  const handleLike = () => {
    if (!cardState || !user) return;

    const userId = cardState.user.id;
    const newLiked = [...likedUsers, userId];
    setLikedUsers(newLiked);
    localStorage.setItem(`discover_liked_${user.id}`, JSON.stringify(newLiked));

    // Simulate sending a connection request
    const connectionRequests = JSON.parse(
      localStorage.getItem(`connection_requests_${userId}`) || "[]",
    );
    connectionRequests.push({
      id: Date.now().toString(),
      fromUserId: user.id,
      fromUser: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
      },
      message: `${user.fullName} likes your music and wants to connect!`,
      timestamp: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem(
      `connection_requests_${userId}`,
      JSON.stringify(connectionRequests),
    );

    animateSwipe("right");

    toast({
      title: "Connection sent! ❤️",
      description: `You liked ${cardState.user.fullName}'s music!`,
    });
  };

  const handlePass = () => {
    if (!cardState || !user) return;

    const userId = cardState.user.id;
    const newPassed = [...passedUsers, userId];
    setPassedUsers(newPassed);
    localStorage.setItem(
      `discover_passed_${user.id}`,
      JSON.stringify(newPassed),
    );

    animateSwipe("left");
  };

  const animateSwipe = (direction: "left" | "right") => {
    setIsAnimating(true);
    setSwipeDirection(direction);

    setTimeout(() => {
      goToNextUser();
    }, 300);
  };

  const goToNextUser = () => {
    const nextIndex = currentUserIndex + 1;

    if (nextIndex >= users.length) {
      // No more users
      setCardState(null);
      setIsAnimating(false);
      setSwipeDirection(null);
      return;
    }

    setCurrentUserIndex(nextIndex);
    setIsAnimating(false);
    setSwipeDirection(null);
  };

  const resetAndReload = () => {
    setCurrentUserIndex(0);
    setPassedUsers([]);
    setLikedUsers([]);
    if (user) {
      localStorage.removeItem(`discover_liked_${user.id}`);
      localStorage.removeItem(`discover_passed_${user.id}`);
    }
    loadUsers();
  };

  // Touch/Mouse handlers for swipe gestures
  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    currentX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !cardRef.current) return;

    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    const rotation = deltaX * 0.1;

    cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    cardRef.current.style.opacity = `${1 - Math.abs(deltaX) / 300}`;
  };

  const handleEnd = () => {
    if (!isDragging.current || !cardRef.current) return;

    isDragging.current = false;
    const deltaX = currentX.current - startX.current;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleLike();
      } else {
        handlePass();
      }
    } else {
      // Snap back
      cardRef.current.style.transform = "translateX(0px) rotate(0deg)";
      cardRef.current.style.opacity = "1";
    }
  };

  const getInstrumentIcon = (instrument?: string) => {
    switch (instrument?.toLowerCase()) {
      case "guitar":
      case "bass":
        return Guitar;
      case "piano":
      case "keyboard":
        return Piano;
      case "drums":
        return Drum;
      case "vocals":
        return Mic;
      default:
        return Music;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Finding amazing musicians...</p>
        </div>
      </div>
    );
  }

  if (!cardState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
        {/* Header */}
        <nav className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Discover Music
              </h1>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              No more musicians to discover!
            </h2>
            <p className="text-muted-foreground mb-8">
              You've seen all the amazing musicians in your area. Check back
              later for new talent or explore your connections!
            </p>
            <div className="space-y-4">
              <Button onClick={resetAndReload} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/find-musicians">
                  <User className="w-4 h-4 mr-2" />
                  View All Musicians
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTrack = cardState.user.tracks?.[cardState.currentTrackIndex];
  const InstrumentIcon = getInstrumentIcon(cardState.user.instrument);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Discover Music
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentUserIndex + 1} of {users.length}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Main Card */}
          <div className="relative">
            <Card
              ref={cardRef}
              className={`border-2 border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 cursor-grab active:cursor-grabbing transition-all duration-300 ${
                isAnimating
                  ? swipeDirection === "right"
                    ? "animate-pulse border-green-500/50"
                    : "animate-pulse border-red-500/50"
                  : ""
              }`}
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
            >
              <CardContent className="p-0">
                {/* Track Cover Image */}
                <div className="relative h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-t-lg overflow-hidden">
                  {currentTrack?.trackImage ? (
                    <img
                      src={currentTrack.trackImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-24 h-24 text-purple-400" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button
                      onClick={playCurrentTrack}
                      size="lg"
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50"
                    >
                      {cardState.isPlaying &&
                      currentTrack?.id === currentTrack?.id ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Track Navigation */}
                  {cardState.user.tracks &&
                    cardState.user.tracks.length > 1 && (
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={nextTrack}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                        >
                          <Music className="w-4 h-4 mr-2" />
                          {cardState.currentTrackIndex + 1}/
                          {cardState.user.tracks.length}
                        </Button>
                      </div>
                    )}
                </div>

                {/* User Info */}
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16 border-2 border-purple-500/20">
                      <AvatarImage src={cardState.user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                        {cardState.user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold truncate">
                        {cardState.user.fullName}
                      </h2>
                      <p className="text-muted-foreground">
                        @{cardState.user.username}
                      </p>
                      {cardState.user.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {cardState.user.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Track Info */}
                  {currentTrack && (
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-1">
                        {currentTrack.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {Math.floor(currentTrack.duration / 60)}:
                              {(currentTrack.duration % 60)
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{currentTrack.plays || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{currentTrack.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Details */}
                  <div className="space-y-3">
                    {cardState.user.instrument && (
                      <div className="flex items-center space-x-2">
                        <InstrumentIcon className="w-5 h-5 text-purple-400" />
                        <span className="font-medium">
                          {cardState.user.instrument}
                        </span>
                      </div>
                    )}

                    {cardState.user.experience && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span>{cardState.user.experience}</span>
                      </div>
                    )}

                    {cardState.user.genres &&
                      cardState.user.genres.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Genres:</p>
                          <div className="flex flex-wrap gap-1">
                            {cardState.user.genres.map((genre, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{cardState.user.tracks?.length || 0} tracks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Swipe Indicators */}
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <ThumbsDown className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-8 mt-8">
            <Button
              onClick={handlePass}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <X className="w-8 h-8 text-red-500" />
            </Button>
            <Button
              onClick={handleLike}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Heart className="w-8 h-8 text-white" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Swipe left to pass • Swipe right to like</p>
            <p className="mt-1">Tap the play button to hear their music!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
