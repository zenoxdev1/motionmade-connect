import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import {
  checkMigrationNeeded,
  migrateUserTracks,
  getMigrationStats,
} from "@/utils/audioMigration";
import {
  Music,
  Users,
  Play,
  Upload,
  Settings,
  LogOut,
  Guitar,
  Mic,
  Piano,
  Drum,
  Star,
  Clock,
  Search,
  User,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Compass,
  BarChart3,
  Calendar,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { playTrack } = useMusicPlayer();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState({
    tracksCount: 0,
    connectionsCount: 0,
    totalPlays: 0,
    totalLikes: 0,
    profileViews: 0,
    messagesCount: 0,
  });
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadRecentTracks();
      loadRecentActivity();
      checkAndMigrate();
    }
  }, [user]);

  const checkAndMigrate = async () => {
    if (!user) return;

    if (checkMigrationNeeded(user.id)) {
      const stats = getMigrationStats(user.id);

      if (stats.estimatedSize > 10 * 1024 * 1024) {
        // > 10MB
        toast({
          title: "Optimizing your music library...",
          description:
            "We're improving storage efficiency. This may take a moment.",
        });

        try {
          const result = await migrateUserTracks(user.id);

          if (result.migrated > 0) {
            toast({
              title: "Library optimized! ✨",
              description: `${result.migrated} tracks optimized for better performance.`,
            });
          }
        } catch (error) {
          console.error("Migration failed:", error);
          // Silent fail - user experience isn't affected
        }
      }
    }
  };

  const loadUserStats = () => {
    if (!user) return;

    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${user.id}`) || "[]",
    );
    const connections = JSON.parse(
      localStorage.getItem(`connections_${user.id}`) || "[]",
    );
    const messages = JSON.parse(
      localStorage.getItem(`conversations_${user.id}`) || "[]",
    );

    const totalPlays = userTracks.reduce(
      (sum: number, track: any) => sum + (track.plays || 0),
      0,
    );
    const totalLikes = userTracks.reduce(
      (sum: number, track: any) => sum + (track.likes || 0),
      0,
    );

    setUserStats({
      tracksCount: userTracks.length,
      connectionsCount: connections.filter((c: any) => c.status === "accepted")
        .length,
      totalPlays,
      totalLikes,
      profileViews: Math.floor(Math.random() * 100) + totalPlays, // Simulated
      messagesCount: messages.reduce(
        (sum: number, conv: any) => sum + (conv.unreadCount || 0),
        0,
      ),
    });
  };

  const loadRecentTracks = () => {
    if (!user) return;

    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${user.id}`) || "[]",
    );
    const sortedTracks = userTracks
      .sort(
        (a: any, b: any) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      )
      .slice(0, 5);
    setRecentTracks(sortedTracks);
  };

  const loadRecentActivity = () => {
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
    const recentTracks = allTracks
      .filter((track: any) => track.userId !== user?.id)
      .sort(
        (a: any, b: any) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      )
      .slice(0, 10);
    setRecentActivity(recentTracks);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlayTrack = async (track: any) => {
    try {
      await playTrack(
        {
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          audioUrl: track.audioUrl,
          trackImage: track.trackImage,
          allowDownload: track.allowDownload,
          likes: track.likes,
        },
        [track],
        true, // Auto-play enabled
      );
    } catch (error) {
      toast({
        title: "Playback failed",
        description: "Unable to play this track.",
        variant: "destructive",
      });
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const InstrumentIcon = getInstrumentIcon(user?.instrument);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion Connect
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-tracks">
                <Music className="w-4 h-4 mr-2" />
                My Tracks
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to create some amazing music today?
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="mb-8 border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-2 border-purple-500/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{user?.fullName}</h2>
                  <p className="text-muted-foreground mb-2">
                    @{user?.username}
                  </p>
                  <div className="flex items-center space-x-4">
                    {user?.instrument && (
                      <div className="flex items-center space-x-1">
                        <InstrumentIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{user.instrument}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/profile/${user?.username}`}>
                        <Globe className="w-4 h-4 mr-2" />
                        View Public Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardContent className="p-4 text-center">
                <Music className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">
                  {userStats.tracksCount}
                </div>
                <div className="text-sm text-muted-foreground">Tracks</div>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{userStats.totalPlays}</div>
                <div className="text-sm text-muted-foreground">Plays</div>
              </CardContent>
            </Card>
            <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-950/10">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{userStats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-gradient-to-br from-card to-orange-950/10">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold">
                  {userStats.connectionsCount}
                </div>
                <div className="text-sm text-muted-foreground">Connections</div>
              </CardContent>
            </Card>
            <Card className="border-pink-500/20 bg-gradient-to-br from-card to-pink-950/10">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold">
                  {userStats.profileViews}
                </div>
                <div className="text-sm text-muted-foreground">
                  Profile Views
                </div>
              </CardContent>
            </Card>
            <Card className="border-indigo-500/20 bg-gradient-to-br from-card to-indigo-950/10">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                <div className="text-2xl font-bold">
                  {userStats.messagesCount}
                </div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card className="group border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <Link to="/upload-track" className="block">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">Upload Track</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Share your music
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border-pink-500/20 bg-gradient-to-br from-card to-pink-950/10 hover:border-pink-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <Link to="/musicians" className="block">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2">
                        <Compass className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">Discover</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Find musicians & music
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border-green-500/20 bg-gradient-to-br from-card to-green-950/10 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <Link to="/musicians" className="block">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">Find Musicians</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Network & collaborate
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <Link to="/community" className="block">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">Browse Music</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Explore all tracks
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border-indigo-500/20 bg-gradient-to-br from-card to-indigo-950/10 hover:border-indigo-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => {
                      const userData = JSON.parse(
                        localStorage.getItem("userData") || "{}",
                      );
                      if (userData.id) {
                        const conversations = JSON.parse(
                          localStorage.getItem(
                            `conversations_${userData.id}`,
                          ) || "[]",
                        );
                        const hasUnread = conversations.some(
                          (conv: any) => conv.unreadCount > 0,
                        );
                        if (hasUnread) {
                          window.location.href = "/find-musicians"; // Navigate to messages
                        } else {
                          toast({
                            title: "No new messages",
                            description:
                              "Start a conversation with other musicians!",
                          });
                        }
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2 relative">
                      <MessageCircle className="w-6 h-6 text-white" />
                      {userStats.messagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {userStats.messagesCount}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">Messages</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userStats.messagesCount > 0
                        ? `${userStats.messagesCount} unread`
                        : "Chat with others"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-orange-500/20 bg-gradient-to-br from-card to-orange-950/10 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-4">
                  <Link to="/my-tracks" className="block">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mx-auto mb-2">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">Analytics</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Track performance
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tracks */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Your Recent Tracks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTracks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayTrack(track)}
                            className="w-8 h-8 p-0"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <div>
                            <p className="font-medium text-sm">{track.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDuration(track.duration)} •{" "}
                              {formatDate(track.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{track.plays || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{track.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No tracks yet</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link to="/upload-track">Upload your first track</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Community Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayTrack(track)}
                            className="w-8 h-8 p-0"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <div>
                            <p className="font-medium text-sm">{track.title}</p>
                            <p className="text-xs text-muted-foreground">
                              by {track.artist} • {formatDate(track.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{track.plays || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{track.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link to="/musicians">Explore the community</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
