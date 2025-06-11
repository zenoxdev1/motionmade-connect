import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
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
    // Load user statistics from localStorage
    const loadUserStats = () => {
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${user?.id}`) || "[]",
      );
      const connections = JSON.parse(
        localStorage.getItem(`connections_${user?.id}`) || "[]",
      );
      const profileData = JSON.parse(
        localStorage.getItem(`profile_${user?.id}`) || "{}",
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
        connectionsCount: connections.length + 23, // Base connections for demo
        totalPlays: totalPlays + 1547, // Base plays for demo
        totalLikes: totalLikes + 234, // Base likes for demo
        profileViews: 127 + userTracks.length * 15, // Calculated views
        messagesCount: 8, // Demo messages
      });

      setRecentTracks(userTracks.slice(-3).reverse()); // Last 3 tracks

      // Generate recent activity based on user data
      const activities = [
        {
          type: "track_play",
          message: `Your track "${userTracks[0]?.title || "Demo Track"}" was played 12 times`,
          time: "2 hours ago",
          icon: Play,
        },
        {
          type: "new_connection",
          message: "Sarah M. connected with you",
          time: "4 hours ago",
          icon: Users,
        },
        {
          type: "track_like",
          message: `Someone liked your track "${userTracks[0]?.title || "Demo Track"}"`,
          time: "6 hours ago",
          icon: Heart,
        },
        {
          type: "profile_view",
          message: "Your profile was viewed 5 times today",
          time: "1 day ago",
          icon: Eye,
        },
      ];

      setRecentActivity(activities);
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
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
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.fullName}! 🎵
          </h1>
          <p className="text-muted-foreground">
            Ready to create some music magic today?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.fullName}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.instrument && (
                  <Badge variant="secondary" className="mt-2">
                    <InstrumentIcon className="w-3 h-3 mr-1" />
                    {user.instrument.charAt(0).toUpperCase() +
                      user.instrument.slice(1)}
                  </Badge>
                )}
                <Badge
                  variant={user?.provider === "google" ? "default" : "outline"}
                  className="mt-1"
                >
                  {user?.provider === "google"
                    ? "🔗 Google Account"
                    : "📧 Email Account"}
                </Badge>
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  asChild
                >
                  <Link to="/upload-track">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Track
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
                  asChild
                >
                  <Link to="/find-musicians">
                    <Search className="w-4 h-4 mr-2" />
                    Find Musicians
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
                  asChild
                >
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Recent Activity */}
          <div className="space-y-6">
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {recentActivity.length === 0 && (
                  <div className="text-center p-6">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a track or connect with musicians to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {userStats.tracksCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tracks Shared
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {userStats.connectionsCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Connections
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {userStats.totalPlays}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Plays
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {userStats.totalLikes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Likes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Profile Views</span>
                    </div>
                    <span className="font-semibold">
                      {userStats.profileViews}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Messages</span>
                    </div>
                    <span className="font-semibold">
                      {userStats.messagesCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">New Likes</span>
                    </div>
                    <span className="font-semibold">
                      +{Math.floor(userStats.totalLikes * 0.3)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recommended */}
          <div className="space-y-6">
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        AM
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Alex M.</p>
                      <p className="text-sm text-muted-foreground">
                        Drummer • 4.9★
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Looking for a guitarist for indie rock project...
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500/30"
                  >
                    Connect
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        SP
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Sarah P.</p>
                      <p className="text-sm text-muted-foreground">
                        Vocalist • 4.7★
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Jazz vocalist seeking instrumentalists...
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500/30"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
