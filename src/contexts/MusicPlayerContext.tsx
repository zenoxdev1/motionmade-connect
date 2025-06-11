import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { getAudioSafely } from "@/utils/audioStorage";

export interface Track {
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
  trackType?:
    | "loops"
    | "starters"
    | "beats"
    | "one-shots"
    | "drums"
    | "vocals"
    | "full-track";
  userId?: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlayerVisible: boolean;
  isPlaying: boolean;
  autoPlayEnabled: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isMinimized: boolean;
  playTrack: (
    track: Track,
    playlist?: Track[],
    autoPlay?: boolean,
  ) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setPlaylist: (tracks: Track[]) => void;
  showPlayer: () => void;
  hidePlayer: () => void;
  closePlayer: () => void;
  minimizePlayer: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  seekTo: (time: number) => void;
  setAutoPlay: (enabled: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined,
);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize global audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.crossOrigin = "anonymous";

      const audio = audioRef.current;

      // Event listeners
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        if (playlist.length > 1) {
          nextTrack();
        }
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleError = (e: any) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("loadedmetadata", handleDurationChange);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("loadedmetadata", handleDurationChange);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("error", handleError);
      };
    }
  }, []);

  // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = async (
    track: Track,
    newPlaylist?: Track[],
    autoPlay: boolean = true,
  ): Promise<void> => {
    try {
      setCurrentTrack(track);
      if (newPlaylist) {
        setPlaylistState(newPlaylist);
      }
      setIsPlayerVisible(true);

      // Resolve audio URL (handle both stored and direct URLs)
      let audioUrl = track.audioUrl;

      if (audioUrl?.startsWith("stored:")) {
        // Extract the storage key and get the actual audio data
        const storageKey = audioUrl.replace("stored:", "");
        const storedAudio = getAudioSafely(storageKey);

        if (storedAudio) {
          audioUrl = storedAudio;
        } else {
          console.error("Stored audio not found for key:", storageKey);
          throw new Error("Audio file is not available for this track");
        }
      }

      // Validate audio URL
      if (!audioUrl || !audioUrl.startsWith("data:audio/")) {
        console.error("Invalid or missing audio URL for track:", track.title);
        throw new Error("Audio file is not available for this track");
      }

      const audio = audioRef.current;
      if (!audio) {
        throw new Error("Audio element not available");
      }

      // Set audio source
      audio.src = audioUrl;
      audio.load();

      // Auto-play if enabled
      if (autoPlay && autoPlayEnabled) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (playError) {
          console.error("Auto-play failed:", playError);
          // Some browsers block auto-play, but track is still loaded
          setIsPlaying(false);
        }
      }

      // Update play count
      updatePlayCount(track);

      // Broadcast track change for real-time updates
      broadcastTrackChange(track);
    } catch (error) {
      console.error("Error playing track:", error);
      throw error;
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  const resumeTrack = async () => {
    if (audioRef.current && audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error resuming playback:", error);
      }
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];

    if (nextTrack) {
      playTrack(nextTrack, playlist, autoPlayEnabled);
    }
  };

  const previousTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    const prevTrack = playlist[prevIndex];

    if (prevTrack) {
      playTrack(prevTrack, playlist, autoPlayEnabled);
    }
  };

  const setPlaylist = (tracks: Track[]) => {
    setPlaylistState(tracks);
  };

  const showPlayer = () => {
    setIsPlayerVisible(true);
  };

  const hidePlayer = () => {
    setIsPlayerVisible(false);
    setIsMinimized(false);
  };

  const closePlayer = () => {
    setIsPlayerVisible(false);
    setIsMinimized(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const minimizePlayer = () => {
    setIsMinimized(true);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    setIsMuted(false);
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setAutoPlay = (enabled: boolean) => {
    setAutoPlayEnabled(enabled);
  };

  // Helper function to update play count
  const updatePlayCount = (track: Track) => {
    const userId = JSON.parse(localStorage.getItem("userData") || "{}").id;
    if (userId) {
      // Update user tracks (metadata only, safe from quota issues)
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${userId}`) || "[]",
      );
      const trackIndex = userTracks.findIndex((t: any) => t.id === track.id);
      if (trackIndex !== -1) {
        userTracks[trackIndex].plays = (userTracks[trackIndex].plays || 0) + 1;
        try {
          localStorage.setItem(`tracks_${userId}`, JSON.stringify(userTracks));
        } catch (error) {
          console.warn("Failed to update play count:", error);
          // Non-critical error, continue playing
        }
      }

      // Update global tracks
      const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
      const globalTrackIndex = allTracks.findIndex(
        (t: any) => t.id === track.id,
      );
      if (globalTrackIndex !== -1) {
        allTracks[globalTrackIndex].plays =
          (allTracks[globalTrackIndex].plays || 0) + 1;
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }
    }
  };

  // Real-time broadcasting system
  const broadcastTrackChange = (track: Track) => {
    // Create custom event for real-time updates
    const event = new CustomEvent("trackChanged", {
      detail: { track, timestamp: Date.now() },
    });
    window.dispatchEvent(event);

    // Update recently played
    const userId = JSON.parse(localStorage.getItem("userData") || "{}").id;
    if (userId) {
      const recentlyPlayed = JSON.parse(
        localStorage.getItem(`recent_${userId}`) || "[]",
      );

      // Remove if already exists and add to front
      const filtered = recentlyPlayed.filter((t: any) => t.id !== track.id);
      filtered.unshift(track);

      // Keep only last 50 tracks
      const limited = filtered.slice(0, 50);
      localStorage.setItem(`recent_${userId}`, JSON.stringify(limited));
    }
  };

  const value: MusicPlayerContextType = {
    currentTrack,
    playlist,
    isPlayerVisible,
    isPlaying,
    autoPlayEnabled,
    currentTime,
    duration,
    volume,
    isMuted,
    isMinimized,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setPlaylist,
    showPlayer,
    hidePlayer,
    closePlayer,
    minimizePlayer,
    setVolume,
    setMuted,
    seekTo,
    setAutoPlay,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
