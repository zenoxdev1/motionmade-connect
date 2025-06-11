import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  ArrowLeft,
  Users,
  UserPlus,
  MessageCircle,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Headphones,
  Guitar,
  Piano,
  Drum,
  Mic,
  RotateCcw,
  Zap,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getRecommendedUsers,
  sendConnectionRequest,
  initializeRealUsers,
  type RecommendedUser,
} from "@/utils/recommendationSystem";
import MessagingSystem from "@/components/MessagingSystem";

const trackTypeIcons = {
  "full-track": Music,
  loops: RotateCcw,
  starters: Zap,
  beats: Activity,
  "one-shots": Zap,
  drums: Drum,
  vocals: Mic,
};

const Discover = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<any[]>([]);
  const [recentlyActive, setRecentlyActive] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionRequests, setConnectionRequests] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  const initializeData = async () => {
    setLoading(true);

    try {
      // Initialize real users
      initializeRealUsers();

      // Get recommendations
      if (user) {
        const recs = getRecommendedUsers(user.id);
        setRecommendations(recs);

        // Load existing connection requests
        const requests = JSON.parse(
          localStorage.getItem(`connection_requests_${user.id}`) || "[]",
        );
        setConnectionRequests(requests);
      }

      // Get trending tracks
      const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
      const trending = allTracks
        .sort((a: any, b: any) => (b.plays || 0) - (a.plays || 0))
        .slice(0, 10);
      setTrendingTracks(trending);

      // Get recently active users
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const active = allUsers
        .filter((u: any) => u.id !== user?.id && u.lastActive)
        .sort(
          (a: any, b: any) =>
            new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(),
        )
        .slice(0, 8);
      setRecentlyActive(active);
    } catch (error) {
      console.error("Error initializing discover page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (targetUserId: string) => {
    if (!user) return;

    if (connectionRequests.includes(targetUserId)) {
      toast({
        title: "Already sent",
        description: "You've already sent a connection request to this user.",
      });
      return;
    }

    const success = sendConnectionRequest(user.id, targetUserId);

    if (success) {
      // Add to local state
      const updatedRequests = [...connectionRequests, targetUserId];
      setConnectionRequests(updatedRequests);

      // Save to localStorage
      localStorage.setItem(
        `connection_requests_${user.id}`,
        JSON.stringify(updatedRequests),
      );

      toast({
        title: "Connection request sent! 🤝",
        description: "You'll be notified when they respond.",
      });
    } else {
      toast({
        title: "Failed to send request",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / (24 * 7))}w ago`;
  };

  const getTrackTypeIcon = (trackType: string) => {
    const IconComponent =
      trackTypeIcons[trackType as keyof typeof trackTypeIcons] || Music;
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Motion Connect
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MessagingSystem />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">
              Connect with talented musicians and discover amazing music
            </p>
          </div>

          <Tabs defaultValue="recommendations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">
                <Users className="w-4 h-4 mr-2" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="active">
                <Clock className="w-4 h-4 mr-2" />
                Recently Active
              </TabsTrigger>
            </TabsList>

            {/* Recommended Users */}
            <TabsContent value="recommendations">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recommended for You</h2>
                  <Badge variant="outline" className="text-purple-400">
                    {recommendations.length} matches
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <Card
                      key={rec.user.id}
                      className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300"
                    >
                      <CardHeader className="text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-purple-500/20">
                          <AvatarImage src={rec.user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                            {rec.user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {rec.user.fullName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          @{rec.user.username || "user"}
                        </p>
                        {rec.user.instrument && (
                          <Badge variant="secondary" className="mx-auto">
                            {rec.user.instrument}
                          </Badge>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {rec.user.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rec.user.bio}
                          </p>
                        )}

                        {rec.user.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {rec.user.location}
                          </div>
                        )}

                        {rec.user.lastActive && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            Active {formatTimeAgo(rec.user.lastActive)}
                          </div>
                        )}

                        {/* Recommendation reasons */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-purple-400">
                            Why this match:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {rec.reasons.slice(0, 3).map((reason, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Common genres */}
                        {rec.commonGenres.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-blue-400">
                              Common genres:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.commonGenres.map((genre, index) => (
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

                        {/* Match score */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {Math.round((rec.score / 100) * 100)}% match
                            </span>
                          </div>
                          {rec.mutualConnections > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {rec.mutualConnections} mutual
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleConnect(rec.user.id)}
                            disabled={connectionRequests.includes(rec.user.id)}
                            className="flex-1"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            {connectionRequests.includes(rec.user.id)
                              ? "Sent"
                              : "Connect"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {recommendations.length === 0 && (
                  <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-muted-foreground">
                      Complete your profile to get personalized recommendations
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/profile">Complete Profile</Link>
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Trending Tracks */}
            <TabsContent value="trending">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Trending Tracks</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTracks.map((track, index) => {
                    const TrackIcon = getTrackTypeIcon(
                      track.trackType || "full-track",
                    );
                    return (
                      <Card
                        key={track.id}
                        className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
                              <span className="text-sm font-bold text-blue-400">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">
                                {track.title}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.artist}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <TrackIcon className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground capitalize">
                                  {track.trackType?.replace("-", " ") ||
                                    "track"}
                                </span>
                                {track.genre && (
                                  <>
                                    <span className="text-xs text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-xs text-muted-foreground capitalize">
                                      {track.genre}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Headphones className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {track.plays || 0}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {track.likes || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Recently Active Users */}
            <TabsContent value="active">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Recently Active</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyActive.map((activeUser) => (
                    <Card
                      key={activeUser.id}
                      className="border-green-500/20 bg-gradient-to-br from-card to-green-950/10 hover:border-green-500/40 transition-all duration-300"
                    >
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-green-500/20">
                          <AvatarImage src={activeUser.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                            {activeUser.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{activeUser.fullName}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{activeUser.username || "user"}
                        </p>
                        {activeUser.instrument && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {activeUser.instrument}
                          </Badge>
                        )}
                        <p className="text-xs text-green-400 mt-2">
                          Active {formatTimeAgo(activeUser.lastActive)}
                        </p>
                        <div className="flex space-x-1 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleConnect(activeUser.id)}
                            disabled={connectionRequests.includes(
                              activeUser.id,
                            )}
                          >
                            <UserPlus className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Discover;
