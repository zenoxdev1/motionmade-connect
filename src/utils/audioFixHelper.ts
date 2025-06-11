/**
 * Audio Fix Helper - Enhanced utilities to diagnose and fix audio playback issues
 * Now supports base64 data URLs and better validation
 */

export const diagnoseTrackAudio = (trackId: string) => {
  console.log("🔍 Diagnosing track audio:", trackId);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.error("❌ No user logged in");
    return;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );
  const track = userTracks.find((t: any) => t.id === trackId);

  if (!track) {
    console.error("❌ Track not found");
    return;
  }

  const audioInfo = {
    hasAudioUrl: !!track.audioUrl,
    audioUrlType: track.audioUrl?.startsWith("data:audio/")
      ? "Base64 Data URL"
      : track.audioUrl?.startsWith("blob:")
        ? "Blob URL"
        : track.audioUrl
          ? "Regular URL"
          : "None",
    audioUrlLength: track.audioUrl?.length || 0,
    isValidBase64:
      track.audioUrl?.startsWith("data:audio/") && track.audioUrl.includes(","),
    estimatedSizeMB: track.audioUrl
      ? ((track.audioUrl.length * 0.75) / 1024 / 1024).toFixed(2)
      : "0",
  };

  console.log("📝 Track details:", {
    id: track.id,
    title: track.title,
    fileName: track.fileName,
    fileSize: track.fileSize,
    audioUrl: audioInfo.hasAudioUrl ? "✅ Present" : "❌ Missing",
    audioUrlType: audioInfo.audioUrlType,
    audioUrlLength: audioInfo.audioUrlLength,
    estimatedSizeMB: audioInfo.estimatedSizeMB + " MB",
    isValidBase64: audioInfo.isValidBase64,
    uploadDate: track.uploadDate,
  });

  // Test if audio URL is accessible
  if (track.audioUrl) {
    const audio = new Audio();
    const testTimeout = setTimeout(() => {
      console.warn("⚠️ Audio loading taking too long (>5s)");
    }, 5000);

    audio.addEventListener("loadeddata", () => {
      clearTimeout(testTimeout);
      console.log("✅ Audio loads successfully");
      console.log("Duration:", audio.duration, "seconds");
      console.log("Ready state:", audio.readyState);
    });

    audio.addEventListener("canplay", () => {
      console.log("✅ Audio can play");
    });

    audio.addEventListener("error", (e) => {
      clearTimeout(testTimeout);
      console.error("❌ Audio loading failed:", e);
      console.error("Error code:", audio.error?.code);
      console.error("Error message:", audio.error?.message);
    });

    try {
      audio.src = track.audioUrl;
      audio.load();
    } catch (error) {
      clearTimeout(testTimeout);
      console.error("❌ Failed to set audio source:", error);
    }
  }

  return { track, audioInfo };
};

export const fixTrackAudio = async (trackId: string, newAudioFile?: File) => {
  console.log("🔧 Attempting to fix audio for track:", trackId);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.error("❌ No user logged in");
    return false;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );
  const trackIndex = userTracks.findIndex((t: any) => t.id === trackId);

  if (trackIndex === -1) {
    console.error("❌ Track not found");
    return false;
  }

  const track = userTracks[trackIndex];

  try {
    if (newAudioFile) {
      // User provided a new audio file
      console.log("📁 Processing new audio file...");

      // Validate file
      const allowedTypes = [
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
      ];
      if (!allowedTypes.includes(newAudioFile.type)) {
        console.error("❌ Invalid file type:", newAudioFile.type);
        return false;
      }

      // Convert to base64
      const audioUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          if (result.startsWith("data:audio/")) {
            resolve(result);
          } else {
            reject(new Error("Invalid audio data format"));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(newAudioFile);
      });

      // Update track with new audio
      track.audioUrl = audioUrl;
      track.fileSize = newAudioFile.size;
      track.fileName = newAudioFile.name;

      console.log("✅ New audio file processed and converted to base64");
    } else {
      console.warn(
        "⚠️ No new audio file provided - track will remain without audio",
      );
      return false;
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
    console.error("❌ Failed to fix track audio:", error);
    return false;
  }
};

export const fixAllUserTracks = async () => {
  console.log("🔧 Checking all user tracks for audio issues...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.error("❌ No user logged in");
    return 0;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );

  console.log(`Found ${userTracks.length} tracks to check`);

  userTracks.forEach((track: any, index: number) => {
    console.log(`\n--- Track ${index + 1}: ${track.title} ---`);
    diagnoseTrackAudio(track.id);
  });

  console.log("✅ Finished checking all tracks");
  console.log(
    "💡 To fix a specific track, use: fixTrackAudio('trackId', audioFile)",
  );

  return userTracks.length;
};

export const checkAllTracksAudio = () => {
  console.log("🔍 Checking audio status for all tracks...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.error("❌ No user logged in");
    return;
  }

  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userData.id}`) || "[]",
  );

  const results = {
    total: userTracks.length,
    withAudio: 0,
    withoutAudio: 0,
    withValidBase64: 0,
    withInvalidAudio: 0,
    tracks: [] as any[],
  };

  userTracks.forEach((track: any) => {
    const hasAudio = !!track.audioUrl;
    const isValidBase64 =
      track.audioUrl?.startsWith("data:audio/") && track.audioUrl.includes(",");

    if (hasAudio) {
      results.withAudio++;
      if (isValidBase64) {
        results.withValidBase64++;
      } else {
        results.withInvalidAudio++;
      }
    } else {
      results.withoutAudio++;
    }

    results.tracks.push({
      id: track.id,
      title: track.title,
      hasAudio,
      audioType: track.audioUrl?.startsWith("data:audio/")
        ? "Base64"
        : track.audioUrl?.startsWith("blob:")
          ? "Blob"
          : track.audioUrl
            ? "URL"
            : "None",
      isValid: isValidBase64,
      fileSize: track.fileSize,
      uploadDate: track.uploadDate,
    });
  });

  console.log("📊 Audio Check Results:", results);

  console.log("\n📋 Track Summary:");
  results.tracks.forEach((track, index) => {
    const status = track.hasAudio
      ? track.isValid
        ? "✅ Valid Audio"
        : "⚠️ Invalid Audio"
      : "❌ No Audio";
    console.log(
      `${index + 1}. ${track.title} - ${status} (${track.audioType})`,
    );
  });

  return results;
};

export const listTracksWithoutAudio = () => {
  console.log("📋 Listing tracks without audio URLs...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.error("❌ No user logged in");
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

export const validateBase64Audio = (dataUrl: string): boolean => {
  if (!dataUrl || typeof dataUrl !== "string") return false;
  if (!dataUrl.startsWith("data:audio/")) return false;

  const parts = dataUrl.split(",");
  if (parts.length !== 2) return false;

  try {
    // Try to decode base64
    atob(parts[1].substring(0, 100)); // Test first 100 chars
    return true;
  } catch {
    return false;
  }
};

export const getStorageUsage = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (!userData.id) {
      console.error("❌ No user logged in");
      return;
    }

    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${userData.id}`) || "[]",
    );

    let totalAudioSize = 0;
    let totalMetadataSize = 0;

    userTracks.forEach((track: any) => {
      if (track.audioUrl) {
        totalAudioSize += track.audioUrl.length;
      }

      const trackWithoutAudio = { ...track };
      delete trackWithoutAudio.audioUrl;
      totalMetadataSize += JSON.stringify(trackWithoutAudio).length;
    });

    const totalSize = totalAudioSize + totalMetadataSize;
    const maxStorage = 5 * 1024 * 1024; // 5MB typical localStorage limit

    console.log("💾 Storage Usage:");
    console.log(`Audio data: ${(totalAudioSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Metadata: ${(totalMetadataSize / 1024).toFixed(2)} KB`);
    console.log(`Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `Usage: ${((totalSize / maxStorage) * 100).toFixed(1)}% of estimated 5MB limit`,
    );

    return {
      audioSizeMB: totalAudioSize / 1024 / 1024,
      metadataSizeKB: totalMetadataSize / 1024,
      totalSizeMB: totalSize / 1024 / 1024,
      usagePercent: (totalSize / maxStorage) * 100,
    };
  } catch (error) {
    console.error("❌ Error calculating storage usage:", error);
  }
};

// Make available in browser console
if (typeof window !== "undefined") {
  (window as any).audioFixer = {
    diagnoseTrackAudio,
    fixTrackAudio,
    fixAllUserTracks,
    checkAllTracksAudio,
    listTracksWithoutAudio,
    validateBase64Audio,
    getStorageUsage,
  };
  console.log("🔧 Enhanced audio fixer available: window.audioFixer");
  console.log("📚 Available methods:");
  console.log("  - diagnoseTrackAudio(trackId)");
  console.log("  - fixTrackAudio(trackId, audioFile)");
  console.log("  - checkAllTracksAudio()");
  console.log("  - getStorageUsage()");
}
