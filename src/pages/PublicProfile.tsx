import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Pause,
  Share2,
  Download,
  Heart,
  Music,
  Users,
  Calendar,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  ArrowLeft,
  ExternalLink,
  Headphones,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTrackActions } from "@/hooks/useTrackActions";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface PublicUserProfile {
  id: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  website?: string;
  genres?: string[];
  instruments?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  memberSince?: string;
  totalTracks?: number;
  totalPlays?: number;
  totalLikes?: number;
  followers?: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  duration: number;
  plays?: number;
  likes?: number;
  uploadDate: string;
  trackImage?: string;
  allowDownload?: boolean;
  audioUrl?: string;
  tags?: string[];
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const { shareTrack, downloadTrack, likeTrack } = useTrackActions();
  const { playTrack } = useMusicPlayer();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [likedTracks, setLikedTracks] = useState<string[]>([]);

  useEffect(() => {
    const loadProfileData = () => {
      setIsLoading(true);

      try {
        // Find user by username (convert from URL format back to name)
        const displayName = username
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        // Load all users to find the matching profile
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const userData = allUsers.find(
          (user: any) =>
            user.fullName?.toLowerCase() === displayName?.toLowerCase(),
        );

        if (!userData) {
          toast({
            title: "Profile not found",
            description: "The requested user profile could not be found.",
            variant: "destructive",
          });
          return;
        }

        // Load user profile data
        const profileData = JSON.parse(
          localStorage.getItem(`profile_${userData.id}`) || "{}",
        );

        // Get user's public tracks
        const userTracks = JSON.parse(
          localStorage.getItem(`tracks_${userData.id}`) || "[]",
        );
        const publicTracks = userTracks.filter((track: any) => track.isPublic);

        // Calculate stats
        const totalPlays = publicTracks.reduce(
          (sum: number, track: any) => sum + (track.plays || 0),
          0,
        );
        const totalLikes = publicTracks.reduce(
          (sum: number, track: any) => sum + (track.likes || 0),
          0,
        );

        const userProfile: PublicUserProfile = {
          id: userData.id,
          fullName: userData.fullName || displayName || "Unknown Artist",
          profilePicture: profileData.profilePicture,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          genres: profileData.favoriteGenres || [],
          instruments: profileData.instruments || [],
          socialLinks: profileData.socialLinks || {},
          memberSince: userData.createdAt || new Date().toISOString(),
          totalTracks: publicTracks.length,
          totalPlays,
          totalLikes,
          followers: Math.floor(Math.random() * 1000), // Demo data
        };

        setProfile(userProfile);
        setTracks(publicTracks);

        // Load current user's liked tracks
        const currentUser = JSON.parse(
          localStorage.getItem("userData") || "{}",
        );
        if (currentUser.id) {
          const liked = JSON.parse(
            localStorage.getItem(`liked_${currentUser.id}`) || "[]",
          );
          setLikedTracks(liked);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Something went wrong while loading the profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfileData();
    }
  }, [username, toast]);

  const handlePlayTrack = (track: Track) => {
    setPlayingTrackId(track.id);
    playTrack(track, tracks);
  };

  const handleLikeTrack = (trackId: string) => {
    const isCurrentlyLiked = likedTracks.includes(trackId);
    const newLikedState = !isCurrentlyLiked;

    if (newLikedState) {
      setLikedTracks([...likedTracks, trackId]);
    } else {
      setLikedTracks(likedTracks.filter((id) => id !== trackId));
    }

    likeTrack(trackId, newLikedState);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested user profile could not be found.
            </p>
            <Button asChild>
              <Link to="/find-musicians">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Musicians
              </Link>
            </Button>
          </div>
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
              <Link to="/find-musicians">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Browse
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
          {/* Profile Header */}
          <Card className="mb-8 border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture */}
                <div className="flex justify-center md:justify-start">
                  <Avatar className="w-32 h-32 border-4 border-purple-500/20">
                    <AvatarImage
                      src={profile.profilePicture}
                      alt={profile.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                      {profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.fullName}
                  </h1>

                  {profile.bio && (
                    <p className="text-muted-foreground mb-4 text-lg">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start">
                    {profile.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Member since {formatDate(profile.memberSince!)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {profile.followers} followers
                    </div>
                  </div>

                  {/* Genres */}
                  {profile.genres && profile.genres.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {profile.genres.map((genre) => (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className="bg-purple-500/20 text-purple-300"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instruments */}
                  {profile.instruments && profile.instruments.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {profile.instruments.map((instrument) => (
                          <Badge
                            key={instrument}
                            variant="outline"
                            className="border-blue-500/30 text-blue-300"
                          >
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-2 justify-center md:justify-start">
                    {profile.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks?.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks?.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks?.youtube && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Youtube className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {profile.totalTracks}
                    </div>
                    <div className="text-sm text-muted-foreground">Tracks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {profile.totalPlays?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Plays</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">
                      {profile.totalLikes}
                    </div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracks Section */}
          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                Public Tracks ({tracks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No public tracks yet
                  </h3>
                  <p className="text-muted-foreground">
                    {profile.fullName} hasn't shared any public tracks yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      {/* Track Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {track.trackImage ? (
                          <img
                            src={track.trackImage}
                            alt={track.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Music className="w-8 h-8 text-purple-400" />
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">
                          {track.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatDuration(track.duration)}</span>
                          {track.genre && (
                            <>
                              <span>•</span>
                              <span>{track.genre}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{track.plays || 0} plays</span>
                        </div>
                        {track.tags && track.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {track.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {track.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{track.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayTrack(track)}
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeTrack(track.id)}
                          className={
                            likedTracks.includes(track.id) ? "text-red-500" : ""
                          }
                        >
                          <Heart
                            className={`w-4 h-4 ${likedTracks.includes(track.id) ? "fill-current" : ""}`}
                          />
                          <span className="ml-1 text-xs">
                            {track.likes || 0}
                          </span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareTrack(track)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>

                        {track.allowDownload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadTrack(track)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
