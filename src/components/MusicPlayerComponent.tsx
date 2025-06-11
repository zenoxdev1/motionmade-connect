import MusicPlayer from "./MusicPlayer";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

const MusicPlayerComponent = () => {
  const { currentTrack, playlist, isPlayerVisible, playTrack, hidePlayer } =
    useMusicPlayer();

  return (
    <MusicPlayer
      currentTrack={currentTrack}
      playlist={playlist}
      isVisible={isPlayerVisible}
      onClose={hidePlayer}
      onTrackChange={playTrack}
    />
  );
};

export default MusicPlayerComponent;
