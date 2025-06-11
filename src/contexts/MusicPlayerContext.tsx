import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface MusicPlayerContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlayerVisible: boolean;
  isPlaying: boolean;
  playTrack: (track: Track, playlist?: Track[]) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setPlaylist: (tracks: Track[]) => void;
  showPlayer: () => void;
  hidePlayer: () => void;
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

  const playTrack = (track: Track, newPlaylist?: Track[]) => {
    setCurrentTrack(track);
    if (newPlaylist) {
      setPlaylistState(newPlaylist);
    }
    setIsPlaying(true);
    setIsPlayerVisible(true);

    // Update play count in localStorage
    const userId = JSON.parse(localStorage.getItem("userData") || "{}").id;
    if (userId) {
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${userId}`) || "[]",
      );
      const trackIndex = userTracks.findIndex((t: any) => t.id === track.id);
      if (trackIndex !== -1) {
        userTracks[trackIndex].plays = (userTracks[trackIndex].plays || 0) + 1;
        localStorage.setItem(`tracks_${userId}`, JSON.stringify(userTracks));
      }

      // Update global tracks as well
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

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];

    if (nextTrack) {
      playTrack(nextTrack);
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
      playTrack(prevTrack);
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
    setIsPlaying(false);
  };

  const value: MusicPlayerContextType = {
    currentTrack,
    playlist,
    isPlayerVisible,
    isPlaying,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setPlaylist,
    showPlayer,
    hidePlayer,
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
