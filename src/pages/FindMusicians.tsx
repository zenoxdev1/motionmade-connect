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
  name: string;
  username?: string;
  avatar?: string;
  instrument: string;
  genre: string;
  location: string;
  bio: string;
  experienceLevel: string;
  lookingFor: string;
  rating: number;
  connectionsCount: number;
  isOnline: boolean;
  lastActive: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

const FindMusicians = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLookingFor, setSelectedLookingFor] = useState("");
  const [musicians, setMusicians] = useState<Musician[]>([]);

  const instruments = [
    { value: "guitar", label: "Guitar", icon: Guitar },
    { value: "piano", label: "Piano", icon: Piano },
    { value: "drums", label: "Drums", icon: Drum },
    { value: "vocals", label: "Vocals", icon: Mic },
    { value: "bass", label: "Bass Guitar", icon: Guitar },
    { value: "violin", label: "Violin", icon: Music },
    { value: "saxophone", label: "Saxophone", icon: Music },
    { value: "trumpet", label: "Trumpet", icon: Music },
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
    "Reggae",
    "Metal",
  ];

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Nashville, TN",
    "Austin, TX",
    "Seattle, WA",
    "Miami, FL",
    "Boston, MA",
  ];

  const lookingForOptions = [
    { value: "band_members", label: "Band Members" },
    { value: "collaborators", label: "Collaborators" },
    { value: "session_musicians", label: "Session Musicians" },
    { value: "jam_partners", label: "Jam Partners" },
    { value: "producers", label: "Producers" },
    { value: "songwriters", label: "Songwriters" },
  ];

  useEffect(() => {
    // Generate sample musicians data
    const sampleMusicians: Musician[] = [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        instrument: "guitar",
        genre: "Rock",
        location: "New York, NY",
        bio: "Passionate rock guitarist with 8+ years of experience. Looking for band members to start a new project.",
        experienceLevel: "Advanced",
        lookingFor: "band_members",
        rating: 4.8,
        connectionsCount: 45,
        isOnline: true,
        lastActive: "2 min ago",
        socialLinks: {
          instagram: "https://instagram.com/alexguitar",
          youtube: "https://youtube.com/alexguitar",
        },
      },
      {
        id: "2",
        name: "Sarah Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
        instrument: "piano",
        genre: "Jazz",
        location: "Los Angeles, CA",
        bio: "Jazz pianist and composer. Love creating soulful melodies and looking for creative collaborators.",
        experienceLevel: "Professional",
        lookingFor: "collaborators",
        rating: 4.9,
        connectionsCount: 62,
        isOnline: false,
        lastActive: "1 hour ago",
        socialLinks: {
          website: "https://sarahchen.music",
        },
      },
      {
        id: "3",
        name: "Mike Rodriguez",
        avatar: "https://i.pravatar.cc/150?img=3",
        instrument: "drums",
        genre: "Hip Hop",
        location: "Chicago, IL",
        bio: "Hip-hop drummer with a pocket that never quits. Session work and live performances welcome.",
        experienceLevel: "Advanced",
        lookingFor: "session_musicians",
        rating: 4.7,
        connectionsCount: 38,
        isOnline: true,
        lastActive: "5 min ago",
      },
      {
        id: "4",
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?img=4",
        instrument: "vocals",
        genre: "Pop",
        location: "Nashville, TN",
        bio: "Pop vocalist and songwriter. Looking to collaborate on original music and covers.",
        experienceLevel: "Intermediate",
        lookingFor: "songwriters",
        rating: 4.6,
        connectionsCount: 29,
        isOnline: false,
        lastActive: "3 hours ago",
      },
      {
        id: "5",
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?img=5",
        instrument: "bass",
        genre: "Electronic",
        location: "Austin, TX",
        bio: "Electronic music producer and bass player. Always experimenting with new sounds.",
        experienceLevel: "Professional",
        lookingFor: "producers",
        rating: 4.8,
        connectionsCount: 54,
        isOnline: true,
        lastActive: "1 min ago",
      },
    ];

    setMusicians(sampleMusicians);
  }, []);

  const filteredMusicians = musicians.filter((musician) => {
    const matchesSearch =
      musician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      musician.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstrument =
      !selectedInstrument || musician.instrument === selectedInstrument;
    const matchesGenre = !selectedGenre || musician.genre === selectedGenre;
    const matchesLocation =
      !selectedLocation || musician.location === selectedLocation;
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

  const getInstrumentIcon = (instrument: string) => {
    const found = instruments.find((i) => i.value === instrument);
    return found ? found.icon : Music;
  };

  const handleConnect = (musicianId: string) => {
    toast({
      title: "Connection request sent!",
      description: "You'll be notified when they respond.",
    });
  };

  const handleMessage = (musicianId: string) => {
    toast({
      title: "Message feature coming soon!",
      description: "Direct messaging will be available in the next update.",
    });
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Musicians</h1>
            <p className="text-muted-foreground">
              Connect with talented musicians and expand your network
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Musicians</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, bio, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          {instrument.label}
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
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any location</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Looking For</Label>
                  <Select
                    value={selectedLookingFor}
                    onValueChange={setSelectedLookingFor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      {lookingForOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery ||
                selectedInstrument ||
                selectedGenre ||
                selectedLocation ||
                selectedLookingFor) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary">Search: "{searchQuery}"</Badge>
                  )}
                  {selectedInstrument && (
                    <Badge variant="secondary">
                      {
                        instruments.find((i) => i.value === selectedInstrument)
                          ?.label
                      }
                    </Badge>
                  )}
                  {selectedGenre && (
                    <Badge variant="secondary">{selectedGenre}</Badge>
                  )}
                  {selectedLocation && (
                    <Badge variant="secondary">{selectedLocation}</Badge>
                  )}
                  {selectedLookingFor && (
                    <Badge variant="secondary">
                      {
                        lookingForOptions.find(
                          (o) => o.value === selectedLookingFor,
                        )?.label
                      }
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedInstrument("");
                      setSelectedGenre("");
                      setSelectedLocation("");
                      setSelectedLookingFor("");
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Musicians ({filteredMusicians.length})
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {filteredMusicians.length} results
                </span>
              </div>
            </div>

            <div className="grid gap-6">
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
                          <Avatar className="w-16 h-16 border-2 border-purple-500/20">
                            <AvatarImage src={musician.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                              {musician.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {musician.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <InstrumentIcon className="w-4 h-4" />
                              <span>{musician.instrument}</span>
                              <span>•</span>
                              <span>{musician.genre}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {musician.location}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">{musician.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({musician.connectionsCount} connections)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge
                            variant={
                              musician.isOnline ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {musician.isOnline ? "Online" : musician.lastActive}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {musician.lookingFor.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {musician.bio}
                      </p>

                      {/* Social Links */}
                      {musician.socialLinks && (
                        <div className="flex space-x-2">
                          {musician.socialLinks.instagram && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={musician.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Instagram className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {musician.socialLinks.youtube && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={musician.socialLinks.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {musician.socialLinks.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={musician.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
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
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/profile/${musician.username || musician.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            View Profile
                          </Link>
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
