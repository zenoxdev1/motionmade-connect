/**
 * Audio Fix Helper - Utilities to diagnose and fix audio playback issues
 */

export const diagnoseTrackAudio = (trackId: string) => {
  console.log("🔍 Diagnosing audio for track:", trackId);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return null;
  }

  // Find the track
  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );
  const track = userTracks.find((t: any) => t.id === trackId);

  if (!track) {
    console.log("❌ Track not found");
    return null;
  }

  console.log("📁 Track found:", track.title);
  console.log("🎵 Audio URL:", track.audioUrl ? "✅ Present" : "❌ Missing");
  console.log("📏 File size:", track.fileSize || "Unknown");
  console.log("⏱️ Duration:", track.duration || "Unknown");

  if (track.audioUrl) {
    console.log(
      "🔗 Audio URL type:",
      track.audioUrl.startsWith("data:")
        ? "Base64 Data URL"
        : track.audioUrl.startsWith("blob:")
          ? "Blob URL (temporary)"
          : "Other",
    );

    // Test if URL is accessible
    try {
      const audio = new Audio();
      audio.addEventListener("loadeddata", () => {
        console.log("✅ Audio URL is accessible");
      });
      audio.addEventListener("error", (e) => {
        console.log("❌ Audio URL failed to load:", e);
      });
      audio.src = track.audioUrl;
    } catch (error) {
      console.log("❌ Error testing audio URL:", error);
    }
  }

  return track;
};

export const fixTrackAudio = async (trackId: string, newAudioFile?: File) => {
  console.log("🔧 Attempting to fix audio for track:", trackId);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return false;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );
  const trackIndex = userTracks.findIndex((t: any) => t.id === trackId);

  if (trackIndex === -1) {
    console.log("❌ Track not found");
    return false;
  }

  const track = userTracks[trackIndex];

  try {
    if (newAudioFile) {
      // User provided a new audio file
      console.log("📁 Processing new audio file...");

      const audioUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(newAudioFile);
      });

      // Update track with new audio
      track.audioUrl = audioUrl;
      track.fileSize = newAudioFile.size;
      track.fileName = newAudioFile.name;

      console.log("✅ New audio file processed");
    } else {
      // Try to generate a demo audio URL
      console.log("🔄 Generating demo audio...");

      // Create a simple demo audio URL (sine wave)
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const duration = track.duration || 180;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(
        1,
        duration * sampleRate,
        sampleRate,
      );

      const data = buffer.getChannelData(0);
      const frequency = 440; // A note

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.1;
      }

      // Convert to WAV blob
      const wavBlob = audioBufferToWavBlob(buffer);
      track.audioUrl = URL.createObjectURL(wavBlob);

      console.log("✅ Demo audio generated");
    }

    // Save updated track
    userTracks[trackIndex] = track;
    localStorage.setItem(`tracks_${userData.id}`, JSON.stringify(userTracks));

    // Update global tracks if public
    if (track.isPublic) {
      const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
      const globalIndex = allTracks.findIndex((t: any) => t.id === trackId);
      if (globalIndex !== -1) {
        allTracks[globalIndex] = track;
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }
    }

    console.log("✅ Track audio fixed and saved");
    return true;
  } catch (error) {
    console.log("❌ Failed to fix track audio:", error);
    return false;
  }
};

const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
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

  // WAV header
  writeString(0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Convert audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(
        -1,
        Math.min(1, buffer.getChannelData(channel)[i]),
      );
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
};

export const fixAllUserTracks = async () => {
  console.log("🔧 Fixing all user tracks without audio...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return 0;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );

  let fixedCount = 0;

  for (const track of userTracks) {
    if (!track.audioUrl || track.audioUrl.trim() === "") {
      console.log(`🔧 Fixing track: ${track.title}`);
      const success = await fixTrackAudio(track.id);
      if (success) {
        fixedCount++;
      }
    }
  }

  console.log(`✅ Fixed ${fixedCount} tracks`);
  return fixedCount;
};

export const listTracksWithoutAudio = () => {
  console.log("📋 Listing tracks without audio URLs...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return [];
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );

  const tracksWithoutAudio = userTracks.filter(
    (track: any) => !track.audioUrl || track.audioUrl.trim() === "",
  );

  console.log(`Found ${tracksWithoutAudio.length} tracks without audio:`);
  tracksWithoutAudio.forEach((track: any, index: number) => {
    console.log(`${index + 1}. ${track.title} (ID: ${track.id})`);
  });

  return tracksWithoutAudio;
};

// Make available in browser console
if (typeof window !== "undefined") {
  (window as any).audioFixer = {
    diagnoseTrackAudio,
    fixTrackAudio,
    fixAllUserTracks,
    listTracksWithoutAudio,
  };
  console.log("🔧 Audio fixer available: window.audioFixer");
}
