import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Download,
  Share2,
  Heart,
  MoreHorizontal,
  X,
  Music,
  Clock,
  Disc,
  ListMusic,
  Headphones,
  Eye,
  User,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTrackActions } from "@/hooks/useTrackActions";

interface Track {
  id: string;
  title: string;
  artist: string;
  trackImage?: string;
  duration: number;
  fileName?: string;
  allowDownload?: boolean;
  likes?: number;
  audioUrl?: string;
  genre?: string;
  bpm?: number;
  musicalKey?: string;
  tags?: string[];
  description?: string;
  uploadDate?: string;
  plays?: number;
}

interface FullMusicPlayerProps {
  currentTrack: Track | null;
  playlist: Track[];
  isOpen: boolean;
  onClose: () => void;
  onTrackChange: (track: Track) => void;
}

const FullMusicPlayer: React.FC<FullMusicPlayerProps> = ({
  currentTrack,
  playlist,
  isOpen,
  onClose,
  onTrackChange,
}) => {
  const { toast } = useToast();
  const { shareTrack, downloadTrack, likeTrack } = useTrackActions();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "lyrics" | "info">(
    "info",
  );

  // Load audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setIsLoading(true);
    setCurrentTime(0);
    setIsPlaying(false);

    if (currentTrack.audioUrl && currentTrack.audioUrl.trim() !== "") {
      audio.src = currentTrack.audioUrl;
      audio.load();
    } else {
      setIsLoading(false);
      setDuration(currentTrack.duration);
      toast({
        title: "Audio unavailable",
        description: "This track doesn't have an audio file.",
        variant: "destructive",
      });
      return;
    }

    const handleLoadedData = () => {
      setDuration(audio.duration || currentTrack.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setDuration(currentTrack.duration);
      toast({
        title: "Audio error",
        description: "Could not load audio file.",
        variant: "destructive",
      });
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [currentTrack, toast]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (repeatMode === "all" || playlist.length > 1) {
        handleNext();
      }
    };

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [repeatMode, playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        if (!audio.src && currentTrack.audioUrl) {
          audio.src = currentTrack.audioUrl;
        }
        await audio.play();
      }
    } catch (error) {
      console.error("Play/pause error:", error);
      toast({
        title: "Playback Error",
        description: "Unable to play this track.",
        variant: "destructive",
      });
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    const newTime = (value[0] / 100) * duration;
    if (audio && audio.src) {
      audio.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setIsMuted(false);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const getCurrentTrackIndex = () => {
    return playlist.findIndex((track) => track.id === currentTrack?.id);
  };

  const handleNext = () => {
    const currentIndex = getCurrentTrackIndex();
    let nextIndex;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    if (playlist[nextIndex]) {
      onTrackChange(playlist[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentTrackIndex();
    let prevIndex;

    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    }

    if (playlist[prevIndex]) {
      onTrackChange(playlist[prevIndex]);
    }
  };

  const handleShare = () => {
    if (currentTrack) {
      shareTrack(currentTrack);
    }
  };

  const handleDownload = () => {
    if (currentTrack) {
      downloadTrack(currentTrack);
    }
  };

  const handleLike = () => {
    if (currentTrack) {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      likeTrack(currentTrack.id, newLikedState);
    }
  };

  const handleTrackSelect = (track: Track) => {
    onTrackChange(track);
  };

  if (!currentTrack) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-950/10">
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                Now Playing
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 h-full">
            {/* Main Player Area */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Track Art and Info */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="relative">
                  <Avatar className="w-48 h-48 rounded-2xl shadow-lg">
                    <AvatarImage
                      src={currentTrack.trackImage}
                      alt={currentTrack.title}
                      className="rounded-2xl"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-4xl rounded-2xl">
                      <Music className="w-20 h-20" />
                    </AvatarFallback>
                  </Avatar>
                  {isPlaying && (
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Disc className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-2 truncate">
                    {currentTrack.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4 truncate">
                    {currentTrack.artist}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentTrack.genre && (
                      <Badge variant="secondary">{currentTrack.genre}</Badge>
                    )}
                    {currentTrack.bpm && (
                      <Badge variant="outline">{currentTrack.bpm} BPM</Badge>
                    )}
                    {currentTrack.musicalKey && (
                      <Badge variant="outline">
                        Key: {currentTrack.musicalKey}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{currentTrack.plays || 0} plays</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{currentTrack.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {currentTrack.allowDownload && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full mb-2"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mb-8">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={isShuffled ? "text-purple-400" : ""}
                >
                  <Shuffle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePrevious}
                  disabled={playlist.length <= 1}
                >
                  <SkipBack className="w-6 h-6" />
                </Button>

                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  disabled={isLoading}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleNext}
                  disabled={playlist.length <= 1}
                >
                  <SkipForward className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() =>
                    setRepeatMode(
                      repeatMode === "none"
                        ? "all"
                        : repeatMode === "all"
                          ? "one"
                          : "none",
                    )
                  }
                  className={repeatMode !== "none" ? "text-purple-400" : ""}
                >
                  <Repeat className="w-5 h-5" />
                  {repeatMode === "one" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="sm" onClick={handleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-32">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {Math.round(isMuted ? 0 : volume * 100)}%
                </span>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-96 border-l border-border bg-background/50">
              {/* Tabs */}
              <div className="flex border-b border-border">
                <Button
                  variant={activeTab === "info" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("info")}
                  className="flex-1 rounded-none"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Info
                </Button>
                <Button
                  variant={activeTab === "queue" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("queue")}
                  className="flex-1 rounded-none"
                >
                  <ListMusic className="w-4 h-4 mr-2" />
                  Queue
                </Button>
              </div>

              <div className="p-4 h-full overflow-y-auto">
                {activeTab === "info" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentTrack.description ||
                          "No description available."}
                      </p>
                    </div>

                    {currentTrack.tags && currentTrack.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                          {currentTrack.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        {currentTrack.genre && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Genre:
                            </span>
                            <span>{currentTrack.genre}</span>
                          </div>
                        )}
                        {currentTrack.bpm && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">BPM:</span>
                            <span>{currentTrack.bpm}</span>
                          </div>
                        )}
                        {currentTrack.musicalKey && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Key:</span>
                            <span>{currentTrack.musicalKey}</span>
                          </div>
                        )}
                        {currentTrack.uploadDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Uploaded:
                            </span>
                            <span>
                              {new Date(
                                currentTrack.uploadDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "queue" && (
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-4">
                      Up Next ({playlist.length})
                    </h3>
                    {playlist.map((track, index) => (
                      <div
                        key={track.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          track.id === currentTrack.id
                            ? "bg-purple-500/20 border border-purple-500/30"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 text-xs text-muted-foreground">
                            {index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={track.trackImage} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                              <Music className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">
                              {track.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {track.artist}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(track.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FullMusicPlayer;
