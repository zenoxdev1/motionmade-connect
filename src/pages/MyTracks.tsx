import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useState, useEffect } from "react";

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
}

const MyTracks = () => {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    // Load user's tracks from localStorage
    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${user?.id}`) || "[]",
    );
    setTracks(userTracks);
  }, [user]);

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

  const handlePlayPause = (track: Track) => {
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

    if (isCurrentlyPlaying) {
      // If this track is already playing, pause it
      // The music player handles pause/resume
    } else {
      // Play this track with the current tracks as playlist
      playTrack(
        {
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          trackImage: track.trackImage,
          allowDownload: track.allowDownload,
          likes: track.likes,
        },
        tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          duration: t.duration,
          trackImage: t.trackImage,
          allowDownload: t.allowDownload,
          likes: t.likes,
        })),
      );
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
  };

  const handleDeleteTrack = (trackId: string) => {
    const updatedTracks = tracks.filter((track) => track.id !== trackId);
    setTracks(updatedTracks);
    localStorage.setItem(`tracks_${user?.id}`, JSON.stringify(updatedTracks));

    // Remove from global tracks as well
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
    const filteredTracks = allTracks.filter((t: Track) => t.id !== trackId);
    localStorage.setItem("allTracks", JSON.stringify(filteredTracks));
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
          <Button asChild>
            <Link to="/upload-track">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Track
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tracks</h1>
          <p className="text-muted-foreground">
            Manage your uploaded music and view performance
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {tracks.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Tracks</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {publicTracks}
              </div>
              <div className="text-sm text-muted-foreground">Public Tracks</div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {totalPlays}
              </div>
              <div className="text-sm text-muted-foreground">Total Plays</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {totalLikes}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
        </div>

        {/* Tracks List */}
        {tracks.length === 0 ? (
          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-12">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first track to start sharing your music with the world
            </p>
            <Button asChild>
              <Link to="/upload-track">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Track
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <Card
                key={track.id}
                className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 hover:border-purple-500/40 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayPause(track)}
                        className="w-12 h-12 rounded-full"
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>

                      <div>
                        <h3 className="text-lg font-semibold">{track.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatDuration(track.duration)}</span>
                          <span>•</span>
                          <span className="capitalize">{track.genre}</span>
                          <span>•</span>
                          <span>{formatFileSize(track.fileSize)}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(track.uploadDate)}</span>
                          </div>
                        </div>
                        {track.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {track.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Play className="w-4 h-4" />
                          <span>{track.plays}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{track.likes}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={track.isPublic ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {track.isPublic ? "Public" : "Private"}
                        </Badge>

                        {track.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {track.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {track.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{track.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

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
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Track
                            </DropdownMenuItem>
                            {track.allowDownload && (
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteTrack(track.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Track
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTracks;
