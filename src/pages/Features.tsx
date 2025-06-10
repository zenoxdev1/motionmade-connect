import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  Mic,
  Radio,
  Play,
  Star,
  ArrowRight,
  Headphones,
  Guitar,
  Drum,
  Piano,
  Zap,
  Shield,
  Smartphone,
  Cloud,
  Volume2,
  Heart,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
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
            <Link to="/#features" className="text-foreground font-medium">
              Features
            </Link>
            <Link
              to="/community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
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
              <Link to="/signup">Get Started</Link>
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
              🚀 Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Create & Connect
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the complete suite of tools designed specifically for
              musicians. From collaboration to distribution, we've got
              everything covered.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools that adapt to your creative workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our AI-powered algorithm connects you with musicians who
                  complement your style and skill level perfectly.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Genre-based matching</li>
                  <li>• Skill level compatibility</li>
                  <li>• Location preferences</li>
                  <li>• Collaboration history</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Cloud Studio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Upload, store, and share your music with unlimited cloud
                  storage and professional-quality streaming.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Unlimited storage</li>
                  <li>• High-quality streaming</li>
                  <li>• Version control</li>
                  <li>• Cross-platform sync</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Live Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Jam together in real-time with ultra-low latency streaming and
                  synchronized playback.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time audio sync</li>
                  <li>• Multi-track recording</li>
                  <li>• Live video chat</li>
                  <li>• Session recording</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Take your music anywhere with our full-featured mobile app for
                  iOS and Android.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Native iOS & Android apps</li>
                  <li>• Offline mode</li>
                  <li>• Background playback</li>
                  <li>• Push notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your progress with detailed analytics on plays,
                  engagement, and audience growth.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Play count analytics</li>
                  <li>• Audience demographics</li>
                  <li>• Engagement metrics</li>
                  <li>• Revenue tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Rights Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Protect your intellectual property with built-in copyright
                  protection and licensing tools.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Copyright registration</li>
                  <li>• Licensing management</li>
                  <li>• Royalty tracking</li>
                  <li>• Legal protection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Tools
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional features for serious musicians and industry
              professionals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card via-purple-950/10 to-blue-950/10 p-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    AI-Powered Mastering
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get professional-quality masters with our AI mastering
                    engine. Trained on thousands of hit songs across all genres.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Genre-specific mastering</li>
                    <li>• Reference track matching</li>
                    <li>• Stem separation</li>
                    <li>• Real-time preview</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card via-blue-950/10 to-purple-950/10 p-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    Distribution Network
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Distribute your music to 150+ streaming platforms worldwide
                    with just one click.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Spotify, Apple Music, YouTube</li>
                    <li>• TikTok, Instagram integration</li>
                    <li>• Release scheduling</li>
                    <li>• Playlist pitching</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24-bit Audio</h3>
              <p className="text-sm text-muted-foreground">
                Studio-quality audio with lossless compression and high-fidelity
                playback.
              </p>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fan Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Build and engage with your fanbase through comments, messages,
                and live streams.
              </p>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 priority support from our team of music industry
                professionals.
              </p>
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
                Ready to Experience
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  All Features?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of musicians who are already using Motion Connect
                to accelerate their musical journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/signup">
                    <Music className="w-5 h-5 mr-2" />
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 h-auto border-purple-500/30 hover:bg-purple-500/10"
                  asChild
                >
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                14-day free trial • No credit card required • Cancel anytime
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

export default Features;
