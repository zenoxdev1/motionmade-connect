import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  allowDownload?: boolean;
  fileName?: string;
}

export const useTrackActions = () => {
  const { toast } = useToast();

  const shareTrack = (track: Track) => {
    const shareText = `🎵 Check out "${track.title}" by ${track.artist} on Motion Connect!`;
    const shareUrl = `${window.location.origin}/track/${track.id}`;

    if (navigator.share) {
      // Use native sharing if available
      navigator
        .share({
          title: track.title,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {
          // Fallback to clipboard
          copyToClipboard(shareText + " " + shareUrl);
        });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText + " " + shareUrl);
    }
  };

  const downloadTrack = (track: Track) => {
    if (!track.allowDownload) {
      toast({
        title: "Download not available",
        description: "The artist hasn't enabled downloads for this track.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you'd download the actual audio file
    // For demo, we'll simulate the download
    toast({
      title: "Download started",
      description: `Downloading "${track.title}"...`,
    });

    // Simulate download progress
    setTimeout(() => {
      toast({
        title: "Download completed",
        description: `"${track.title}" has been downloaded to your device.`,
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Track link has been copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Unable to copy link to clipboard.",
          variant: "destructive",
        });
      });
  };

  const likeTrack = (trackId: string, isLiked: boolean) => {
    // Update like status in localStorage
    const userId = JSON.parse(localStorage.getItem("userData") || "{}").id;
    if (userId) {
      // Update user's tracks
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${userId}`) || "[]",
      );
      const trackIndex = userTracks.findIndex((t: any) => t.id === trackId);
      if (trackIndex !== -1) {
        userTracks[trackIndex].likes =
          (userTracks[trackIndex].likes || 0) + (isLiked ? 1 : -1);
        localStorage.setItem(`tracks_${userId}`, JSON.stringify(userTracks));
      }

      // Update global tracks
      const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
      const globalTrackIndex = allTracks.findIndex(
        (t: any) => t.id === trackId,
      );
      if (globalTrackIndex !== -1) {
        allTracks[globalTrackIndex].likes =
          (allTracks[globalTrackIndex].likes || 0) + (isLiked ? 1 : -1);
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }
    }

    toast({
      title: isLiked ? "Added to favorites" : "Removed from favorites",
      description: `Track ${isLiked ? "liked" : "unliked"} successfully.`,
    });
  };

  return {
    shareTrack,
    downloadTrack,
    likeTrack,
  };
};
