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
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTrackActions } from "@/hooks/useTrackActions";
import FullMusicPlayer from "./FullMusicPlayer";

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
  const [audioError, setAudioError] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Load audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setIsLoading(true);
    setCurrentTime(0);
    setIsPlaying(false);
    setAudioError(false);

    // Check if we have a valid audio URL
    if (currentTrack.audioUrl && currentTrack.audioUrl.trim() !== "") {
      console.log(
        "Loading audio from URL:",
        currentTrack.audioUrl.substring(0, 50) + "...",
      );

      // Validate base64 data URL
      if (currentTrack.audioUrl.startsWith("data:audio/")) {
        try {
          audio.src = currentTrack.audioUrl;
          audio.load();
        } catch (error) {
          console.error("Error setting audio source:", error);
          setAudioError(true);
          setIsLoading(false);
          setDuration(currentTrack.duration);
        }
      } else {
        console.warn("Invalid audio URL format for track:", currentTrack.title);
        setAudioError(true);
        setIsLoading(false);
        setDuration(currentTrack.duration);
      }
    } else {
      console.log("No audio URL available for track:", currentTrack.title);
      setIsLoading(false);
      setDuration(currentTrack.duration);
      setAudioError(true);
      return;
    }

    const handleLoadedData = () => {
      setDuration(audio.duration || currentTrack.duration);
      setIsLoading(false);
      setAudioError(false);
      console.log("Audio loaded successfully, duration:", audio.duration);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioError(false);
    };

    const handleError = (e: any) => {
      console.error("Audio loading error:", e);
      setIsLoading(false);
      setAudioError(true);
      setDuration(currentTrack.duration);

      toast({
        title: "Audio loading failed",
        description:
          "Could not load audio file. The track may be corrupted or unsupported.",
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

    const updateTime = () => {
      if (!audioError && audio.src) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);

      if (repeatMode === "one") {
        // Restart the track
        if (!audioError && audio.src) {
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true);
        }
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
  }, [repeatMode, playlist.length, audioError]);

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

    if (audioError || !currentTrack.audioUrl) {
      toast({
        title: "Audio unavailable",
        description: "This track doesn't have a valid audio file.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Ensure audio source is set
        if (!audio.src && currentTrack.audioUrl) {
          audio.src = currentTrack.audioUrl;
        }
        await audio.play();
      }
    } catch (error) {
      console.error("Play/pause error:", error);
      setAudioError(true);
      toast({
        title: "Playback Error",
        description:
          "Unable to play this track. The audio file may be corrupted.",
        variant: "destructive",
      });
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    const newTime = (value[0] / 100) * duration;

    if (audio && !audioError && audio.src) {
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

  const openFullPlayer = () => {
    setIsFullPlayerOpen(true);
  };

  if (!isVisible || !currentTrack) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio element for actual playback */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* Compact Player UI */}
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
              disabled={isLoading || audioError}
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
                  disabled={isLoading || audioError}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
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
