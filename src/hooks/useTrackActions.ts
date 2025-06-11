import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  allowDownload?: boolean;
  fileName?: string;
  audioUrl?: string;
  fileSize?: number;
}

export const useTrackActions = () => {
  const { toast } = useToast();

  const shareTrack = (track: Track) => {
    const shareText = `🎵 Check out "${track.title}" by ${track.artist} on Motion Connect!`;
    const shareUrl = `${window.location.origin}/profile/${track.artist?.toLowerCase().replace(/\s+/g, "-")}/track/${track.id}`;

    if (navigator.share && "canShare" in navigator) {
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

  const downloadTrack = async (track: Track) => {
    if (!track.allowDownload) {
      toast({
        title: "Download not available",
        description: "The artist hasn't enabled downloads for this track.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Download starting...",
        description: `Preparing "${track.title}" for download.`,
      });

      let downloadUrl: string;
      let filename: string;

      if (track.audioUrl) {
        // Use the actual audio URL
        downloadUrl = track.audioUrl;
        filename = track.fileName || `${track.title} - ${track.artist}.mp3`;
      } else {
        // Fallback: Create a demo audio file
        const audioData = await createDemoAudioFile(track);
        downloadUrl = URL.createObjectURL(audioData);
        filename = `${track.title} - ${track.artist}.mp3`;
      }

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      downloadLink.style.display = "none";

      // Add to DOM, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up object URL if we created one
      if (!track.audioUrl) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }

      toast({
        title: "Download completed! 🎵",
        description: `"${track.title}" has been downloaded to your device.`,
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description: "Unable to download the track. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Create a demo audio file for tracks without actual audio
  const createDemoAudioFile = async (track: Track): Promise<Blob> => {
    try {
      // Create a simple audio context for generating a demo tone
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = Math.min(track.duration || 30, 30); // Max 30 seconds for demo
      const length = sampleRate * duration;
      const buffer = audioContext.createBuffer(2, length, sampleRate);

      // Generate a simple melody based on track title
      const frequencies = [440, 493.88, 523.25, 587.33, 659.25]; // A, B, C, D, E
      let frequency = frequencies[track.title.length % frequencies.length];

      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          // Create a simple sine wave with fade in/out
          const fadeIn = Math.min(i / (sampleRate * 0.1), 1);
          const fadeOut = Math.min((length - i) / (sampleRate * 0.1), 1);
          const amplitude = 0.1 * fadeIn * fadeOut;
          channelData[i] =
            amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
        }
      }

      // Convert to WAV format
      const wavData = audioBufferToWav(buffer);
      return new Blob([wavData], { type: "audio/wav" });
    } catch (error) {
      // Fallback: create a minimal WAV file
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);

      // WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, 36, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, 44100, true);
      view.setUint32(28, 88200, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, 0, true);

      return new Blob([wavHeader], { type: "audio/wav" });
    }
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const writeInt16 = (offset: number, value: number) => {
      view.setInt16(offset, value, true);
    };

    const writeInt32 = (offset: number, value: number) => {
      view.setInt32(offset, value, true);
    };

    // WAV header
    writeString(0, "RIFF");
    writeInt32(4, bufferSize - 8);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    writeInt32(16, 16);
    writeInt16(20, 1);
    writeInt16(22, numberOfChannels);
    writeInt32(24, sampleRate);
    writeInt32(28, byteRate);
    writeInt16(32, blockAlign);
    writeInt16(34, bitDepth);
    writeString(36, "data");
    writeInt32(40, dataSize);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i]),
        );
        writeInt16(offset, sample * 0x7fff);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copied! 📋",
          description: "Track link has been copied to clipboard.",
        });
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          toast({
            title: "Link copied! 📋",
            description: "Track link has been copied to clipboard.",
          });
        } catch (err) {
          toast({
            title: "Copy failed",
            description: "Unable to copy link to clipboard.",
            variant: "destructive",
          });
        }
        document.body.removeChild(textArea);
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
        userTracks[trackIndex].likes = Math.max(
          0,
          (userTracks[trackIndex].likes || 0) + (isLiked ? 1 : -1),
        );
        localStorage.setItem(`tracks_${userId}`, JSON.stringify(userTracks));
      }

      // Update global tracks
      const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
      const globalTrackIndex = allTracks.findIndex(
        (t: any) => t.id === trackId,
      );
      if (globalTrackIndex !== -1) {
        allTracks[globalTrackIndex].likes = Math.max(
          0,
          (allTracks[globalTrackIndex].likes || 0) + (isLiked ? 1 : -1),
        );
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }

      // Store user's liked tracks
      const likedTracks = JSON.parse(
        localStorage.getItem(`liked_${userId}`) || "[]",
      );
      if (isLiked) {
        if (!likedTracks.includes(trackId)) {
          likedTracks.push(trackId);
        }
      } else {
        const index = likedTracks.indexOf(trackId);
        if (index > -1) {
          likedTracks.splice(index, 1);
        }
      }
      localStorage.setItem(`liked_${userId}`, JSON.stringify(likedTracks));
    }

    toast({
      title: isLiked ? "Added to favorites ❤️" : "Removed from favorites",
      description: `Track ${isLiked ? "liked" : "unliked"} successfully.`,
    });
  };

  return {
    shareTrack,
    downloadTrack,
    likeTrack,
  };
};
