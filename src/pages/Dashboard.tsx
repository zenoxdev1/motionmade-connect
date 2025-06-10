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
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();

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
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Track
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Musicians
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Jam Session
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
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Listened to "Jazz Fusion Mix"</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Connected with Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Received 5-star review</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">12</div>
                    <div className="text-sm text-muted-foreground">
                      Tracks Shared
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">45</div>
                    <div className="text-sm text-muted-foreground">
                      Connections
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">8</div>
                    <div className="text-sm text-muted-foreground">
                      Collaborations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">4.8</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
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
