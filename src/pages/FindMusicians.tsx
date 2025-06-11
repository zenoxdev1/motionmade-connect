import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  Search,
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Filter,
  MessageCircle,
  UserPlus,
  Guitar,
  Piano,
  Drum,
  Mic,
  Globe,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Musician {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  instrument: string;
  genre: string;
  location: string;
  bio: string;
  experienceLevel: string;
  lookingFor: string;
  rating: number;
  connectionsCount: number;
  tracksCount: number;
  isOnline: boolean;
  lastActive: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
  };
}

const FindMusicians = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLookingFor, setSelectedLookingFor] = useState("");
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [filteredMusicians, setFilteredMusicians] = useState<Musician[]>([]);

  // Mock musicians data
  const mockMusicians: Musician[] = [
    {
      id: "1",
      fullName: "Sarah Chen",
      email: "sarah@example.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      instrument: "vocals",
      genre: "jazz",
      location: "Los Angeles, CA",
      bio: "Jazz vocalist with 15+ years experience. Love collaborating on soulful projects.",
      experienceLevel: "professional",
      lookingFor: "collaborators",
      rating: 4.9,
      connectionsCount: 127,
      tracksCount: 23,
      isOnline: true,
      lastActive: "2 minutes ago",
      socialLinks: {
        instagram: "@sarahchen_vocals",
        youtube: "@SarahChenMusic",
      },
    },
    {
      id: "2",
      fullName: "Marcus Williams",
      email: "marcus@example.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      instrument: "guitar",
      genre: "rock",
      location: "Nashville, TN",
      bio: "Session guitarist looking for rock/blues collaborations and live gigs.",
      experienceLevel: "advanced",
      lookingFor: "band",
      rating: 4.8,
      connectionsCount: 89,
      tracksCount: 45,
      isOnline: false,
      lastActive: "1 hour ago",
      socialLinks: {
        instagram: "@marcusguitarist",
      },
    },
    {
      id: "3",
      fullName: "Emma Rodriguez",
      email: "emma@example.com",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      instrument: "piano",
      genre: "classical",
      location: "New York, NY",
      bio: "Classical pianist open to crossover projects. Studied at Juilliard.",
      experienceLevel: "professional",
      lookingFor: "collaborators",
      rating: 4.9,
      connectionsCount: 156,
      tracksCount: 31,
      isOnline: true,
      lastActive: "5 minutes ago",
      socialLinks: {
        youtube: "@EmmaRodriguezPiano",
      },
    },
    {
      id: "4",
      fullName: "David Kim",
      email: "david@example.com",
      instrument: "drums",
      genre: "electronic",
      location: "Seattle, WA",
      bio: "Electronic music producer and drummer. Love mixing organic drums with synths.",
      experienceLevel: "intermediate",
      lookingFor: "jam",
      rating: 4.6,
      connectionsCount: 67,
      tracksCount: 18,
      isOnline: false,
      lastActive: "3 hours ago",
      socialLinks: {},
    },
    {
      id: "5",
      fullName: "Lisa Park",
      email: "lisa@example.com",
      instrument: "guitar",
      genre: "indie",
      location: "Austin, TX",
      bio: "Indie singer-songwriter. Looking for a bassist and drummer to complete my band.",
      experienceLevel: "intermediate",
      lookingFor: "band",
      rating: 4.7,
      connectionsCount: 43,
      tracksCount: 12,
      isOnline: true,
      lastActive: "Just now",
      socialLinks: {
        instagram: "@lisaparkmusic",
      },
    },
  ];

  useEffect(() => {
    setMusicians(mockMusicians);
    setFilteredMusicians(mockMusicians);
  }, []);

  useEffect(() => {
    let filtered = musicians.filter((musician) => {
      const matchesSearch =
        musician.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        musician.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        musician.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
        musician.genre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesInstrument =
        !selectedInstrument || musician.instrument === selectedInstrument;
      const matchesGenre = !selectedGenre || musician.genre === selectedGenre;
      const matchesLocation =
        !selectedLocation ||
        musician.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase());
      const matchesLookingFor =
        !selectedLookingFor || musician.lookingFor === selectedLookingFor;

      return (
        matchesSearch &&
        matchesInstrument &&
        matchesGenre &&
        matchesLocation &&
        matchesLookingFor
      );
    });

    setFilteredMusicians(filtered);
  }, [
    searchQuery,
    selectedInstrument,
    selectedGenre,
    selectedLocation,
    selectedLookingFor,
    musicians,
  ]);

  const instruments = [
    { value: "guitar", label: "Guitar", icon: Guitar },
    { value: "piano", label: "Piano/Keyboard", icon: Piano },
    { value: "drums", label: "Drums", icon: Drum },
    { value: "vocals", label: "Vocals", icon: Mic },
    { value: "bass", label: "Bass Guitar", icon: Guitar },
    { value: "violin", label: "Violin", icon: Music },
    { value: "saxophone", label: "Saxophone", icon: Music },
  ];

  const genres = [
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Hip Hop",
    "Electronic",
    "Country",
    "R&B",
    "Blues",
    "Folk",
    "Indie",
  ];
  const lookingForOptions = [
    { value: "band", label: "Join a Band" },
    { value: "collaborators", label: "Find Collaborators" },
    { value: "jam", label: "Jam Sessions" },
    { value: "mentor", label: "Find a Mentor" },
    { value: "students", label: "Teach Students" },
  ];

  const getInstrumentIcon = (instrument: string) => {
    const found = instruments.find((i) => i.value === instrument);
    return found ? found.icon : Music;
  };

  const handleConnect = (musicianId: string) => {
    // Add connection logic here
    console.log("Connecting to musician:", musicianId);
  };

  const handleMessage = (musicianId: string) => {
    // Add messaging logic here
    console.log("Messaging musician:", musicianId);
  };

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
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Musicians</h1>
          <p className="text-muted-foreground">
            Discover and connect with musicians who share your passion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search musicians..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instrument</Label>
                  <Select
                    value={selectedInstrument}
                    onValueChange={setSelectedInstrument}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any instrument</SelectItem>
                      {instruments.map((instrument) => (
                        <SelectItem
                          key={instrument.value}
                          value={instrument.value}
                        >
                          <div className="flex items-center">
                            <instrument.icon className="w-4 h-4 mr-2" />
                            {instrument.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select
                    value={selectedGenre}
                    onValueChange={setSelectedGenre}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any genre</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="City, State"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Looking For</Label>
                  <Select
                    value={selectedLookingFor}
                    onValueChange={setSelectedLookingFor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Anything" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Anything</SelectItem>
                      {lookingForOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedInstrument("");
                    setSelectedGenre("");
                    setSelectedLocation("");
                    setSelectedLookingFor("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Musicians List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Found {filteredMusicians.length} musician
                {filteredMusicians.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMusicians.map((musician) => {
                const InstrumentIcon = getInstrumentIcon(musician.instrument);
                return (
                  <Card
                    key={musician.id}
                    className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleConnect(musician.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessage(musician.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/profile/${musician.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            View Profile
                          </Link>
                        </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {musician.bio}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{musician.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Music className="w-4 h-4" />
                          <span>{musician.tracksCount} tracks</span>
                        </div>
                      </div>

                      {(musician.socialLinks.instagram ||
                        musician.socialLinks.youtube) && (
                        <div className="flex items-center space-x-2">
                          {musician.socialLinks.instagram && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Instagram className="w-4 h-4 text-pink-500" />
                            </Button>
                          )}
                          {musician.socialLinks.youtube && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Youtube className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          size="sm"
                          onClick={() => handleConnect(musician.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessage(musician.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredMusicians.length === 0 && (
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  No musicians found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedInstrument("");
                    setSelectedGenre("");
                    setSelectedLocation("");
                    setSelectedLookingFor("");
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMusicians;