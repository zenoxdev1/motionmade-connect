import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Music,
  ArrowLeft,
  Play,
  Pause,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Share2,
  Heart,
  Upload,
  Calendar,
  Clock,
  Headphones,
  Activity,
  RotateCcw,
  Zap,
  Drum,
  Mic,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  isPublic: boolean;
  allowDownload: boolean;
  duration: number;
  fileSize: number;
  fileName: string;
  uploadDate: string;
  plays: number;
  likes: number;
  artist: string;
  audioUrl?: string;
  trackImage?: string;
  trackType?:
    | "loops"
    | "starters"
    | "beats"
    | "one-shots"
    | "drums"
    | "vocals"
    | "full-track";
  bpm?: number;
  musicalKey?: string;
}

const trackTypeIcons = {
  "full-track": Music,
  loops: RotateCcw,
  starters: Zap,
  beats: Activity,
  "one-shots": Zap,
  drums: Drum,
  vocals: Mic,
};

const MyTracks = () => {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    loadTracks();
  }, [user]);

  // Listen for real-time updates
  useEffect(() => {
    const handleTracksUpdated = (event: CustomEvent) => {
      if (event.detail.userId === user?.id) {
        loadTracks();
      }
    };

    window.addEventListener(
      "tracksUpdated",
      handleTracksUpdated as EventListener,
    );
    return () => {
      window.removeEventListener(
        "tracksUpdated",
        handleTracksUpdated as EventListener,
      );
    };
  }, [user]);

  const loadTracks = () => {
    if (!user) return;
    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${user.id}`) || "[]",
    );
    setTracks(
      userTracks.sort(
        (a: Track, b: Track) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      ),
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePlayPause = async (track: Track) => {
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

    if (isCurrentlyPlaying) {
      // Track is already playing, pause it
      return;
    } else {
      // Play this track with auto-play enabled
      try {
        await playTrack(
          {
            id: track.id,
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            trackImage: track.trackImage || "",
            allowDownload: track.allowDownload,
            likes: track.likes,
            audioUrl: track.audioUrl || "",
            genre: track.genre,
            trackType: track.trackType,
            bpm: track.bpm,
            musicalKey: track.musicalKey,
            tags: track.tags,
            description: track.description,
            uploadDate: track.uploadDate,
            plays: track.plays,
          },
          tracks.map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            duration: t.duration,
            trackImage: t.trackImage || "",
            allowDownload: t.allowDownload,
            likes: t.likes,
            audioUrl: t.audioUrl || "",
            genre: t.genre,
            trackType: t.trackType,
            bpm: t.bpm,
            musicalKey: t.musicalKey,
            tags: t.tags,
            description: t.description,
            uploadDate: t.uploadDate,
            plays: t.plays,
          })),
          true, // Enable auto-play
        );
      } catch (error) {
        toast({
          title: "Playback failed",
          description:
            "Unable to play this track. It may not have a valid audio file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleVisibility = (trackId: string) => {
    const updatedTracks = tracks.map((track) =>
      track.id === trackId ? { ...track, isPublic: !track.isPublic } : track,
    );
    setTracks(updatedTracks);
    localStorage.setItem(`tracks_${user?.id}`, JSON.stringify(updatedTracks));

    // Update global tracks if made public
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
    const track = updatedTracks.find((t) => t.id === trackId);

    if (track?.isPublic) {
      // Add to global tracks if not already there
      if (!allTracks.find((t: Track) => t.id === trackId)) {
        allTracks.push(track);
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }
    } else {
      // Remove from global tracks
      const filteredTracks = allTracks.filter((t: Track) => t.id !== trackId);
      localStorage.setItem("allTracks", JSON.stringify(filteredTracks));
    }

    toast({
      title: track?.isPublic ? "Track published" : "Track made private",
      description: track?.isPublic
        ? "Your track is now visible to everyone"
        : "Your track is now private",
    });
  };

  const handleDeleteTrack = (trackId: string) => {
    const trackToDelete = tracks.find((t) => t.id === trackId);
    const updatedTracks = tracks.filter((track) => track.id !== trackId);
    setTracks(updatedTracks);
    localStorage.setItem(`tracks_${user?.id}`, JSON.stringify(updatedTracks));

    // Remove from global tracks as well
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
    const filteredTracks = allTracks.filter((t: Track) => t.id !== trackId);
    localStorage.setItem("allTracks", JSON.stringify(filteredTracks));

    toast({
      title: "Track deleted",
      description: `"${trackToDelete?.title}" has been removed from your library.`,
    });
  };

  const getTrackTypeIcon = (trackType?: string) => {
    if (!trackType) return Music;
    return trackTypeIcons[trackType as keyof typeof trackTypeIcons] || Music;
  };

  const totalPlays = tracks.reduce((sum, track) => sum + track.plays, 0);
  const totalLikes = tracks.reduce((sum, track) => sum + track.likes, 0);
  const publicTracks = tracks.filter((track) => track.isPublic).length;

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

          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Link to="/upload-track">
              <Upload className="w-4 h-4 mr-2" />
              Upload Track
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Tracks</h1>
            <p className="text-muted-foreground">
              Manage and organize your music library
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {tracks.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Tracks
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {totalPlays}
                </div>
                <div className="text-sm text-muted-foreground">Total Plays</div>
              </CardContent>
            </Card>
            <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-950/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {totalLikes}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-gradient-to-br from-card to-orange-950/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {publicTracks}
                </div>
                <div className="text-sm text-muted-foreground">Public</div>
              </CardContent>
            </Card>
          </div>

          {/* Tracks List */}
          <div className="space-y-4">
            {tracks.length > 0 ? (
              tracks.map((track) => {
                const isCurrentlyPlaying =
                  currentTrack?.id === track.id && isPlaying;
                const TrackIcon = getTrackTypeIcon(track.trackType);

                return (
                  <Card
                    key={track.id}
                    className={`border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-300 ${
                      isCurrentlyPlaying ? "ring-2 ring-purple-500/50" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          {/* Play Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 rounded-full"
                            onClick={() => handlePlayPause(track)}
                          >
                            {isCurrentlyPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>

                          {/* Track Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold truncate">
                                {track.title}
                              </h3>
                              <TrackIcon className="w-4 h-4 text-muted-foreground" />
                              {track.trackType && (
                                <Badge variant="outline" className="text-xs">
                                  {track.trackType.replace("-", " ")}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDuration(track.duration)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Headphones className="w-3 h-3" />
                                <span>{track.plays} plays</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{track.likes} likes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(track.uploadDate)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badges */}
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={track.isPublic ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {track.isPublic ? "Public" : "Private"}
                            </Badge>
                            {track.genre && (
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {track.genre}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/edit-track/${track.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Track
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleVisibility(track.id)}
                            >
                              {track.isPublic ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Make Private
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Make Public
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTrack(track.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Track
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Track Description */}
                      {track.description && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {track.description}
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {track.tags && track.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {track.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-12">
                <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first track to get started
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link to="/upload-track">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Track
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTracks;
