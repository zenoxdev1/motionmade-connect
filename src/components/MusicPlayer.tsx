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
  const [simulationInterval, setSimulationInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Load audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setIsLoading(true);
    setCurrentTime(0);
    setIsPlaying(false);
    setAudioError(false);

    // Clear any existing simulation
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }

    // Try to load real audio if available
    if (currentTrack.audioUrl && currentTrack.audioUrl.trim() !== "") {
      console.log("Loading audio from URL:", currentTrack.audioUrl);
      audio.src = currentTrack.audioUrl;
      audio.load();
    } else {
      // No audio URL available, set up for demo mode
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

      // Don't show error toast immediately, wait for user to try playing
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [currentTrack, toast, simulationInterval]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!audioError) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }

      if (repeatMode === "one") {
        // Restart the track
        if (!audioError && audio.src) {
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true);
        } else {
          startSimulation();
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
  }, [repeatMode, playlist.length, audioError, simulationInterval]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const startSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }

    setCurrentTime(0);
    setIsPlaying(true);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= duration) {
          clearInterval(interval);
          setSimulationInterval(null);
          setIsPlaying(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsPlaying(false);
  };

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
        if (audioError || !audio.src) {
          // Stop simulation
          stopSimulation();
        } else {
          // Pause real audio
          audio.pause();
        }
      } else {
        if (audioError || !audio.src) {
          // Show error message first time, then start simulation
          if (!simulationInterval) {
            toast({
              title: "Audio unavailable",
              description: "Playing in demo mode with track metadata only.",
              variant: "destructive",
            });
          }
          startSimulation();
        } else {
          // Try to play real audio
          try {
            await audio.play();
          } catch (playError) {
            console.error("Playback failed, starting simulation:", playError);
            setAudioError(true);
            toast({
              title: "Audio playback failed",
              description: "Playing in demo mode with track metadata only.",
              variant: "destructive",
            });
            startSimulation();
          }
        }
      }
    } catch (error) {
      console.error("Play/pause error:", error);
      toast({
        title: "Playback Error",
        description: "Unable to play this track. Using demo mode.",
        variant: "destructive",
      });

      if (isPlaying) {
        stopSimulation();
      } else {
        startSimulation();
      }
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
      // Stop current simulation
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
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
      // Stop current simulation
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
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

  if (!isVisible || !currentTrack) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio element for actual playback */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

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
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
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
                <h4 className="font-medium truncate flex items-center">
                  {currentTrack.title}
                  {audioError && (
                    <AlertCircle
                      className="w-4 h-4 ml-2 text-yellow-500"
                      title="Audio unavailable - demo mode"
                    />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                  {audioError && (
                    <span className="text-yellow-500 ml-2">(Demo Mode)</span>
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
                  disabled={isLoading}
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
