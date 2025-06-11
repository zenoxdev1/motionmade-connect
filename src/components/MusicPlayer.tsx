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
  Minimize2,
  X,
  Music,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTrackActions } from "@/hooks/useTrackActions";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import FullMusicPlayer from "./FullMusicPlayer";
import {
  storeAudioSafely,
  getAudioSafely,
  getStorageInfo,
} from "@/utils/audioStorage";

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
  const { shareTrack, downloadTrack, likeTrack } = useTrackActions();
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isMinimized,
    pauseTrack,
    resumeTrack,
    setVolume,
    setMuted,
    seekTo,
    nextTrack,
    previousTrack,
    closePlayer,
    minimizePlayer,
  } = useMusicPlayer();

  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [isLiked, setIsLiked] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Check if current track has valid audio
  useEffect(() => {
    if (currentTrack) {
      const hasValidAudio =
        currentTrack.audioUrl &&
        currentTrack.audioUrl.startsWith("data:audio/");
      setAudioError(!hasValidAudio);
    }
  }, [currentTrack]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = async () => {
    if (!currentTrack) return;

    // Check for audio availability with better error messages
    if (audioError || !currentTrack.audioUrl) {
      const storageInfo = getStorageInfo();
      const isStorageFull = storageInfo.usagePercentage > 95;

      toast({
        title: "Audio unavailable",
        description: isStorageFull
          ? "Storage is full. Try clearing some space and reloading the track."
          : "This track doesn't have a valid audio file.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isPlaying) {
        pauseTrack();
      } else {
        await resumeTrack();
      }
    } catch (error) {
      console.error("Play/pause error:", error);
      setAudioError(true);

      // Try to get better error info
      const storageInfo = getStorageInfo();
      const errorMessage =
        storageInfo.usagePercentage > 90
          ? "Storage is nearly full. This may affect playback quality."
          : "Unable to play this track. The audio file may be corrupted.";

      toast({
        title: "Playback Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setMuted(false);
  };

  const handleMute = () => {
    setMuted(!isMuted);
  };

  const handleNext = () => {
    nextTrack();
  };

  const handlePrevious = () => {
    previousTrack();
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

      // Broadcast like event for real-time updates
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (userData.id) {
        const event = new CustomEvent("trackLiked", {
          detail: {
            track: currentTrack,
            likedBy: {
              id: userData.id,
              name: userData.fullName,
              avatar: userData.avatar,
              username: userData.username,
            },
          },
        });
        window.dispatchEvent(event);
      }
    }
  };

  const openFullPlayer = () => {
    setIsFullPlayerOpen(true);
  };

  if (!isVisible || !currentTrack) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Compact Player UI */}
      <Card
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-purple-500/20 bg-gradient-to-r from-card via-card to-purple-950/10 backdrop-blur-md rounded-none transition-all duration-300 ${
          isMinimized ? "transform translate-y-16" : ""
        }`}
      >
        <div className="px-4 py-3">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              disabled={audioError}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div
              className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
              onClick={openFullPlayer}
            >
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
                <h4 className="font-medium truncate flex items-center">
                  {currentTrack.title}
                  {audioError && (
                    <AlertCircle
                      className="w-4 h-4 ml-2 text-red-500"
                      title="Audio unavailable"
                    />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                  {audioError && (
                    <span className="text-red-500 ml-2">(No Audio)</span>
                  )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={playlist.length <= 1}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  disabled={audioError}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={playlist.length <= 1}
                >
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePlayer}
                  className="text-muted-foreground hover:text-red-500"
                  title="Close player"
                >
                  <X className="w-4 h-4" />
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
                    <DropdownMenuItem onClick={openFullPlayer}>
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Full Player
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={minimizePlayer}>
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minimize
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={closePlayer}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close Player
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Full Music Player */}
      <FullMusicPlayer
        currentTrack={currentTrack}
        playlist={playlist}
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        onTrackChange={onTrackChange}
      />
    </>
  );
};

export default MusicPlayer;
