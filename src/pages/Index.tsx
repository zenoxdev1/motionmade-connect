import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion Connect
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium"
            >
              🎵 For Musicians, By Musicians
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect, Create, and
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Collaborate
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform where musicians discover each other, share
              their craft, and build lasting creative partnerships. Your next
              musical breakthrough starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creating Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto border-purple-500/30 hover:bg-purple-500/10"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Listen to Demos
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Musicians
                </div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools and community features designed specifically
              for musicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Find Your Band</h3>
                <p className="text-muted-foreground">
                  Connect with musicians who share your vision and style. Our
                  smart matching algorithm finds the perfect collaborators for
                  your projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Share Your Sound</h3>
                <p className="text-muted-foreground">
                  Upload and showcase your music with high-quality streaming.
                  Get feedback from the community and build your fanbase.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Live Sessions</h3>
                <p className="text-muted-foreground">
                  Host live streaming sessions, collaborate in real-time, and
                  perform for audiences around the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Guitar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Multi-Instrument Support
                </h3>
                <p className="text-muted-foreground">
                  Whether you're a guitarist, drummer, pianist, or vocalist -
                  find your place in our diverse musical community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pro Features</h3>
                <p className="text-muted-foreground">
                  Advanced analytics, priority matching, unlimited uploads, and
                  exclusive industry connections for serious musicians.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Drum className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Genre Diversity</h3>
                <p className="text-muted-foreground">
                  From jazz to metal, electronic to acoustic - connect with
                  musicians across all genres and expand your musical horizons.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto border-purple-500/20 bg-gradient-to-br from-card via-purple-950/10 to-blue-950/10">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <Piano className="w-8 h-8 text-purple-400" />
                  <Guitar className="w-8 h-8 text-blue-400" />
                  <Drum className="w-8 h-8 text-purple-400" />
                  <Mic className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Make
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Music Magic?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of musicians who have already found their perfect
                collaborators and taken their music to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 h-auto border-purple-500/30 hover:bg-purple-500/10"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Free to join • No credit card required • Instant access
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Motion Connect
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
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

export default Index;
