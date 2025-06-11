import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  MessageCircle,
  UserPlus,
  Heart,
  X,
  Play,
  Pause,
  Music,
  Guitar,
  Piano,
  Drum,
  Mic,
  Globe,
  ArrowLeft,
  Shuffle,
  RotateCcw,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Zap,
  Calendar,
  Share2,
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
  rating?: number;
  collaborations?: number;
  badge?: string;
  bio?: string;
  lookingFor?: string;
}

interface SwipeableCard {
  user: UserProfile;
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
}

const Musicians = () => {
  const { user } = useAuth();
  const { playTrack, pauseTrack, isPlaying, currentTrack } = useMusicPlayer();
  const { toast } = useToast();

  // State for all tabs
  const [activeTab, setActiveTab] = useState("browse");
  const [musicians, setMusicians] = useState<UserProfile[]>([]);
  const [filteredMusicians, setFilteredMusicians] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [instrumentFilter, setInstrumentFilter] = useState("all");

  // Swipe state
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [cardState, setCardState] = useState<SwipeableCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [passedUsers, setPassedUsers] = useState<string[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  useEffect(() => {
    loadMusicians();
    loadUserPreferences();
  }, []);

  useEffect(() => {
    filterMusicians();
  }, [musicians, searchTerm, genreFilter, locationFilter, instrumentFilter]);

  useEffect(() => {
    if (
      filteredMusicians.length > 0 &&
      currentUserIndex < filteredMusicians.length &&
      activeTab === "discover"
    ) {
      initializeSwipeCard();
    }
  }, [filteredMusicians, currentUserIndex, activeTab]);

  const loadMusicians = () => {
    // Get recommendation users and enhance with additional data
    const recommendations = JSON.parse(
      localStorage.getItem("recommendations") || "[]",
    );
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");

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
          rating: 4.0 + Math.random() * 1.0, // Random rating 4.0-5.0
          collaborations: Math.floor(Math.random() * 20) + 5,
          badge:
            Math.random() > 0.7
              ? ["Featured Artist", "Top Collaborator", "Rising Star"][
                  Math.floor(Math.random() * 3)
                ]
              : undefined,
        };
      });

    setMusicians(userProfiles);
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

  const filterMusicians = () => {
    let filtered = musicians.filter((musician) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          musician.fullName.toLowerCase().includes(searchLower) ||
          musician.username.toLowerCase().includes(searchLower) ||
          musician.instrument?.toLowerCase().includes(searchLower) ||
          musician.location?.toLowerCase().includes(searchLower) ||
          musician.genres?.some((genre) =>
            genre.toLowerCase().includes(searchLower),
          );

        if (!matchesSearch) return false;
      }

      // Genre filter
      if (genreFilter !== "all") {
        if (
          !musician.genres?.some((genre) =>
            genre.toLowerCase().includes(genreFilter.toLowerCase()),
          )
        ) {
          return false;
        }
      }

      // Location filter
      if (locationFilter !== "all") {
        if (
          !musician.location
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase())
        ) {
          return false;
        }
      }

      // Instrument filter
      if (instrumentFilter !== "all") {
        if (
          !musician.instrument
            ?.toLowerCase()
            .includes(instrumentFilter.toLowerCase())
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredMusicians(filtered);
  };

  const initializeSwipeCard = () => {
    const currentUser = filteredMusicians[currentUserIndex];
    if (!currentUser) return;

    setCardState({
      user: currentUser,
      currentTrackIndex: 0,
      isPlaying: false,
      isMuted: false,
    });
  };

  const handleLike = () => {
    if (!cardState || !user) return;

    const userId = cardState.user.id;
    const newLiked = [...likedUsers, userId];
    setLikedUsers(newLiked);
    localStorage.setItem(`discover_liked_${user.id}`, JSON.stringify(newLiked));

    // Send connection request
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

    if (nextIndex >= filteredMusicians.length) {
      setCardState(null);
      setIsAnimating(false);
      setSwipeDirection(null);
      return;
    }

    setCurrentUserIndex(nextIndex);
    setIsAnimating(false);
    setSwipeDirection(null);
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

  const sendMessage = (musician: UserProfile) => {
    // Simulate sending a message
    toast({
      title: "Message sent!",
      description: `Your message to ${musician.fullName} has been sent.`,
    });
  };

  const connect = (musician: UserProfile) => {
    if (!user) return;

    // Send connection request
    const connectionRequests = JSON.parse(
      localStorage.getItem(`connection_requests_${musician.id}`) || "[]",
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
      message: `${user.fullName} wants to connect with you!`,
      timestamp: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem(
      `connection_requests_${musician.id}`,
      JSON.stringify(connectionRequests),
    );

    toast({
      title: "Connection request sent!",
      description: `You've sent a connection request to ${musician.fullName}.`,
    });
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

  const resetAndReload = () => {
    setCurrentUserIndex(0);
    setPassedUsers([]);
    setLikedUsers([]);
    if (user) {
      localStorage.removeItem(`discover_liked_${user.id}`);
      localStorage.removeItem(`discover_passed_${user.id}`);
    }
    loadMusicians();
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

  const genres = [
    "Rock",
    "Pop",
    "Jazz",
    "Hip Hop",
    "Electronic",
    "Classical",
    "Country",
    "R&B",
  ];
  const instruments = [
    "Guitar",
    "Piano",
    "Drums",
    "Vocals",
    "Bass",
    "Violin",
    "Saxophone",
  ];
  const locations = [
    "Los Angeles",
    "New York",
    "Nashville",
    "London",
    "Berlin",
    "Tokyo",
  ];

  const featuredMusicians = musicians.filter((m) => m.badge).slice(0, 6);
  const currentUserTrack =
    cardState?.user.tracks?.[cardState.currentTrackIndex];
  const InstrumentIcon = cardState
    ? getInstrumentIcon(cardState.user.instrument)
    : Music;

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
              Find Musicians
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredMusicians.length} musicians found
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Browse & Search</span>
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Discover (Swipe)</span>
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Featured</span>
            </TabsTrigger>
          </TabsList>

          {/* Browse & Search Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Search & Filter Musicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search musicians..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={genreFilter} onValueChange={setGenreFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={instrumentFilter}
                    onValueChange={setInstrumentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Instruments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Instruments</SelectItem>
                      {instruments.map((instrument) => (
                        <SelectItem
                          key={instrument}
                          value={instrument.toLowerCase()}
                        >
                          {instrument}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location.toLowerCase()}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Musicians Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMusicians.map((musician) => {
                const Icon = getInstrumentIcon(musician.instrument);
                return (
                  <Card
                    key={musician.id}
                    className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-16 h-16 border-2 border-purple-500/20">
                          <AvatarImage src={musician.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                            {musician.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {musician.fullName}
                            </h3>
                            {musician.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {musician.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{musician.username}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Icon className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">
                              {musician.instrument}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {musician.location && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{musician.location}</span>
                          </div>
                        )}

                        {musician.rating && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{musician.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              ({musician.collaborations} collaborations)
                            </span>
                          </div>
                        )}

                        {musician.genres && musician.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {musician.genres.slice(0, 3).map((genre, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{musician.tracks?.length || 0} tracks</span>
                          <span>{musician.experience || "Intermediate"}</span>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => connect(musician)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button
                            onClick={() => sendMessage(musician)}
                            variant="outline"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredMusicians.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No musicians found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all musicians.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setGenreFilter("all");
                    setLocationFilter("all");
                    setInstrumentFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Discover (Swipe) Tab */}
          <TabsContent value="discover">
            {cardState ? (
              <div className="max-w-md mx-auto">
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
                        {currentUserTrack?.trackImage ? (
                          <img
                            src={currentUserTrack.trackImage}
                            alt={currentUserTrack.title}
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
                            currentTrack?.id === currentUserTrack?.id ? (
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
                        {currentUserTrack && (
                          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-1">
                              {currentUserTrack.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {Math.floor(currentUserTrack.duration / 60)}
                                    :
                                    {(currentUserTrack.duration % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{currentUserTrack.plays || 0}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{currentUserTrack.likes || 0}</span>
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
                                <p className="text-sm font-medium mb-2">
                                  Genres:
                                </p>
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
                            <span>
                              {cardState.user.tracks?.length || 0} tracks
                            </span>
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
                  <p className="mt-1">
                    Tap the play button to hear their music!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">
                  No more musicians to discover!
                </h3>
                <p className="text-muted-foreground mb-8">
                  You've seen all available musicians. Check back later or
                  explore your connections!
                </p>
                <div className="space-y-4">
                  <Button onClick={resetAndReload} className="w-full max-w-xs">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <Card className="border-yellow-500/20 bg-gradient-to-br from-card to-yellow-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Featured Musicians
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Discover our top musicians, rising stars, and most active
                  collaborators.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMusicians.map((musician) => {
                const Icon = getInstrumentIcon(musician.instrument);
                return (
                  <Card
                    key={musician.id}
                    className="border-yellow-500/20 bg-gradient-to-br from-card to-yellow-950/10 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-2 border-yellow-500/20">
                            <AvatarImage src={musician.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                              {musician.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {musician.fullName}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {musician.badge}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            @{musician.username}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Icon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">
                              {musician.instrument}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{musician.rating?.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span>{musician.collaborations} collabs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Music className="w-4 h-4 text-purple-400" />
                            <span>{musician.tracks?.length || 0} tracks</span>
                          </div>
                        </div>

                        {musician.genres && musician.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {musician.genres.slice(0, 3).map((genre, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => connect(musician)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button
                            onClick={() => sendMessage(musician)}
                            variant="outline"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {featuredMusicians.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">
                  No featured musicians yet
                </h3>
                <p className="text-muted-foreground">
                  Check back later for our featured artists and rising stars!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Musicians;
