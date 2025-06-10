import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Guitar,
  Piano,
  Drum,
  Mic,
  Play,
  Heart,
  Share2,
  Trophy,
  Zap,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const featuredMusicians = [
    {
      name: "Sarah Chen",
      instrument: "Vocalist",
      genre: "Jazz/Soul",
      rating: 4.9,
      tracks: 23,
      collaborations: 12,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      badge: "Featured Artist",
      location: "Los Angeles, CA",
    },
    {
      name: "Marcus Williams",
      instrument: "Guitar",
      genre: "Rock/Blues",
      rating: 4.8,
      tracks: 45,
      collaborations: 28,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      badge: "Top Collaborator",
      location: "Nashville, TN",
    },
    {
      name: "Emma Rodriguez",
      instrument: "Piano",
      genre: "Classical/Pop",
      rating: 4.9,
      tracks: 31,
      collaborations: 19,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      badge: "Rising Star",
      location: "New York, NY",
    },
  ];

  const recentCollaborations = [
    {
      title: "Midnight Jazz Session",
      participants: ["Sarah C.", "David K.", "Mike L."],
      genre: "Jazz",
      duration: "3:45",
      plays: 1200,
      likes: 89,
    },
    {
      title: "Electric Dreams",
      participants: ["Marcus W.", "Lisa P.", "Alex M."],
      genre: "Rock",
      duration: "4:12",
      plays: 2100,
      likes: 156,
    },
    {
      title: "Ocean Waves",
      participants: ["Emma R.", "Jordan T."],
      genre: "Ambient",
      duration: "5:23",
      plays: 980,
      likes: 67,
    },
  ];

  const upcomingEvents = [
    {
      title: "Virtual Jazz Jam Session",
      date: "Dec 15, 2024",
      time: "8:00 PM EST",
      participants: 12,
      type: "Live Session",
    },
    {
      title: "Singer-Songwriter Showcase",
      date: "Dec 18, 2024",
      time: "7:30 PM PST",
      participants: 8,
      type: "Showcase",
    },
    {
      title: "Electronic Music Workshop",
      date: "Dec 20, 2024",
      time: "6:00 PM EST",
      participants: 25,
      type: "Workshop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion Connect
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link to="/community" className="text-foreground font-medium">
              Community
            </Link>
            <Link
              to="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              asChild
            >
              <Link to="/signup">Join Community</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium"
            >
              🌟 Vibrant Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Join a Global Network of
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Creative Musicians
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with over 50,000 musicians worldwide. Share your music,
              collaborate on projects, and grow together in our supportive
              community.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center mb-8">
              <div>
                <div className="text-3xl font-bold text-purple-400">50K+</div>
                <div className="text-sm text-muted-foreground">Musicians</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">100K+</div>
                <div className="text-sm text-muted-foreground">
                  Tracks Shared
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">25K+</div>
                <div className="text-sm text-muted-foreground">
                  Collaborations
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">180+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Musicians */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Musicians
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented artists making waves in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMusicians.map((musician, index) => (
              <Card
                key={index}
                className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={musician.avatar} alt={musician.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                      {musician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="mb-2">
                    {musician.badge}
                  </Badge>
                  <CardTitle className="text-xl">{musician.name}</CardTitle>
                  <p className="text-muted-foreground">{musician.instrument}</p>
                  <p className="text-sm text-muted-foreground">
                    {musician.genre}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {musician.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{musician.rating}</span>
                    </div>
                    <div>{musician.tracks} tracks</div>
                    <div>{musician.collaborations} collabs</div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="sm"
                  >
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Collaborations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recent
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Collaborations
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Listen to amazing music created by our community members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentCollaborations.map((track, index) => (
              <Card
                key={index}
                className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{track.genre}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {track.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{track.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by {track.participants.join(", ")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Play className="w-4 h-4" />
                      <span>{track.plays.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{track.likes}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Events
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join live sessions, workshops, and showcases with fellow musicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{event.type}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="sm"
                  >
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                50,000+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Musicians
              </div>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Messages Sent</div>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                25,000+
              </div>
              <div className="text-sm text-muted-foreground">
                Collaborations
              </div>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">180+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto border-purple-500/20 bg-gradient-to-br from-card via-purple-950/10 to-blue-950/10">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Join Our
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Musical Family?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with musicians from around the world and start creating
                amazing music together today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/signup">
                    <Users className="w-5 h-5 mr-2" />
                    Join Community
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 h-auto border-purple-500/30 hover:bg-purple-500/10"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Free to join • Connect instantly • Start collaborating now
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Motion Connect
              </span>
            </Link>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <span>© 2024 Motion Connect. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Community;

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}
