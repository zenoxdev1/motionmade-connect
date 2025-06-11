import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Maximize2,
  Music,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  trackImage?: string;
  duration: number;
  fileName?: string;
  allowDownload?: boolean;
  likes?: number;
}

interface MusicPlayerProps {
  currentTrack: Track | null;
  playlist: Track[];
  isVisible: boolean;
  onClose: () => void;
  onTrackChange: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  playlist,
  isVisible,
  onClose,
  onTrackChange,
}) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // In a real app, you'd load the actual audio file
      // For demo, we'll simulate playback
      audio.play().catch(() => {
        // Fallback for demo - just toggle play state
        console.log("Playing:", currentTrack.title);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      const newTime = (value[0] / 100) * currentTrack.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
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
      navigator.clipboard.writeText(
        `Check out "${currentTrack.title}" by ${currentTrack.artist} on Motion Connect!`,
      );
      toast({
        title: "Link copied!",
        description: "Track link has been copied to clipboard.",
      });
    }
  };

  const handleDownload = () => {
    if (currentTrack?.allowDownload) {
      // In a real app, you'd download the actual file
      toast({
        title: "Download started",
        description: `Downloading "${currentTrack.title}"...`,
      });
    } else {
      toast({
        title: "Download not available",
        description: "The artist hasn't enabled downloads for this track.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `"${currentTrack?.title}" ${isLiked ? "removed from" : "added to"} your favorites.`,
    });
  };

  if (!isVisible || !currentTrack) return null;

  const progressPercentage =
    currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0;

  return (
    <>
      {/* Audio element for actual playback */}
      <audio ref={audioRef} preload="metadata" />

      {/* Player UI */}
      <Card className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-500/20 bg-gradient-to-r from-card via-card to-purple-950/10 backdrop-blur-md rounded-none">
        <div className="px-4 py-3">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="w-12 h-12 rounded-lg">
                <AvatarImage
                  src={currentTrack.trackImage}
                  alt={currentTrack.title}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg">
                  <Music className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium truncate">{currentTrack.title}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={isShuffled ? "text-purple-400" : ""}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handlePrevious}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNext}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
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
                  <Repeat className="w-4 h-4" />
                  {repeatMode === "one" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Track
                    </DropdownMenuItem>
                    {currentTrack.allowDownload && (
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Full Player
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MusicPlayer;
